
import { apiRoot } from 'config';

import { getAuthHeader } from './auth';
import { Task } from './task';
import { User } from './user';
import { Work } from './work';

export interface Project {
    id: string;
    name: string;
    text: string;
    color: string;
    status: 'open' | 'closed' | 'suspended';
    deadline: Date;
    teams: Array<string>;
}

export interface AssignedUser extends User {
    time: number;
}

export type ReducedProject = Exclude<Project, 'teams'>;

export async function getProjects(): Promise<ReducedProject[]> {
    try {
        const response = await fetch(`${apiRoot}/project/`, { headers: getAuthHeader() });
        if (response.ok) {
            return (await response.json()).projects.map((project: any) => ({
                ...project,
                deadline: new Date(project.deadline),
            }));
        } else {
            throw new Error("Failed to get projects");
        }
    } catch (e) {
        throw e;
    }
}

export async function getProject(uuid: string): Promise<Project> {
    try {
        const response = await fetch(`${apiRoot}/project/${uuid}`, { headers: getAuthHeader() });
        if (response.ok) {
            const project = (await response.json()).project;
            return {
                ...project,
                deadline: new Date(project.deadline),
            }
        } else {
            throw new Error("Failed to get project");
        }
    } catch (e) {
        throw e;
    }
}

export async function getProjectTasks(uuid: string): Promise<Task[]> {
    try {
        const response = await fetch(`${apiRoot}/project/${uuid}/tasks`, { headers: getAuthHeader() });
        if (response.ok) {
            return (await response.json()).tasks.map((task: any) => ({
                ...task,
                edited: new Date(task.edited),
                created: new Date(task.created),
            }));
        } else {
            throw new Error("Failed to get project tasks");
        }
    } catch (e) {
        throw e;
    }
}

export async function getProjectAssignees(uuid: string): Promise<AssignedUser[]> {
    try {
        const response = await fetch(`${apiRoot}/project/${uuid}/assigned`, { headers: getAuthHeader() });
        if (response.ok) {
            return (await response.json()).assigned;
        } else {
            throw new Error("Failed to get project assignees");
        }
    } catch (e) {
        throw e;
    }
}

export async function getProjectWork(uuid: string): Promise<Work[]> {
    try {
        const response = await fetch(`${apiRoot}/project/${uuid}/work`, { headers: getAuthHeader() });
        if (response.ok) {
            return (await response.json()).work.map((work: any) => ({
                ...work,
                started: new Date(work.started),
                finished: new Date(work.finished),
            }));
        } else {
            throw new Error("Failed to get project work");
        }
    } catch (e) {
        throw e;
    }
}

