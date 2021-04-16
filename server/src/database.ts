
import knex from 'knex';

import { environment } from './config';
import config from './knexconfig';

const database = knex(config[environment]);
database.migrate.latest();

export default database;

