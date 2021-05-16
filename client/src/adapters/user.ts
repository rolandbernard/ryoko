
import { apiRoot } from 'config';

import { executeApiGet, executeApiPut } from './util';
import { Task } from './task';
import { Work } from './work';

export interface User {
    id: string;
    username: string;
    realname?: string;
    email?: string;
}

export interface AssignedUser extends User {
    time: number;
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

export function getCurrentUser(): Promise<User> {
    return executeApiGet(`user`, ({ user }) => user, "Failed to get user");
}

export function getUserTasks(): Promise<Array<Task>> {
    return executeApiGet(`user/tasks`, ({ tasks }) => tasks.map((task: any) => ({
        ...task,
        edited: new Date(task.edited),
        created: new Date(task.created),
    })), "Failed to get user tasks");
}

export function getUserWork(): Promise<Work> {
    return executeApiGet(`user/work`, ({ work }) => work.map((work: any) => ({
        ...work,
        started: new Date(work.started),
        finished: work.finished ? new Date(work.finished) : undefined,
    })), "Failed to get user work");
}

export function getUser(uuid: string): Promise<User> {
    return executeApiGet(`user/${uuid}`, ({ user }) => user, "Failed to get user");
}

export function updateUser(user: { realname?: string, email?: string }) {
    return executeApiPut(`user`, user, () => {}, "Failed to update user");
}

export function getUserImageUri(uuid: string): string {
    return `${apiRoot}/user/${uuid}/image`;
}

