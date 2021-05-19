
import express, { Request, Response } from 'express';
import { validate } from 'uuid';
import sharp from 'sharp';
import { UploadedFile } from 'express-fileupload';

import database from '../database';
import { isOfType } from '../util';
import { requireVerification, Token } from './auth';
import { generateFromFlatResult } from './task';

const user = express();

user.get('/name/:username', async (req, res) => {
    try {
        const name = req.params.username.trim().toLowerCase();
        const user = await database('users')
            .select({
                id: 'users.id',
                username: 'users.user_name',
            })
            .where({ 'users.user_name': name });
        if (user.length >= 1) {
            res.status(200).json({
                status: 'success',
                user: user[0],
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'user not found',
            });
        }
    } catch (e) {
        res.status(400).json({
            status: 'error',
            message: 'failed get user',
        });
    }
});

function sendRangedData(req: Request, res: Response, data: Buffer) {
    res.setHeader('Accept-Ranges', 'bytes');
    const range = req.range(data.length);
    if (typeof range === 'object' && range.type === 'bytes' && range.length === 1) {
        res.status(206);
        res.setHeader('Content-Range', `${range[0].start}\-${range[0].end}/${data.length}`);
        res.send(data.slice(range[0].start, range[0].end+1));
    } else {
        res.status(200);
        res.send(data);
    }
}

user.get('/:uuid/image', async (req, res) => {
    try {
        const id = req.params.uuid;
        if (validate(id)) {
            const user = await database('users')
                .select({
                    image: 'users.image'
                })
                .where({ id: id });
            if (user.length >= 1 && user[0].image) {
                res.setHeader('Content-Type', 'image/png');
                sendRangedData(req, res, user[0].image);
            } else if (user.length >= 1) {
                res.status(404).send();
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'user not found',
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
            message: 'failed get user',
        });
    }
});

user.use(requireVerification);

user.get('/', async (req, res) => {
    try {
        const user = await database('users')
            .select({
                id: 'id',
                username: 'user_name',
                email: 'email',
                realname: 'real_name',
            })
            .where({ id: req.body.token.id });
        if (user.length >= 1) {
            res.status(200).json({
                status: 'success',
                user: user[0],
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'user not found',
            });
        }
    } catch (e) {
        res.status(400).json({
            status: 'error',
            message: 'failed get user',
        });
    }
});

user.get('/tasks', async (req, res) => {
    try {
        const tasks = await database({ 'ut': 'task_assignees' })
            .innerJoin('tasks', 'ut.task_id', 'tasks.id')
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
                assigned_finished: 'task_assignees.finished', 
                dependentcy: 'task_dependencies.requires_id', 
            })
            .where({
                'ut.user_id': req.body.token.id,
                'task_assignees.finished': false,
            });
        res.status(200).json({
            status: 'success',
            tasks: generateFromFlatResult(tasks),
        });
    } catch (e) {
        res.status(400).json({
            status: 'error',
            message: 'failed get tasks',
        });
    }
});

user.get('/work', async (req, res) => {
    try {
        const since = (req.query.since ?? 0) as number;
        const work = await database('workhours')
            .select({
                id: 'workhours.id',
                task: 'workhours.task_id',
                user: 'workhours.user_id',
                started: 'workhours.started',
                finished: 'workhours.finished',
            })
            .where({
                'workhours.user_id': req.body.token.id,
            })
            .andWhere('workhours.started', '>=', since)
            .groupBy('workhours.id');
        res.status(200).json({
            status: 'success',
            work: work,
        });
    } catch (e) {
        res.status(400).json({
            status: 'error',
            message: 'failed get work',
        });
    }
});

user.get('/activity', async (req, res) => {
    try {
        const since = (req.query.since ?? 0) as number;
        const to = (req.query.to ?? Date.now()) as number;
        const activity = await database('workhours')
            .select({
                day: database.raw('Date(`started` / 1000, \'unixepoch\')'),
            })
            .sum({ time: database.raw('`finished` - `started`') })
            .where({
                'workhours.user_id': req.body.token.id,
            })
            .andWhereNot({ 'workhours.finished': null })
            .andWhere('workhours.started', '>=', since)
            .andWhere('workhours.started', '<=', to)
            .groupBy('day');
        res.status(200).json({
            status: 'success',
            activity: activity,
        });
    } catch (e) {
        console.error(e);
        res.status(400).json({
            status: 'error',
            message: 'failed get activity',
        });
    }
});

