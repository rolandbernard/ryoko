
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
                .innerJoin('tasks', 'team_projects.project_id', 'task.team_id')
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
            if (task.length === 1) {
                res.status(200).json({
                    status: 'success',
                    task: task[0],
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
    priority: string;
    dependentcies: Array<string>;
    requirements: Array<TaskRequirement>;
    token: Token;
}

task.post('/', async (req, res) => {
    if (isOfType<AddTaskBody>(req.body, [
        ['project', 'string'], ['name', 'string'], ['text', 'string'],
        ['priority', 'string'], ['dependentcies', 'object'], ['requirements', 'object'],
    ])) {
        try {
            const project_id = req.body.project;
            const dependentcy_ids = req.body.dependentcies;
            const requirements = req.body.requirements;
            const requirement_ids = requirements.map(req => req.role);
            for (const team_id of dependentcy_ids.concat(requirement_ids).concat([ project_id ])) {
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
                })
                .groupBy('projects.id');
            if (project.length >= 1) {
                await database.transaction(async transaction => {
                    await transaction('tasks').insert({
                        id: task_id,
                        project_id: project_id,
                        name: req.body.name,
                        text: req.body.text,
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
            console.error(e);
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

export default task;

