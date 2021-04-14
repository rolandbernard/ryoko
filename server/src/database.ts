
import knex from 'knex';

const database = knex({
    client: 'sqlite3',
    connection: {
        filename: './database.db'
    }
});
database.migrate.latest();

export default function getDatabase() {
    return database;
}

