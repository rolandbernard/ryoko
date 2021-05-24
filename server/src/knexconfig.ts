
import { env } from 'process';
import { join } from 'path';
import { parse } from 'pg-connection-string';

const pgconfig: any = parse(env.DATABASE_URL ?? 'postgresql://postgres@localhost/ryoko');
const migrations = {
    tableName: "knex_migrations",
    directory: join(__dirname, 'migrations'),
};

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

