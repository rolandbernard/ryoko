
import knex from 'knex';

import { environment } from './config';
import config from './knexconfig';

import pg from 'pg';

// This will parse 64 bit integers using the default parseInt
pg.types.setTypeParser(20, parseInt)
pg.types.setTypeParser(1700, parseInt)

export const database = knex(config[environment]);

/**
 * Run migrations on the default database. Once the returned promise resolves the server is ready for handling requests.
 * 
 * @returns A promise that resolves when migration finishes
 */
export function migrate() {
    return database.migrate.latest();
}

/**
 * Close the connection to the default database. After the returned promise resolves, the node environment can terminate.
 * 
 * @returns A promise that resolves once the connection is closed
 */
export function close() {
    return database.destroy();
}

export default database;

