
import express from 'express';

import { migrate } from './database';
import { api } from './api';
import { port, web_serve } from './config';

migrate();

const app = express();

app.use('/api', api);

if (web_serve) {
    app.use('/', express.static(web_serve));

    app.use((_, res) => {
        res.sendFile('index.html', { root: web_serve });
    });
}

app.listen(port);

