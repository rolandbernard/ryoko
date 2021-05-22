
import express from 'express';
import { api } from './api';
import { port, web_serve } from './config';

const app = express();

if (web_serve) {
    app.use('/', express.static(web_serve));
}

app.use(api);

app.listen(port);

