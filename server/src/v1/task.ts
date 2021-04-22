
import express from 'express';
import { validate } from 'uuid';

import database from '../database';
import { requireVerification } from './auth';

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

export default task;

