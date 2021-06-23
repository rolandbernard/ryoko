
import { NextFunction, Request, Response } from 'express';

import { allowedOrigins } from './config';

/**
 * This is a middleware function to handle cross-origin requests. This requires listening to OPTION
 * request and adding the Access-Control header to the response.
 * 
 * @param req The request to handle
 * @param res The response for the request
 * @param next The next middleware
 */
export function addDefaultHeaders(req: Request, res: Response, next: NextFunction): void {
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
        res.header('Access-Control-Max-Age', '86400'); // One day (chosen arbitrarily)
    }
    if (req.method === 'OPTIONS') {
        // Handle preflight requests
        res.send();
    } else {
        next();
    }
}

