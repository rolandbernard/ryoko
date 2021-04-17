
import { NextFunction, Request, Response } from 'express';

import { headers } from './config';

export function addDefaultHeaders(_req: Request, res: Response, next: NextFunction) {
    let header : keyof typeof headers;
    for (header in headers) {
        res.header(header, headers[header]);
    }
    next();
}

