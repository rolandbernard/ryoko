
import { env } from 'process';
import { join } from 'path';
import { parse } from 'pg-connection-string';

// We parse the database url provided in the environment variable DATABASE_URL
const pgconfig: any = parse(env.DATABASE_URL ?? 'postgresql://postgres@localhost/ryoko');

// Migrations will be transpiled and therefore always be located in the directory relative to this file.
const migrations = {
    tableName: "knex_migrations",
    directory: join(__dirname, 'migrations'),
};

// These are the configurations based on different NODE_ENV values.
export default {
    development: {
        client: "sqlite3",
        useNullAsDefault: true,
        connection: {
            filename: "./dev.sqlite3",
        },
        migrations: migrations,
    },
    test: {
        client: "sqlite3",
        useNullAsDefault: true,
        connection: {
            filename: ":memory:",
        },
        migrations: migrations,
    },
    staging: {
        client: "postgresql",
        connection: pgconfig,
        pool: {
            min: 2,
            max: 10,
        },
        migrations: migrations,
    },
    production: {
        client: "postgresql",
        connection: {
            ...pgconfig,
            ssl: {
                rejectUnauthorized: false,
            }
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: migrations,
    }
};

