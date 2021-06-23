
import express, { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { hash, compare } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken';

import database from '../database';
import { isOfType, asyncify } from '../util';
import { getPublicKey, getPrivateKey, getSecret, usePublicAndPrivate } from '../keys';

const auth = express();

const authTokenType = 'ryoko-auth';

/**
 * A token contains a type and ID. Only if the type is equal to the value in
 * authTokenType is the token valid for authentication.
 */
export interface Token {
    id: string;
    type: string;
}

/**
 * Middleware that verifies the token send with a request. A token can either be send using the
 * Authorization header, using a Bearer token. Or directly in the body with the name token.
 * 
 * @param req The request to handle
 * @param _res The response to the request
 * @param next The next middleware to call
 */
export async function tokenVerification(req: Request, _res: Response, next: NextFunction) {
    const header = req.headers?.authorization;
    let token: string | null = null;
    if (header) {
        const bearer = header.split(' ');
        token = bearer[1];
    } else if (req.body.token) {
        token = req.body.token;
    }
    if (token) {
        // Delete the token in the body, if present.
        delete req.body.token;
        try {
            let decoded;
            if (await usePublicAndPrivate()) {
                decoded = await asyncify(verify, token, await getPublicKey(), { algorithms: ["ES384"] });
            } else {
                decoded = await asyncify(verify, token, getSecret(), { algorithms: ["HS384"] });
            }
            if (isOfType<Token>(decoded, [['id', 'string'], ['type', 'string']]) && decoded.type === authTokenType) {
                const user = await database('users')
                    .select({ id: 'users.id' })
                    .where({
                        'users.id': decoded.id,
                    });
                if (user.length >= 1) {
                    req.body.token = decoded;
                }
            }
        } catch (err) { /* Token has already been deleted */ }
        next();
    } else {
        next();
    }
}

/**
 * Middleware that will return an error response if no authentication token is provided, or the
 * provided token is invalid in any way.
 * 
 * @param req The request to handle
 * @param _res The response to  the request
 * @param next The next middleware to call
 */
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

/**
 * Generate a new authentication token for the given user ID.
 * 
 * @param id The id to create a token for
 * @returns A promise resolving to the generated token signed with the servers key
 */
export async function generateAuthToken(id: string) {
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

/*
 * This route should register a new user for this service.
 */
auth.post('/register', async (req, res) => {
    if (isOfType<RegisterBody>(req.body, [['username', 'string'], ['password', 'string']])) {
        const body: RegisterBody = req.body;
        const id = uuid();
        const passwdHash = await hash(body.password, 10);
        const name = body.username.trim().toLowerCase();
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
            message: 'missing request fields',
        });
    }
});

interface TokenBody {
    username: string;
    password: string;
}

/*
 * This route should request a new authentication token to the user. The token will only be returned
 * if the given username and password are correct.
 */
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

/*
 * This route should request an extension to the token that was used to make the request.
 */
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

/*
 * This route should change the username of the authenticated user, if the username is not taken.
 */
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

/*
 * This route should change the password of the authorized user.
 */
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

