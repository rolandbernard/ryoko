
import knex from 'knex';

import { environment } from './config';
import config from './knexconfig';

export const database = knex(config[environment]);
export const migrated = database.migrate.latest();

export default database;

