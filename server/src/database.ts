
import knex from 'knex';

import { environment } from './config';
import config from './knexconfig';

import pg from 'pg';
pg.types.setTypeParser(20, parseInt)
pg.types.setTypeParser(1700, parseInt)

export const database = knex(config[environment]);

export function migrate() {
    return database.migrate.latest();
}

export function close() {
    return database.destroy();
}

export default database;

