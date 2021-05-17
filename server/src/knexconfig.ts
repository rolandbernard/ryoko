
import { env } from 'process';

export default {
    development: {
        client: "sqlite3",
        connection: {
            filename: "./dev.sqlite3"
        }
    },
    staging: {
        client: "postgresql",
        connection: env.DATABASE_URL ?? {
            database: "ryoko",
            user: "postgres",
            password: ""
        },
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
        connection: env.DATABASE_URL ?? {
            database: "ryoko",
            user: "postgres",
            password: ""
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

