
import express, { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { hash, compare } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken';

import database from '../database';
import { isOfType, asyncify } from '../util';
import { getPublicKey, getPrivateKey } from '../keys';

const auth = express();

interface RegisterBody {
    username: string;
    password: string;
}

auth.post('/register', async (req, res) => {
    if (isOfType<RegisterBody>(req.body, [['username', 'string'], ['password', 'string']])) {
        const body: RegisterBody = req.body;
        const id = uuid();
        const passwdHash = await hash(body.password, 10);
        try {
            await database('users').insert({
                id: id,
                user_name: body.username,
                passwd_hash: passwdHash
            });
            res.status(200).json({
                status: 'success',
            });
        } catch (e) {
            // Fails if unique constraint for username is not met
            res.status(400).json({
                status: 'error',
                message: 'failed to create user',
            });
        }
    } else {
        res.status(400).json({
            status: 'error',
            message: 'missing request fields',
        });
    }
});

interface TokenBody {
    username: string;
    password: string;
}

auth.post('/token', async (req, res) => {
    if (isOfType<TokenBody>(req.body, [['username', 'string'], ['password', 'string']])) {
        const body: TokenBody = req.body;
        try {
            const user = await database('users').where({ user_name: body.username });
            if (user.length === 1) {
                if (await compare(body.password, user[0].passwd_hash)) {
                    const token = await asyncify(sign, {
                        id: user[0].id,
                    }, await getPrivateKey(), { algorithm: "ES384", expiresIn: 60 * 60 });
                    res.status(200).json({
                        status: 'success',
                        token: token,
                    });
                } else {
                    res.status(400).json({
                        status: 'error',
                        message: 'wrong username or password',
                    });
                }
            } else {
                res.status(400).json({
                    status: 'error',
                    message: 'username not found',
                });
            }
        } catch (e) {
            console.error(e);
            res.status(400).json({
                status: 'error',
                message: 'failed to acquire token',
            });
        }
    } else {
        res.status(400).json({
            status: 'error',
            message: 'missing request fields',
        });
    }
});

auth.use(requireVerification);

auth.get("/extend", async function (req, res) {
    if (req.body?.token) {
        const token = await asyncify(sign, {
            id: req.body.token.id,
        }, await getPrivateKey(), { algorithm: "ES384", expiresIn: 60 * 60 });
        res.status(200).json({
            status: 'success',
            token: token,
        });
    } else {
        res.status(403).json({
            status: 'error',
            message: 'authentication failed',
        });
    }
});

export async function tokenVerification(req: Request, _res: Response, next: NextFunction) {
    const header = req.headers?.authorization;
    let token: string | null = null;
    if (header) {
        const bearer = header.split(' ');
        token = bearer[1];
    } else if (!req.body) {
        req.body = {};
    } else if (req.body.token) {
        token = req.body.token;
    }
    if (token) {
        try {
            const decoded = await asyncify(verify, token, await getPublicKey(), { algorithms: ["ES384"] });
            req.body.token = decoded;
        } catch (err) {
            delete req.body.token;
        }
        next();
    } else {
        next();
    }
}

export function requireVerification(req: Request, res: Response, next: NextFunction) {
    if (req.body.token) {
        next();
    } else {
        res.status(403).json({
            status: 'error',
            message: 'authentication failed',
        });
    }
}

export default auth;

