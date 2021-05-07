
import { apiRoot } from 'config';

import { getAuthHeader } from './auth';
import { Comment } from './comment';
import { Work } from './work';

export interface TaskRequirement {
    role: string;
    time: number;
}

export interface TaskAssignment {
    user: string;
    time: number;
    finished: boolean;
}

export interface Task {
    id: string;
    project: string;
    name: string;
    text: string;
    icon: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'open' | 'closed' | 'suspended';
    dependentcies: Array<string>;
    requirements: Array<TaskRequirement>;
    assigned: Array<TaskAssignment>;
    created: Date;
    edited: Date;
}

export async function getTasks(): Promise<Task[]> {
    try {
        const response = await fetch(`${apiRoot}/task`, { headers: getAuthHeader() });
        if (response.ok) {
            return (await response.json()).tasks.map((task: any) => ({
                ...task,
                edited: new Date(task.edited),
                created: new Date(task.created),
            }));
        } else {
            throw new Error("Failed to get tasks");
        }
    } catch (e) {
        throw e;
    }
}

export async function getTasksWithStatus(status: 'open' | 'closed' | 'suspended'): Promise<Task[]> {
    try {
        const response = await fetch(`${apiRoot}/task/${status}`, { headers: getAuthHeader() });
        if (response.ok) {
            return (await response.json()).tasks.map((task: any) => ({
                ...task,
                edited: new Date(task.edited),
                created: new Date(task.created),
            }));
        } else {
            throw new Error("Failed to get tasks with status");
        }
    } catch (e) {
        throw e;
    }
}

export async function getPossibleTasks(): Promise<Task[]> {
    try {
        const response = await fetch(`${apiRoot}/task/possible`, { headers: getAuthHeader() });
        if (response.ok) {
            return (await response.json()).tasks.map((task: any) => ({
                ...task,
                edited: new Date(task.edited),
                created: new Date(task.created),
            }));
        } else {
            throw new Error("Failed to get possible tasks");
        }
    } catch (e) {
        throw e;
    }
}

export async function getTask(uuid: string): Promise<Task> {
    try {
        const response = await fetch(`${apiRoot}/task/${uuid}`, { headers: getAuthHeader() });
        if (response.ok) {
            const task = (await response.json()).task;
            return {
                ...task,
                edited: new Date(task.edited),
                created: new Date(task.created),
            };
        } else {
            throw new Error("Failed to get task");
        }
    } catch (e) {
        throw e;
    }
}

export async function getTaskComments(uuid: string): Promise<Comment[]> {
    try {
        const response = await fetch(`${apiRoot}/task/${uuid}/comments`, { headers: getAuthHeader() });
        if (response.ok) {
            return (await response.json()).comments.map((comment: any) => ({
                ...comment,
                edited: new Date(comment.edited),
                created: new Date(comment.created),
            }));
        } else {
            throw new Error("Failed to get task comments");
        }
    } catch (e) {
        throw e;
    }
}

export async function getTaskWork(uuid: string): Promise<Work[]> {
    try {
        const response = await fetch(`${apiRoot}/task/${uuid}/work`, { headers: getAuthHeader() });
        if (response.ok) {
            return (await response.json()).work.map((work: any) => ({
                ...work,
                started: new Date(work.started),
                finished: work.finished ? new Date(work.finished) : undefined,
            }));
        } else {
            throw new Error("Failed to get task work");
        }
    } catch (e) {
        throw e;
    }
}

