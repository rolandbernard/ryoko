
import express from 'express';
import { validate } from 'uuid';

import database from '../database';
import { isOfType } from '../util';
import { requireVerification, Token } from './auth';

const user = express();

user.get('/name/:username', async (req, res) => {
    try {
        const user = await database('users')
            .select({
                id: 'id',
                username: 'user_name',
            })
            .where({ username: req.params.username });
        if (user.length === 1) {
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
        if (user.length === 1) {
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

interface UserUpdateBody {
    token: Token;
    realname?: string;
    email?: string;
}

user.put('/', async (req, res) => {
    if (
        isOfType<UserUpdateBody>(req.body, [['realname', 'string']])
        || isOfType<UserUpdateBody>(req.body, [['email', 'string']])
    ) {
        try {
            const updated = await database('users')
                .update({
                    email: req.body.email,
                    real_name: req.body.realname,
                })
                .where({ id: req.body.token.id });
            if (updated === 1) {
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
            message: 'missing request fields',
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
            if (user.length === 1) {
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
