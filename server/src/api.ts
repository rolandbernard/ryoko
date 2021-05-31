
import express, { Request, Response, NextFunction } from 'express';
import { json as bodyJson } from 'body-parser';
import fileupload from 'express-fileupload';

import { addDefaultHeaders } from './headers';
import v1 from './v1';

export const api = express();

api.use(addDefaultHeaders);
api.use(bodyJson());
api.use(fileupload());

api.use('/v1', v1);

api.use((_req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'unknown resource',
    });
});

api.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    return res.status(400).json({
        status: 'error',
        message: err.message,
    });
});
