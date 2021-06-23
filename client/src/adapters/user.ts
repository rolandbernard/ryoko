
import { apiRoot } from 'config';

import { executeApiGet, executeApiPut } from './request';
import { Task } from './task';
import { Work } from './work';
import { Activity, Completion } from './common';

export interface User {
    id: string;
    username: string;
    realname?: string;
    email?: string;
}

export interface AssignedUser extends User {
    time: number;
    finished?: boolean;
}

/**
 * Test if a user with the given username exists.
 * 
 * @param username The username to check for
 * @returns A promise resolving to true if the user exists, false otherwise
 */
export async function exists(username: string) {
    try {
        const response = await fetch(`${apiRoot}/user/name/${username}`);
        return response.ok;
    } catch (e) {
        // Probably a network error
        return false;
    }
}

/**
 * Get the user with the given name.
 * 
 * @param username The name of the user.
 * @returns A promise resolving to the user
 */
export async function getUserByName(username: string): Promise<User> {
    return executeApiGet(`user/name/${username}`, ({ user }) => user, "Failed to get user");
}

/**
 * Get information on the current user.
 * 
 * @returns A promise resolving to the user
 */
export function getCurrentUser(): Promise<User> {
    return executeApiGet(`user`, ({ user }) => user, "Failed to get user");
}

/**
 * Get all tasks the current user is assigned to.
 * 
 * @returns A promise resolving to the array of tasks
 */
export function getUserTasks(): Promise<Array<Task>> {
    return executeApiGet(`user/tasks`, ({ tasks }) => tasks.map((task: any) => ({
        ...task,
        edited: new Date(task.edited),
        created: new Date(task.created),
    })), "Failed to get user tasks");
}

/**
 * Get all work items the current user has created.
 * 
 * @returns A promise resolving to the array of work items
 */
export function getUserWork(): Promise<Work> {
    return executeApiGet(`user/work`, ({ work }) => work.map((work: any) => ({
        ...work,
        started: new Date(work.started),
        finished: work.finished ? new Date(work.finished) : undefined,
    })), "Failed to get user work");
}

/**
 * Get the activity for the current user.
 * 
 * @param from The starting date
 * @param to The ending date
 * @returns A promise resolving to the array of activity items
 */
export function getUserActivity(from: Date = new Date(0), to: Date = new Date()): Promise<Activity[]> {
    return executeApiGet(
        `user/activity?since=${from.getTime()}&to=${to.getTime()}`,
        ({ activity }) => activity, "Failed to get user activity"
    );
}

/**
 * Get the completion for the current users tasks.
 * 
 * @param from The starting date
 * @param to The ending date
 * @returns A promise resolving to the completion data
 */
export function getUserCompletion(from: Date = new Date(0), to: Date = new Date()): Promise<Completion> {
    return executeApiGet(
        `user/completion?since=${from.getTime()}&to=${to.getTime()}`,
        ({ completion }) => ({...completion, sum: (
            completion.open + 
            completion.closed + 
            completion.suspended + 
            completion.overdue
        ) || 1}), "Failed to get user completion"
    );
}

/**
 * Get data for the user with the given id.
 * 
 * @param uuid The id of the user
 * @returns A promise resolving to the users data
 */
export function getUser(uuid: string): Promise<User> {
    return executeApiGet(`user/${uuid}`, ({ user }) => user, "Failed to get user");
}

/**
 * Update the data for the current user.
 * 
 * @param user The new data of the user
 */
export function updateUser(user: { realname?: string, email?: string }) {
    return executeApiPut(`user`, user, () => {}, "Failed to update user");
}

/**
 * Update the image for the current user.
 * 
 * @param image The new image for the user as a File object
 */
export function updateUserImage(image: File) {
    const data = new FormData();
    data.append("image", image);
    return executeApiPut(`user/image`, data, () => {}, "Failed to update user");
}

/**
 * Get the URL to the image of the user with the given id.
 * 
 * @param uuid The id of the user
 * @returns The URL to the image
 */
export function getUserImageUri(uuid: string): string {
    return `${apiRoot}/user/${uuid}/image`;
}