user.get('/completion', async (req, res) => {
    try {
        const since = (req.query.since ?? 0) as number;
        const to = (req.query.to ?? Date.now()) as number;
        const completion = await database(
                database('task_assignees')
                    .leftJoin('tasks', 'task_assignees.task_id', 'tasks.id')
                    .leftJoin('task_requirements', 'tasks.id', 'task_requirements.task_id')
                    .leftJoin('workhours', 'tasks.id', 'workhours.task_id')
                    .select({
                        id: 'tasks.id',
                        status: database.raw(
                            'Case When `tasks`.`status` = \'open\' '
                            + 'And Sum(`task_requirements`.`time` * 60 * 1000) < Sum(`workhours`.`finished` - `workhours`.`started`) '
                            + 'Then \'overdue\' Else `tasks`.`status` End'),
                    })
                    .where({
                        'task_assignees.user_id': req.body.token.id,
                    })
                    .andWhere('tasks.edited', '>=', since)
                    .andWhere('tasks.created', '<=', to)
                    .groupBy('tasks.id')
            )
            .select({
                status: 'status',
            })
            .count({ count: 'id' })
            .groupBy('status') as any[];
        res.status(200).json({
            status: 'success',
            completion: completion.reduce((object, { status, count }) => ({
                ...object,
                [status]: count,
            }), { open: 0, closed: 0, suspended: 0, overdue: 0 }),
        });
    } catch (e) {
        res.status(400).json({
            status: 'error',
            message: 'failed get completion',
        });
    }
});

interface UserUpdateBody {
    token: Token;
    realname?: string;
    email?: string;
}

user.put('/', async (req, res) => {
    if (isOfType<UserUpdateBody>(req.body, [])) {
        try {
            if (req.body.realname || req.body.email) {
                const updated = await database('users')
                    .update({
                        email: req.body.email,
                        real_name: req.body.realname,
                    })
                    .where({ id: req.body.token.id });
                if (updated >= 1) {
                    res.status(200).json({
                        status: 'success',
                    });
                } else {
                    res.status(404).json({
                        status: 'error',
                        message: 'user not found',
                    });
                }
            } else {
                res.status(200).json({
                    status: 'success',
                    message: 'nothing to do',
                });
            }
        } catch (e) {
            res.status(400).json({
                status: 'error',
                message: 'failed to update user',
            });
        }
    } else {
        res.status(400).json({
            status: 'error',
            message: 'missing request fields',
        });
    }
});

user.put('/image', async (req, res) => {
    if (req.files?.image && isOfType<UploadedFile>(req.files.image, [['data', 'object']])) {
        try {
            const image = await sharp(req.files.image.data).resize(128, 128, {
                fit: "contain",
            }).png({
                compressionLevel: 9,
            }).toBuffer();
            const updated = await database('users')
                .update({
                    image: image,
                })
                .where({ id: req.body.token.id });
            if (updated >= 1) {
                res.status(200).json({
                    status: 'success',
                });
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'user not found',
                });
            }
        } catch (e) {
            res.status(400).json({
                status: 'error',
                message: 'failed to update user',
            });
        }
    } else {
        res.status(400).json({
            status: 'error',
            message: 'missing image file',
        });
    }
});

user.get('/:uuid', async (req, res) => {
    try {
        const id = req.params.uuid;
        if (validate(id)) {
            const user = await database('users')
                .select({
                    id: 'id',
                    username: 'user_name',
                    email: 'email',
                    realname: 'real_name',
                })
                .where({ id: id });
            if (user.length >= 1) {
                res.status(200).json({
                    status: 'success',
                    user: user[0],
                });
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'user not found',
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
            message: 'failed get user',
        });
    }
});

export default user;
