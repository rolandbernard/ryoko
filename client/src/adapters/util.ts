
import { apiRoot } from 'config';

import { getAuthHeader } from './auth';

export interface Activity {
    day: string;
    time: number;
}

export interface Completion {
    open: number,
    closed: number,
    suspended: number,
    overdue: number,
}

async function executeApiRequest<T>(path: string, method: string, body: any, onSuccess: (data: any) => T, errorMessage: string): Promise<T> {
    try {
        const response = await fetch(`${apiRoot}/${path}`, {
            method: method,
            headers: {
                ...getAuthHeader(),
                ...(body ? { 'Content-Type': 'application/json' } : { }),
            },
            body: body ? JSON.stringify(body) : undefined,
        });
        if (response.ok) {
            return onSuccess(await response.json());
        } else {
            throw new Error(errorMessage);
        }
    } catch (e) {
        throw new Error(errorMessage);
    }
}

export function executeApiGet<T>(path: string, onSuccess: (data: any) => T, errorMessage: string): Promise<T> {
    return executeApiRequest(path, 'GET', undefined, onSuccess, errorMessage);
}

export function executeApiDelete<T>(path: string, onSuccess: (data: any) => T, errorMessage: string): Promise<T> {
    return executeApiRequest(path, 'DELETE', undefined, onSuccess, errorMessage);
}

export function executeApiPost<T>(path: string, body: any, onSuccess: (data: any) => T, errorMessage: string): Promise<T> {
    return executeApiRequest(path, 'POST', body, onSuccess, errorMessage);
}

export function executeApiPut<T>(path: string, body: any, onSuccess: (data: any) => T, errorMessage: string): Promise<T> {
    return executeApiRequest(path, 'PUT', body, onSuccess, errorMessage);
}

