
import express from 'express';
import { v4 as uuid, validate } from 'uuid';

import database from '../database';
import { requireVerification, Token } from './auth';
import { isOfType } from '../util';

const task = express();

task.use(requireVerification);

task.get('/:uuid', async (req, res) => {
    try {
        const id = req.params.uuid;
        if (validate(id)) {
            const task = await database('users')
                .innerJoin('team_members', 'users.id', 'team_members.user_id')
                .innerJoin('team_projects', 'team_members.team_id', 'team_projects.team_id')
                .innerJoin('tasks', 'team_projects.project_id', 'tasks.project_id')
                .select({
                    id: 'tasks.id',
                    project: 'tasks.project_id',
                    name: 'tasks.name',
                    text: 'tasks.text',
                    status: 'tasks.status',
                    priority: 'tasks.priority',
                    created: 'tasks.created',
                    edited: 'tasks.edited',
                })
                .where({
                    'users.id': req.body.token.id,
                    'tasks.id': id,
                });
            if (task.length >= 1) {
                const assigned = await database('task_assignees')
                    .select({
                        id: 'task_assignees.user_id',
                    })
                    .where({
                        'task_assignees.task_id': id,
                    });
                const dependentcies = await database('task_dependencies')
                    .select({
                        id: 'task_dependencies.requires_id',
                    })
                    .where({
                        'task_dependencies.task_id': id,
                    });
                const requirements = await database('task_requirements')
                    .select({
                        role: 'task_requirements.role_id',
                        time: 'task_requirements.time'
                    })
                    .where({
                        'task_requirements.task_id': id,
                    });
                res.status(200).json({
                    status: 'success',
                    task: {
                        ...task[0],
                        assigned: assigned.map(row => row.id),
                        dependentcies: dependentcies.map(row => row.id),
                        requirements: requirements.map(row => ({
                            role: row.role,
                            time: row.time,
                        })),
                    },
                });
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'task not found',
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
            message: 'failed get task',
        });
    }
});

interface TaskRequirement {
    role: string;
    time: number;
}

interface AddTaskBody {
    project: string;
    name: string;
    text: string;
    icon: string;
    priority: string;
    dependentcies: Array<string>;
    requirements: Array<TaskRequirement>;
    assigned: Array<string>;
    token: Token;
}

task.post('/', async (req, res) => {
    if (isOfType<AddTaskBody>(req.body, [
        ['project', 'string'], ['name', 'string'], ['text', 'string'], ['icon', 'string'],
        ['priority', 'string'], ['dependentcies', 'object'], ['requirements', 'object'],
    ])) {
        try {
            const project_id = req.body.project;
            const dependentcy_ids = req.body.dependentcies;
            const assigned_ids = req.body.assigned;
            const requirements = req.body.requirements;
            const requirement_ids = requirements.map(req => req.role);
            for (const team_id of [ ...dependentcy_ids, ...requirement_ids, ...assigned_ids, project_id ]) {
                if (!validate(team_id)) {
                    res.status(400).json({
                        status: 'error',
                        message: 'malformed uuid',
                    });
                    return;
                }
            }
            const task_id = uuid();
            const project = await database('users')
                .innerJoin('team_members', 'users.id', 'team_members.user_id')
                .innerJoin('team_projects', 'team_members.team_id', 'team_projects.team_id')
                .innerJoin('projects', 'team_projects.project_id', 'projects.id')
                .select({ id: 'projects.id' })
                .where({
                    'users.id': req.body.token.id,
                    'projects.id': project_id,
                });
            if (project.length >= 1) {
                await database.transaction(async transaction => {
                    await transaction('tasks').insert({
                        id: task_id,
                        project_id: project_id,
                        name: req.body.name,
                        text: req.body.text,
                        icon: req.body.icon,
                        priority: req.body.priority,
                        status: 'open',
                        created: new Date(),
                        edited: new Date(),
                    });
                    if (requirements.length !== 0) {
                        await transaction('task_requirements').insert(
                            requirements.map(requirement => ({
                                task_id: task_id,
                                role_id: requirement.role,
                                time: requirement.time,
                            }))
                        );
                    }
                    if (dependentcy_ids.length !== 0) {
                        await transaction('task_dependencies').insert(
                            dependentcy_ids.map(dependentcy_id => ({
                                task_id: task_id,
                                requires_id: dependentcy_id,
                            }))
                        );
                    }
                    if (assigned_ids.length !== 0) {
                        await transaction('task_assignees').insert(
                            assigned_ids.map(user_id => ({
                                task_id: task_id,
                                user_id: user_id,
                            }))
                        );
                    }
                });
                res.status(200).json({
                    status: 'success',
                    id: task_id,
                });
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'project not found',
                });
            }
        } catch (e) {
            res.status(400).json({
                status: 'error',
                message: 'failed to create task',
            });
        }
    } else {
        res.status(400).json({
            status: 'error',
            message: 'missing request fields',
        });
    }
});

