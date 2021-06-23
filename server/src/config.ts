
import { env } from 'process';

// The port the server should start at.
export const port = env.PORT ?? 8000;

// The keys used for signing web tokens.
export const keys = {
    private: './keys/cert.key',
    public: './keys/cert.pem',
    secret: 'SECRET',
};

// Which origins are allowed to use the api.
export const allowedOrigins = [ "*" ];

// The environment the server runs in. This impacts the database configuration.
export const environment = (env.NODE_ENV ?? 'development') as ('development' | 'test' | 'staging' | 'production');

// Then directory that should be served statically
export const web_serve = '../client/build/';

