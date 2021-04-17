
import { NextFunction, Request, Response } from 'express';

import { allowedOrigins } from './config';

export function addDefaultHeaders(req: Request, res: Response, next: NextFunction) {
    const origin = req.header('Origin');
    if (allowedOrigins.includes('*') || origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    next();
}

