
import express from 'express';
import { v4 as uuid, validate } from 'uuid';

import database from '../database';
import { requireVerification, Token } from './auth';
import { isOfType } from '../util';

const work = express();

work.use(requireVerification);

interface AddWorkBody {
    task: string;
    token: Token;
}

/*
 * This route should create a new work item, started now. The request also closes all unfinished work items.
 */
work.post('/start', async (req, res) => {
    if (isOfType<AddWorkBody>(req.body, [['task', 'string']])) {
        try {
            const task_id = req.body.task;
            if (validate(task_id)) {
                const task = await database('team_members')
                    .innerJoin('team_projects', 'team_members.team_id', 'team_projects.team_id')
                    .innerJoin('tasks', 'team_projects.project_id', 'tasks.project_id')
                    .select({ id: 'tasks.id' })
                    .where({
                        'team_members.user_id': req.body.token.id,
                        'tasks.id': task_id,
                    });
                if (task.length >= 1) {
                    const work_id = uuid();
                    await database.transaction(async transaction => {
                        await transaction('workhours')
                            .update({
                                finished: Date.now(),
                            })
                            .where({
                                user_id: req.body.token.id,
                                finished: null,
                            });
                        await transaction('workhours')
                            .insert({
                                id: work_id,
                                task_id: task_id,
                                user_id: req.body.token.id,
                                started: Date.now(),
                                finished: null,
                            });
                    });
                    res.status(200).json({
                        status: 'success',
                        id: work_id,
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
                message: 'failed to create work',
            });
        }
    } else {
        res.status(400).json({
            status: 'error',
            message: 'missing request fields',
        });
    }
});

/*
 * This route should finish all open work items of the authenticated user.
 */
work.put('/finish', async (req, res) => {
    try {
        const work = await database('workhours')
            .update({
                finished: Date.now(),
            })
            .where({
                user_id: req.body.token.id,
                finished: null,
            });
        if (work >= 1) {
            res.status(200).json({
                status: 'success',
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'no work to finish',
            });
        }
    } catch (e) {
        res.status(400).json({
            status: 'error',
            message: 'failed to finish work',
        });
    }
});

/*
 * This route should return the unfinished item of the authenticated user.
 */
work.get('/', async (req, res) => {
    try {
        const work = await database('workhours')
            .select({
                id: 'workhours.id',
                task: 'workhours.task_id',
                user: 'workhours.user_id',
                started: 'workhours.started',
                finished: 'workhours.finished',
            })
            .where({
                user_id: req.body.token.id,
                finished: null,
            });
        if (work.length >= 1) {
            res.status(200).json({
                status: 'success',
                work: work[0],
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'no open work',
            });
        }
    } catch (e) {
        res.status(400).json({
            status: 'error',
            message: 'failed to get work',
        });
    }
});

export default work;

