
import express from 'express';
import { v4 as uuid, validate } from 'uuid';

import database from '../database';
import { isOfType } from '../util';
import { requireVerification, Token } from './auth';
import { generateFromFlatResult } from './task';

const project = express();

project.use(requireVerification);

/*
 * This route should return all projects visible to the user.
 */
project.get('/', async (req, res) => {
    try {
        const projects = await database('team_members')
            .innerJoin('team_projects', 'team_members.team_id', 'team_projects.team_id')
            .innerJoin('projects', 'team_projects.project_id', 'projects.id')
            .select({
                id: 'projects.id',
                name: 'projects.name',
                text: 'projects.text',
                color: 'projects.color',
                status: 'projects.status',
                deadline: 'projects.deadline',
            })
            .where({
                'team_members.user_id': req.body.token.id,
            })
            .groupBy('projects.id');
        res.status(200).json({
            status: 'success',
            projects: projects.map(project => ({
                ...project,
                deadline: project.deadline && (new Date(project.deadline)).toISOString().substr(0, 10),
            })),
        });
    } catch (e) {
        res.status(400).json({
            status: 'error',
            message: 'failed to get project',
        });
    }
});

/*
 * This route should return information on an existing project.
 */
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
                    text: 'projects.text',
                    color: 'projects.color',
                    status: 'projects.status',
                    deadline: 'projects.deadline',
                    team_id: 'tms.team_id',
                })
                .where({
                    'team_members.user_id': req.body.token.id,
                    'projects.id': id,
                })
                .groupBy('tms.team_id')
                .groupBy('projects.id');
            if (projects.length >= 1) {
                res.status(200).json({
                    status: 'success',
                    project: {
                        id: projects[0].id,
                        name: projects[0].name,
                        text: projects[0].text,
                        status: projects[0].status,
                        color: projects[0].color,
                        deadline: projects[0].deadline && (new Date(projects[0].deadline)).toISOString().substr(0, 10),
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

/*
 * This route should return the task for an existing project.
 */
project.get('/:uuid/tasks', async (req, res) => {
    try {
        const id = req.params.uuid;
        if (validate(id)) {
            const tasks = await database('team_members')
                .innerJoin('team_projects', 'team_members.team_id', 'team_projects.team_id')
                .innerJoin('tasks', 'team_projects.project_id', 'tasks.project_id')
                .innerJoin('projects', 'tasks.project_id', 'projects.id')
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
                    color: 'projects.color',
                    requirement_role: 'task_requirements.role_id', 
                    requirement_time: 'task_requirements.time', 
                    assigned_user: 'task_assignees.user_id', 
                    assigned_time: 'task_assignees.time', 
                    assigned_finished: 'task_assignees.finished', 
                    dependency: 'task_dependencies.requires_id', 
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

/*
 * This route should return all users assigned to tasks of an existing project.
 */
project.get('/:uuid/assigned', async (req, res) => {
    try {
        const id = req.params.uuid;
        if (validate(id)) {
            const users = await database('team_members')
                .innerJoin('team_projects', 'team_members.team_id', 'team_projects.team_id')
                .innerJoin('tasks', 'team_projects.project_id', 'tasks.project_id')
                .innerJoin('task_assignees', 'tasks.id', 'task_assignees.task_id')
                .innerJoin('users', 'task_assignees.user_id', 'users.id')
                .select({
                    id: 'users.id',
                    username: 'users.user_name',
                    email: 'users.email',
                    realname: 'users.real_name',
                })
                .sum({ time: 'task_assignees.time' })
                .where({
                    'team_members.user_id': req.body.token.id,
                    'team_projects.project_id': id,
                })
                .groupBy('users.id');
            res.status(200).json({
                status: 'success',
                assigned: users,
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
            message: 'failed to get assignees',
        });
    }
});

/*
 * This route should return all work items done for tasks of an existing project.
 */
project.get('/:uuid/work', async (req, res) => {
    try {
        const id = req.params.uuid;
        if (validate(id)) {
            const since = new Date(parseInt(req.query.since as string ?? 0));
            const to = new Date(parseInt(req.query.to as string ?? Date.now()));
            const work = await database({ ut: 'team_members' })
                .innerJoin('team_projects', 'ut.team_id', 'team_projects.team_id')
                .innerJoin('tasks', 'team_projects.project_id', 'tasks.project_id')
                .innerJoin('workhours', 'tasks.id', 'workhours.task_id')
                .select({
                    id: 'workhours.id',
                    task: 'workhours.task_id',
                    user: 'workhours.user_id',
                    started: 'workhours.started',
                    finished: 'workhours.finished',
                })
                .where({
                    'ut.user_id': req.body.token.id,
                    'team_projects.project_id': id,
                })
                .andWhere('workhours.started', '>=', since.getTime())
                .andWhere('workhours.started', '<=', to.getTime())
                .groupBy('workhours.id');
            res.status(200).json({
                status: 'success',
                work: work,
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
            message: 'failed get work',
        });
    }
});

/*
 * This route should return the activity for an existing project.
 */
project.get('/:uuid/activity', async (req, res) => {
    try {
        const id = req.params.uuid;
        if (validate(id)) {
            const since = new Date(parseInt(req.query.since as string ?? 0));
            const to = new Date(parseInt(req.query.to as string ?? Date.now()));
            const activity = await database(
                    database('team_members')
                    .innerJoin('team_projects', 'team_members.team_id', 'team_projects.team_id')
                    .innerJoin('tasks', 'team_projects.project_id', 'tasks.project_id')
                    .innerJoin('workhours', 'tasks.id', 'workhours.task_id')
                    .select({
                        started: 'workhours.started',
                        finished: 'workhours.finished',
                    })
                    .where({
                        'team_members.user_id': req.body.token.id,
                        'team_projects.project_id': id,
                    })
                    .andWhereNot({ 'workhours.finished': null })
                    .andWhere('workhours.started', '>=', since.getTime())
                    .andWhere('workhours.started', '<=', to.getTime())
                    .groupBy('workhours.id')
                    .as('activity')
                )
                .select({
                    day: database.raw('(activity.started / 1000 / 60 / 60 / 24)'),
                })
                .sum({ time: database.raw('(activity.finished - activity.started)') })
                .groupBy('day');
            res.status(200).json({
                status: 'success',
                activity: activity.map((act: any) => ({
                    ...act,
                    day: (new Date(act.day * 24 * 60 * 60 * 1000)).toISOString().substring(0, 10),
                })),
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
            message: 'failed get activity',
        });
    }
});

/*
 * This route should return the completion for an existing project.
 */
project.get('/:uuid/completion', async (req, res) => {
    try {
        const id = req.params.uuid;
        if (validate(id)) {
            const since = new Date(parseInt(req.query.since as string ?? 0));
            const to = new Date(parseInt(req.query.to as string ?? Date.now()));
            const completion: any[] = await database(
                    database('team_members')
                        .innerJoin('team_projects', 'team_members.team_id', 'team_projects.team_id')
                        .innerJoin('tasks', 'team_projects.project_id', 'tasks.project_id')
                        .select({
                            id: 'tasks.id',
                            status: database.raw(
                                `Case When tasks.status = 'open'
                                    And (Select
                                            Sum(task_requirements.time * 60 * 1000)
                                            from task_requirements where task_requirements.task_id = tasks.id)
                                        < (Select
                                            Sum(workhours.finished - workhours.started)
                                            from workhours where workhours.task_id = tasks.id)
                                    Then 'overdue' Else tasks.status End`),
                        })
                        .where({
                            'team_members.user_id': req.body.token.id,
                            'team_projects.project_id': id,
                        })
                        .andWhere('tasks.edited', '>=', since.getTime())
                        .andWhere('tasks.created', '<=', to.getTime())
                        .groupBy('tasks.id')
                        .as('task_status')
                )
                .select({
                    status: 'task_status.status',
                })
                .count({ count: 'task_status.id' })
                .groupBy('task_status.status');
            res.status(200).json({
                status: 'success',
                completion: completion.reduce((object, { status, count }) => ({
                    ...object,
                    [status]: count,
                }), { open: 0, closed: 0, suspended: 0, overdue: 0 }),
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
            message: 'failed get completion',
        });
    }
});

interface AddProjectBody {
    teams: Array<string>;
    name: string;
    text: string;
    color: string;
    deadline?: string;
    token: Token;
}

/*
 * This route should create a new project.
 */
project.post('/', async (req, res) => {
    if (isOfType<AddProjectBody>(req.body, [['teams', 'object'], ['name', 'string'], ['text', 'string'], ['color', 'string']])) {
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
                            text: req.body.text,
                            color: req.body.color,
                            deadline: req.body.deadline ? (new Date(req.body.deadline)).toISOString().substr(0, 10) : null,
                            status: 'open',
                        })
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
    remove_teams?: Array<string>;
    add_teams?: Array<string>;
    name?: string;
    text?: string;
    color?: string;
    status?: string;
    deadline?: string;
    token: Token;
}

/*
 * This route should update an existing project.
 */
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
                        if (req.body.name || req.body.text || req.body.color || req.body.status || req.body.deadline) {
                            await transaction('projects')
                                .update({
                                    name: req.body.name,
                                    text: req.body.text,
                                    color: req.body.color,
                                    status: req.body.status,
                                    deadline: req.body.deadline ? (new Date(req.body.deadline)).toISOString().substr(0, 10) : null,
                                }).where({
                                    id: id,
                                });
                        }
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
