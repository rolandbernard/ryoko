
import { NextFunction, Request, Response } from 'express';

import { allowedOrigins } from './config';

export function addDefaultHeaders(req: Request, res: Response, next: NextFunction) {
    const origin = req.header('Origin');
    if (allowedOrigins.includes('*') || origin && allowedOrigins.includes(origin)) {
        if (origin) {
            res.header('Access-Control-Allow-Origin', origin);
        } else {
            res.header('Access-Control-Allow-Origin', '*');
        }
        const headers = req.header('Access-Control-Request-Headers');
        if (headers) {
            res.header('Access-Control-Allow-Headers', headers);
        }
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
        res.header('Access-Control-Max-Age', '86400');
    }
    if (req.method === 'OPTIONS') {
        // Handle preflight requests
        res.send();
    } else {
        next();
    }
}

