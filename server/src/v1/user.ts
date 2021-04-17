
import express from 'express';

import database from '../database';
import { requireVerification } from './auth';

const user = express();

user.get('/name/:username', async (req, res) => {
    try {
        const user = await database('users')
            .select({
                id: 'id',
                username: 'user_name',
                email: 'email',
                realname: 'real_name',
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

export default user;
