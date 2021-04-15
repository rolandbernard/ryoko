
import express, { Request, Response, NextFunction } from 'express';
import { json as bodyJson } from 'body-parser';

import v1 from './v1';

const app = express();
const PORT = 8000;

app.use(bodyJson());

app.use('/v1', v1);

app.use((_req, res) => {
    res.sendStatus(404);
});

app.use((_err: Error, _req: Request, res: Response, _next: NextFunction) => {
    return res.status(400).json({
        status: 'error',
    });
});

app.listen(PORT, () => {
    console.log(`[server] Server is running at https://localhost:${PORT}`);
});

