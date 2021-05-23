
import knex from 'knex';

import { environment } from './config';
import config from './knexconfig';

export const database = knex(config[environment]);

// Only after this promise resolves is the migration finished
export const ready = database.migrate.latest();

export function close() {
    return database.destroy();
}

export default database;

