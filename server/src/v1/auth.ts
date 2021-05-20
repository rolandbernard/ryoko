
import express, { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { hash, compare } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken';

import database from '../database';
import { isOfType, asyncify } from '../util';
import { getPublicKey, getPrivateKey, getSecret, usePublicAndPrivate } from '../keys';

const auth = express();

const authTokenType = 'ryoko-auth';

export interface Token {
    id: string;
    type: string;
}

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
        delete req.body.token;
        try {
            if (await usePublicAndPrivate()) {
                const decoded = await asyncify(verify, token, await getPublicKey(), { algorithms: ["ES384"] });
                if (isOfType<Token>(decoded, [['id', 'string'], ['type', 'string']]) && decoded.type === authTokenType) {
                    req.body.token = decoded;
                }
            } else {
                return asyncify(verify, token, getSecret(), { algorithms: ["HS384"] });
            }
        } catch (err) { /* Token has already been deleted */ }
        next();
    } else {
        next();
    }
}

export function requireVerification(req: Request, res: Response, next: NextFunction) {
    if (req.body?.token) {
        next();
    } else {
        res.status(403).json({
            status: 'error',
            message: 'authentication failed',
        });
    }
}

async function generateAuthToken(id: string) {
    const token: Token = {
        id: id,
        type: authTokenType,
    };
    if (await usePublicAndPrivate()) {
        return asyncify(sign, token, await getPrivateKey(), { algorithm: "ES384", expiresIn: 60 * 60 });
    } else {
        return asyncify(sign, token, getSecret(), { algorithm: "HS384", expiresIn: 60 * 60 });
    }
}

interface RegisterBody {
    username: string;
    password: string;
    email?: string;
    realname?: string;
}

auth.post('/register', async (req, res) => {
    if (isOfType<RegisterBody>(req.body, [['username', 'string'], ['password', 'string']])) {
        const body: RegisterBody = req.body;
        const id = uuid();
        const passwdHash = await hash(body.password, 10);
        const name = body.username.trim().toLowerCase();
        if (name.length >= 4) {
            try {
                const token = await generateAuthToken(id);
                await database('users').insert({
                    id: id,
                    user_name: name,
                    passwd_hash: passwdHash,
                    email: body.email ?? null,
                    real_name: body.realname ?? null,
                });
                res.status(200).json({
                    status: 'success',
                    token: token,
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
                message: 'usernames must be four letters or longer',
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
            const name = body.username.trim().toLowerCase();
            const user = await database('users').where({ user_name: name });
            if (user.length >= 1) {
                if (await compare(body.password, user[0].passwd_hash)) {
                    const token = await generateAuthToken(user[0].id);
                    res.status(200).json({
                        status: 'success',
                        token: token,
                    });
                } else {
                    res.status(403).json({
                        status: 'error',
                        message: 'wrong username or password',
                    });
                }
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'username not found',
                });
            }
        } catch (e) {
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
    const token = await generateAuthToken(req.body.token.id);
    res.status(200).json({
        status: 'success',
        token: token,
    });
});

interface UsernameBody {
    token: Token;
    username: string;
}

auth.put("/username", async function (req, res) {
    if (isOfType<UsernameBody>(req.body, [['username', 'string']])) {
        const body: UsernameBody = req.body;
        try {
            const name = body.username.trim().toLowerCase();
            const count = await database('users').update({
                user_name: name,
            }).where({
                id: body.token.id,
            });
            if (count == 1) {
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
            // Fails if unique constraint for username is not met
            res.status(400).json({
                status: 'error',
                message: 'failed to update username',
            });
        }
    } else {
        res.status(400).json({
            status: 'error',
            message: 'missing request fields',
        });
    }
});

interface PasswordBody {
    token: Token;
    password: string;
}

auth.put("/password", async function (req, res) {
    if (isOfType<PasswordBody>(req.body, [['password', 'string']])) {
        const body: PasswordBody = req.body;
        try {
            const passwdHash = await hash(body.password, 10);
            const count = await database('users').update({
                passwd_hash: passwdHash
            }).where({
                id: body.token.id,
            });
            if (count == 1) {
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
                message: 'failed to update password',
            });
        }
    } else {
        res.status(400).json({
            status: 'error',
            message: 'missing request fields',
        });
    }
});

export default auth;

