
import { apiRoot } from 'config';

import { getAuthHeader } from './auth';
import { Task } from './task';
import { Work } from './work';

export interface User {
    id: string;
    username: string;
    realname?: string;
    email?: string;
}

export async function exists(username: string) {
    try {
        const response = await fetch(`${apiRoot}/user/name/${username}`);
        return response.ok;
    } catch (e) {
        // Probably a network error
        return false;
    }
}

export async function getCurrentUser(): Promise<User> {
    try {
        const response = await fetch(`${apiRoot}/user/`, { headers: getAuthHeader() });
        if (response.ok) {
            return (await response.json()).user;
        } else {
            throw new Error("Failed to get user");
        }
    } catch (e) {
        throw e;
    }
}

export async function getUserTasks(): Promise<Array<Task>> {
    try {
        const response = await fetch(`${apiRoot}/user/tasks`, { headers: getAuthHeader() });
        if (response.ok) {
            return (await response.json()).tasks.map((task: any) => ({
                ...task,
                edited: new Date(task.edited),
                created: new Date(task.created),
            }));
        } else {
            throw new Error("Failed to get user tasks");
        }
    } catch (e) {
        throw e;
    }
}

export async function getUserWork(): Promise<Work> {
    try {
        const response = await fetch(`${apiRoot}/user/work`, { headers: getAuthHeader() });
        if (response.ok) {
            return (await response.json()).work;
        } else {
            throw new Error("Failed to get user work");
        }
    } catch (e) {
        throw e;
    }
}

export async function getUser(uuid: string): Promise<User> {
    try {
        const response = await fetch(`${apiRoot}/user/${uuid}`, { headers: getAuthHeader() });
        if (response.ok) {
            return (await response.json()).user;
        } else {
            throw new Error("Failed to get user");
        }
    } catch (e) {
        throw e;
    }
}

export async function updateUser(user: { realname?: string, email?: string }) {
    try {
        const response = await fetch(`${apiRoot}/user/`, {
            method: 'PUT',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        if (!response.ok) {
            throw new Error("Failed to update user");
        }
    } catch (e) {
        throw e;
    }
}

export function getUserImageUri(uuid: string): string {
    return `${apiRoot}/user/${uuid}/image`;
}

