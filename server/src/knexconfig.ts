
import { env } from 'process';
import { parse } from 'pg-connection-string';

const pgconfig: any = parse(env.DATABASE_URL ?? '');

export default {
    development: {
        client: "sqlite3",
        connection: {
            filename: "./dev.sqlite3"
        }
    },
    staging: {
        client: "postgresql",
        connection: pgconfig,
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: "knex_migrations"
        }
    },
    production: {
        client: "postgresql",
        connection: {
            ...pgconfig,
            ssl: {
                rejectUnauthorized: false
            }
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: "knex_migrations"
        }
    }
};

