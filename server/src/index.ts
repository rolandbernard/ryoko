
import express from 'express';

import { migrate } from './database';
import { api } from './api';
import { port, web_serve } from './config';

// Run all migrations
migrate();

const app = express();

app.use('/api', api);

if (web_serve) {
    app.use('/', express.static(web_serve));

    // By default return the index.html file.
    app.use((_, res) => {
        res.sendFile('index.html', { root: web_serve });
    });
}

// Start the server on the port in the configuration
app.listen(port);

