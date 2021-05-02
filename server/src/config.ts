
import { env } from 'process';

export const port = 8000;

export const keys = {
    private: '/etc/ssl/localcerts/cert.key',
    public: '/etc/ssl/localcerts/cert.pem',
};

export const allowedOrigins = [ "*" ];

export const environment = (env.NODE_ENV ?? 'development') as ('development' | 'staging' | 'production');

