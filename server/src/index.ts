
import express, { Request, Response, NextFunction } from 'express';
import { json as bodyJson } from 'body-parser';

import { port } from './config';
import { addDefaultHeaders } from './headers';
import v1 from './v1';

const app = express();

app.use(addDefaultHeaders);
app.use(bodyJson());

app.use('/v1', v1);

app.use((_req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'unknown resource',
    });
});

app.use((_err: Error, _req: Request, res: Response, _next: NextFunction) => {
    return res.status(400).json({
        status: 'error',
        message: 'unknown error',
    });
});

app.listen(port, () => {
    console.log(`[server] Server is running at https://localhost:${port}`);
});

