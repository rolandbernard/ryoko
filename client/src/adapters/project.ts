
import { executeApiGet, executeApiPost, executeApiPut } from './util';
import { Task } from './task';
import { AssignedUser } from './user';
import { Work } from './work';

export interface Project {
    id: string;
    name: string;
    text: string;
    color: string;
    status: 'open' | 'closed' | 'suspended';
    deadline?: Date;
    teams: Array<string>;
}

export type ReducedProject = Exclude<Project, 'teams'>;

export function getProjects(): Promise<ReducedProject[]> {
    return executeApiGet(`project`, ({ projects }) => projects.map((project: any) => ({
        ...project,
        deadline: project.deadline ? new Date(project.deadline) : undefined,
    })), "Failed to get projects");
}

export function getProject(uuid: string): Promise<Project> {
    return executeApiGet(`project/${uuid}`, ({ project }) => ({
        ...project,
        deadline: project.deadline ? new Date(project.deadline) : undefined,
    }), "Failed to get project");
}

export function getProjectTasks(uuid: string): Promise<Task[]> {
    return executeApiGet(`project/${uuid}/tasks`, ({ tasks }) => tasks.map((task: any) => ({
        ...task,
        edited: new Date(task.edited),
        created: new Date(task.created),
    })), "Failed to get project tasks");
}

export function getProjectAssignees(uuid: string): Promise<AssignedUser[]> {
    return executeApiGet(`project/${uuid}/assigned`, ({ assigned }) => assigned, "Failed to get project assignees");
}

export function getProjectWork(uuid: string): Promise<Work[]> {
    return executeApiGet(`project/${uuid}/work`, ({ work }) => work.map((work: any) => ({
        ...work,
        started: new Date(work.started),
        finished: work.finished ? new Date(work.finished) : undefined,
    })), "Failed to get project work");
}

interface NewTeamData {
    teams: Array<string>;
    name: string;
    text: string;
    color: string;
    deadline?: Date;
}

export function createProject(project: NewTeamData): Promise<string> {
    return executeApiPost(`project`, project, ({ id }) => id, "Failed to create project");
}

interface UpdateTeamData {
    remove_teams?: Array<string>;
    add_teams?: Array<string>;
    name?: string;
    text?: string;
    color?: string;
    status?: string;
    deadline?: string;
}

export function updateProject(uuid: string, project: UpdateTeamData) {
    return executeApiPut(`project/${uuid}`, project, () => {}, "Failed to update project");
}


