
import express from 'express';
import { v4 as uuid, validate } from 'uuid';

import database from '../database';
import { isOfType } from '../util';
import { requireVerification, Token } from './auth';
import { generateFromFlatResult } from './task';

const project = express();

project.use(requireVerification);

project.get('/', async (req, res) => {
    try {
        const projects = await database('team_members')
            .innerJoin('team_projects', 'team_members.team_id', 'team_projects.team_id')
            .innerJoin('projects', 'team_projects.project_id', 'projects.id')
            .select({
                id: 'projects.id',
                name: 'projects.name',
                status: 'projects.status',
            })
            .where({
                'team_members.user_id': req.body.token.id,
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
            const projects = await database('team_members')
                .innerJoin('team_projects', 'team_members.team_id', 'team_projects.team_id')
                .innerJoin('projects', 'team_projects.project_id', 'projects.id')
                .innerJoin({ 'tms': 'team_projects' }, 'projects.id', 'tms.project_id')
                .select({
                    id: 'projects.id',
                    name: 'projects.name',
                    status: 'projects.status',
                    team_id: 'tms.team_id',
                })
                .where({
                    'team_members.user_id': req.body.token.id,
                    'projects.id': id,
                })
                .groupBy('tms.team_id');
            if (projects.length >= 1) {
                res.status(200).json({
                    status: 'success',
                    project: {
                        id: projects[0].id,
                        name: projects[0].name,
                        status: projects[0].status,
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

project.get('/:uuid/tasks', async (req, res) => {
    try {
        const id = req.params.uuid;
        if (validate(id)) {
            const tasks = await database('team_members')
                .innerJoin('team_projects', 'team_members.team_id', 'team_projects.team_id')
                .innerJoin('tasks', 'team_projects.project_id', 'tasks.project_id')
                .leftJoin('task_requirements', 'tasks.id', 'task_requirements.task_id')
                .leftJoin('task_dependencies', 'tasks.id', 'task_dependencies.task_id')
                .leftJoin('task_assignees', 'tasks.id', 'task_assignees.task_id')
                .select({
                    id: 'tasks.id',
                    project: 'tasks.project_id',
                    name: 'tasks.name',
                    text: 'tasks.text',
                    icon: 'tasks.icon',
                    status: 'tasks.status',
                    priority: 'tasks.priority',
                    created: 'tasks.created',
                    edited: 'tasks.edited',
                    requirement_role: 'task_requirements.role_id', 
                    requirement_time: 'task_requirements.time', 
                    assigned_user: 'task_assignees.user_id', 
                    assigned_time: 'task_assignees.time', 
                    dependentcy: 'task_dependencies.requires_id', 
                })
                .where({
                    'team_members.user_id': req.body.token.id,
                    'team_projects.project_id': id,
                });
            res.status(200).json({
                status: 'success',
                tasks: generateFromFlatResult(tasks),
            });
        } else {
            res.status(400).json({
                status: 'error',
                message: 'malformed uuid',
            });
        }
    } catch (e) {
        res.status(400).json({
            status: 'error',
            message: 'failed to get tasks',
        });
    }
});

interface AddProjectBody {
    teams: Array<string>;
    name: string;
    color: string;
    token: Token;
}

project.post('/', async (req, res) => {
    if (isOfType<AddProjectBody>(req.body, [['teams', 'object'], ['name', 'string'], ['color', 'string']])) {
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
            const color = req.body.color;
            if (!color.match(/^#[0-9a-fA-F]{6}$/)) {
                res.status(400).json({
                    status: 'error',
                    message: 'malformed color',
                });
            } else {
                const project_id = uuid();
                const team = await database('team_members')
                    .select({ id: 'team_members.team_id' })
                    .where({
                        'team_members.user_id': req.body.token.id,
                    })
                    .whereIn('team_members.team_id', team_ids);
                if (team.length === team_ids.length) {
                    await database.transaction(async transaction => {
                        await transaction('projects').insert({
                            id: project_id,
                            name: req.body.name,
                            status: 'open',
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
    remove_teams?: Array<string>;
    add_teams?: Array<string>;
    name?: string;
    color?: string;
    status?: string;
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
                const projects = await database('team_members')
                    .innerJoin('team_projects', 'team_members.team_id', 'team_projects.team_id')
                    .innerJoin('projects', 'team_projects.project_id', 'projects.id')
                    .select({ id: 'projects.id' })
                    .where({
                        'team_members.user_id': req.body.token.id,
                        'projects.id': id,
                    });
                if (projects.length >= 1) {
                    await database.transaction(async transaction => {
                        await transaction('projects')
                            .update({
                                name: req.body.name,
                                color: req.body.color,
                                status: req.body.status,
                            }).where({
                                id: id,
                            });
                        if (remove_team_ids.length !== 0) {
                            await transaction('team_projects')
                                .delete()
                                .where({
                                    'project_id': id,
                                })
                                .whereIn('team_id', remove_team_ids);
                        }
                        if (add_team_ids.length !== 0) {
                            await transaction('team_projects').insert(
                                add_team_ids.map(team_id => ({
                                    project_id: id,
                                    team_id: team_id,
                                }))
                            );
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