interface UpdateTaskBody {
    name?: string;
    text?: string;
    icon?: string;
    priority?: string;
    status?: string;
    remove_dependentcies?: Array<string>;
    remove_requirements?: Array<string>;
    remove_assigned?: Array<string>;
    add_dependentcies?: Array<string>;
    add_requirements?: Array<TaskRequirement>;
    add_assigned?: Array<string>;
    token: Token;
}

task.put('/:uuid', async (req, res) => {
    if (isOfType<UpdateTaskBody>(req.body, [])) {
        try {
            const task_id = req.params.uuid;
            const remove_dependentcy_ids = req.body.remove_dependentcies ?? [];
            const remove_assigned_ids = req.body.remove_assigned ?? [];
            const remove_requirement_ids = req.body.remove_requirements ?? [];
            const add_dependentcy_ids = req.body.add_dependentcies ?? [];
            const add_assigned_ids = req.body.add_assigned ?? [];
            const add_requirements = req.body.add_requirements ?? [];
            const add_requirement_ids = add_requirements.map(req => req.role);
            const all_ids = [
                ...remove_requirement_ids,
                ...remove_assigned_ids,
                ...remove_dependentcy_ids,
                ...add_requirement_ids,
                ...add_assigned_ids,
                ...add_dependentcy_ids,
                task_id,
            ];
            for (const team_id of all_ids) {
                if (!validate(team_id)) {
                    res.status(400).json({
                        status: 'error',
                        message: 'malformed uuid',
                    });
                    return;
                }
            }
            const task = await database('users')
                .innerJoin('team_members', 'users.id', 'team_members.user_id')
                .innerJoin('team_projects', 'team_members.team_id', 'team_projects.team_id')
                .innerJoin('tasks', 'team_projects.project_id', 'tasks.project_id')
                .select({ id: 'tasks.id' })
                .where({
                    'users.id': req.body.token.id,
                    'tasks.id': task_id,
                });
            if (task.length >= 1) {
                await database.transaction(async transaction => {
                    await transaction('tasks')
                        .update({
                            name: req.body.name,
                            text: req.body.text,
                            icon: req.body.icon,
                            priority: req.body.priority,
                            status: req.body.status,
                            edited: new Date(),
                        })
                        .where({
                            'tasks.id': task_id,
                        });
                    if (remove_requirement_ids.length !== 0) {
                        await transaction('task_requirements')
                            .delete()
                            .where({
                                'task_id': task_id,
                            })
                            .whereIn('role_id', remove_requirement_ids);
                    }
                    if (remove_dependentcy_ids.length !== 0) {
                        await transaction('task_dependencies')
                            .delete()
                            .where({
                                'task_id': task_id,
                            })
                            .whereIn('requires_id', remove_dependentcy_ids);
                    }
                    if (remove_assigned_ids.length !== 0) {
                        await transaction('task_assignees')
                            .delete()
                            .where({
                                'task_id': task_id,
                            })
                            .whereIn('user_id', remove_assigned_ids);
                    }
                    if (add_requirements.length !== 0) {
                        await transaction('task_requirements').insert(
                            add_requirements.map(requirement => ({
                                task_id: task_id,
                                role_id: requirement.role,
                                time: requirement.time,
                            }))
                        );
                    }
                    if (add_dependentcy_ids.length !== 0) {
                        await transaction('task_dependencies').insert(
                            add_dependentcy_ids.map(dependentcy_id => ({
                                task_id: task_id,
                                requires_id: dependentcy_id,
                            }))
                        );
                    }
                    if (add_assigned_ids.length !== 0) {
                        await transaction('task_assignees').insert(
                            add_assigned_ids.map(user_id => ({
                                task_id: task_id,
                                user_id: user_id,
                            }))
                        );
                    }
                });
                res.status(200).json({
                    status: 'success',
                });
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'task not found',
                });
            }
        } catch (e) {
            res.status(400).json({
                status: 'error',
                message: 'failed to update task',
            });
        }
    } else {
        res.status(400).json({
            status: 'error',
            message: 'missing request fields',
        });
    }
});

export default task;

