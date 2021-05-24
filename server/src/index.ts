
import express from 'express';

import { migrate } from './database';
import { api } from './api';
import { port, web_serve } from './config';

migrate();

const app = express();

if (web_serve) {
    app.use('/', express.static(web_serve));
}

app.use(api);

app.listen(port);

