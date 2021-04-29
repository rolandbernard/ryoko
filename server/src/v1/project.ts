
import express from 'express';
import { v4 as uuid, validate } from 'uuid';

import database from '../database';
import { isOfType } from '../util';
import { requireVerification, Token } from './auth';

const project = express();

project.use(requireVerification);

project.get('/', async (req, res) => {
    try {
        const projects = await database('users')
            .innerJoin('team_members', 'users.id', 'team_members.user_id')
            .innerJoin('team_projects', 'team_members.team_id', 'team_projects.team_id')
            .innerJoin('projects', 'team_projects.project_id', 'projects.id')
            .select({
                id: 'projects.id',
                name: 'projects.name',
            })
            .where({
                'users.id': req.body.token.id,
            })
            .groupBy('projects.id');
        res.status(200).json({
            status: 'success',
            projects: projects,
        });
    } catch (e) {
        res.status(400).json({
            status: 'error',
            message: 'failed to get project',
        });
    }
});

project.get('/:uuid', async (req, res) => {
    try {
        const id = req.params.uuid;
        if (validate(id)) {
            const projects = await database('users')
                .innerJoin('team_members', 'users.id', 'team_members.user_id')
                .innerJoin('team_projects', 'team_members.team_id', 'team_projects.team_id')
                .innerJoin('projects', 'team_projects.project_id', 'projects.id')
                .select({
                    id: 'projects.id',
                    name: 'projects.name',
                    team_id: 'team_projects.team_id',
                })
                .where({
                    'users.id': req.body.token.id,
                    'projects.id': id,
                });
            if (projects.length >= 1) {
                res.status(200).json({
                    status: 'success',
                    project: {
                        id: projects[0].id,
                        name: projects[0].name,
                        teams: projects.map(task => task.team_id),
                    }
                });
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'project not found',
                });
            }
        } else {
            res.status(400).json({
                status: 'error',
                message: 'malformed uuid',
            });
        }
    } catch (e) {
        res.status(400).json({
            status: 'error',
            message: 'failed to get project',
        });
    }
});

interface AddProjectBody {
    teams: Array<string>;
    name: string;
    token: Token;
}

project.post('/', async (req, res) => {
    if (isOfType<AddProjectBody>(req.body, [['teams', 'object'], ['name', 'string']])) {
        try {
            const team_ids = req.body.teams;
            for (const team_id of team_ids) {
                if (!validate(team_id)) {
                    res.status(400).json({
                        status: 'error',
                        message: 'malformed uuid',
                    });
                    return;
                }
            }
            const project_id = uuid();
            const team = await database('users')
                .innerJoin('team_members', 'users.id', 'team_members.user_id')
                .select({ id: 'team_members.team_id' })
                .where({
                    'users.id': req.body.token.id,
                })
                .whereIn('team_members.team_id', team_ids);
            if (team.length === team_ids.length) {
                await database.transaction(async transaction => {
                    await transaction('projects').insert({
                        id: project_id,
                        name: req.body.name,
                    });
                    await transaction('team_projects').insert(
                        team_ids.map(team_id => ({
                            project_id: project_id,
                            team_id: team_id,
                        }))
                    );
                });
                res.status(200).json({
                    status: 'success',
                    id: project_id,
                });
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'team not found',
                });
            }
        } catch (e) {
            res.status(400).json({
                status: 'error',
                message: 'failed to create project',
            });
        }
    } else {
        res.status(400).json({
            status: 'error',
            message: 'missing request fields',
        });
    }
});

interface UpdateProjectBody {
    add_teams?: Array<string>;
    remove_teams?: Array<string>;
    name?: string;
    token: Token;
}

project.put('/:uuid', async (req, res) => {
    if (isOfType<UpdateProjectBody>(req.body, [])) {
        try {
            const id = req.params.uuid;
            if (validate(id)) {
                const add_team_ids = req.body.add_teams ?? [];
                const remove_team_ids = req.body.remove_teams ?? [];
                for (const team_id of add_team_ids.concat(remove_team_ids)) {
                    if (!validate(team_id)) {
                        res.status(400).json({
                            status: 'error',
                            message: 'malformed uuid',
                        });
                        return;
                    }
                }
                const projects = await database('users')
                    .innerJoin('team_members', 'users.id', 'team_members.user_id')
                    .innerJoin('team_projects', 'team_members.team_id', 'team_projects.team_id')
                    .innerJoin('projects', 'team_projects.project_id', 'projects.id')
                    .select({
                        id: 'projects.id',
                        name: 'projects.name',
                        team_id: 'team_projects.team_id',
                    })
                    .where({
                        'users.id': req.body.token.id,
                        'projects.id': id,
                    });
                if (projects.length >= 1) {
                    await database.transaction(async transaction => {
                        if (typeof req.body.name === 'string') {
                            await transaction('projects')
                                .update({
                                    name: req.body.name,
                                }).where({
                                    id: id,
                                });
                        }
                        if (add_team_ids.length !== 0) {
                            await transaction('team_projects').insert(
                                add_team_ids.map(team_id => ({
                                    project_id: id,
                                    team_id: team_id,
                                }))
                            );
                        }
                        if (remove_team_ids.length !== 0) {
                            await transaction('team_projects')
                                .delete()
                                .where({
                                    'project_id': id,
                                })
                                .whereIn('team_id', remove_team_ids);
                        }
                    });
                    res.status(200).json({
                        status: 'success',
                    });
                } else {
                    res.status(400).json({
                        status: 'error',
                        message: 'project not found',
                    });
                }
            } else {
                res.status(400).json({
                    status: 'error',
                    message: 'malformed uuid',
                });
            }
        } catch (e) {
            res.status(400).json({
                status: 'error',
                message: 'failed to create project',
            });
        }
    } else {
        res.status(400).json({
            status: 'error',
            message: 'missing request fields',
        });
    }
});

export default project;
