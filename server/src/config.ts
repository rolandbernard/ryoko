
import { env } from 'process';

export const port = env.PORT ?? 8000;

export const keys = {
    private: './keys/cert.key',
    public: './keys/cert.pem',
    secret: 'SECRET',
};

export const allowedOrigins = [ "*" ];

export const environment = (env.NODE_ENV ?? 'development') as ('development' | 'staging' | 'production');

export const web_serve = '../client/build/';

