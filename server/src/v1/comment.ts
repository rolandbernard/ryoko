
import express from 'express';
import { v4 as uuid, validate } from 'uuid';

import database from '../database';
import { requireVerification, Token } from './auth';
import { isOfType } from '../util';

const comment = express();

comment.use(requireVerification);

interface AddCommentBody {
    task: string;
    text: string;
    token: Token;
}

comment.post('/', async (req, res) => {
    if (isOfType<AddCommentBody>(req.body, [['task', 'string'], ['text', 'string']])) {
        try {
            const task_id = req.body.task;
            if (validate(task_id)) {
                const comment_id = uuid();
                const task = await database('team_members')
                    .innerJoin('team_projects', 'team_members.team_id', 'team_projects.team_id')
                    .innerJoin('tasks', 'team_projects.project_id', 'tasks.project_id')
                    .select({ id: 'tasks.id' })
                    .where({
                        'team_members.user_id': req.body.token.id,
                        'tasks.id': task_id,
                    });
                if (task.length >= 1) {
                    await database('comments').insert({
                        id: comment_id,
                        task_id: task_id,
                        user_id: req.body.token.id,
                        text: req.body.text,
                        created: new Date(),
                        edited: new Date(),
                    });
                    res.status(200).json({
                        status: 'success',
                        id: comment_id,
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
                message: 'failed to create comment',
            });
        }
    } else {
        res.status(400).json({
            status: 'error',
            message: 'missing request fields',
        });
    }
});

interface UpdateCommentBody {
    text?: string;
    token: Token;
}

comment.put('/:uuid', async (req, res) => {
    if (isOfType<UpdateCommentBody>(req.body, [])) {
        try {
            const comment_id = req.params.uuid;
            if (validate(comment_id)) {
                const comment = await database('comments')
                        .update({
                            text: req.body.text,
                            edited: new Date(),
                        })
                        .where({
                            'comments.user_id': req.body.token.id,
                            'comments.id': comment_id,
                        });
                if (comment >= 1) {
                    res.status(200).json({
                        status: 'success',
                    });
                } else {
                    res.status(404).json({
                        status: 'error',
                        message: 'comment not found',
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
                message: 'failed to update comment',
            });
        }
    } else {
        res.status(400).json({
            status: 'error',
            message: 'missing request fields',
        });
    }
});

comment.get('/:uuid', async (req, res) => {
    try {
        const comment_id = req.params.uuid;
        if (validate(comment_id)) {
            const comment = await database('team_members')
                .innerJoin('team_projects', 'team_members.team_id', 'team_projects.team_id')
                .innerJoin('tasks', 'team_projects.project_id', 'tasks.project_id')
                .innerJoin('comments', 'tasks.id', 'comments.task_id')
                .select({
                    id: 'comments.id',
                    task: 'comments.task_id',
                    user: 'comments.user_id',
                    text: 'comments.text',
                    created: 'comments.created',
                    edited: 'comments.edited',
                })
                .where({
                    'team_members.user_id': req.body.token.id,
                    'comments.id': comment_id,
                });
            if (comment.length >= 1) {
                res.status(200).json({
                    status: 'success',
                    comment: comment[0],
                });
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'comment not found',
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
            message: 'failed to update comment',
        });
    }
});

export default comment;

