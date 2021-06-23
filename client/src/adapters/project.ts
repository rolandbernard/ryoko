
import { executeApiGet, executeApiPost, executeApiPut } from './request';
import { Task } from './task';
import { AssignedUser } from './user';
import { Work } from './work';
import { Activity, Completion, Status } from './common';

export enum ProjectColors {
    RED = 'red',
    ORANGE = 'orange',
    YELLOW = 'yellow',
    GREEN = 'green',
    LIGHTBLUE = 'lightblue',
    BLUE = 'blue',
    PURPLE = 'purple',
}

export interface Project {
    id: string;
    name: string;
    text: string;
    color: string;
    status: Status;
    deadline?: Date;
    teams: Array<string>;
}

export type ReducedProject = Exclude<Project, 'teams'>;

/**
 * Get all projects visible to the user.
 * 
 * @returns A promise resolving to the array of projects
 */
export function getProjects(): Promise<ReducedProject[]> {
    return executeApiGet(`project`, ({ projects }) => projects.map((project: any) => ({
        ...project,
        deadline: project.deadline ? new Date(project.deadline) : undefined,
    })), "Failed to get projects");
}

/**
 * Get the information for the project with the given id.
 * 
 * @param uuid The of the project to get
 * @returns A promise resolving to the project
 */
export function getProject(uuid: string): Promise<Project> {
    return executeApiGet(`project/${uuid}`, ({ project }) => ({
        ...project,
        deadline: project.deadline ? new Date(project.deadline) : undefined,
    }), "Failed to get project");
}

/**
 * Get the task for the project with the given id.
 * 
 * @param uuid The id of the project
 * @returns A promise resolving to an array of tasks
 */
export function getProjectTasks(uuid: string): Promise<Task[]> {
    return executeApiGet(`project/${uuid}/tasks`, ({ tasks }) => tasks.map((task: any) => ({
        ...task,
        edited: new Date(task.edited),
        created: new Date(task.created),
    })), "Failed to get project tasks");
}

/**
 * Get the users assigned to a task in the project with the given id.
 *
 * @param uuid The id of the project
 * @returns A promise resolving to an array of users
 */
export function getProjectAssignees(uuid: string): Promise<AssignedUser[]> {
    return executeApiGet(`project/${uuid}/assigned`, ({ assigned }) => assigned, "Failed to get project assignees");
}

/**
 * Get the work items done for tasks of the project with the given id.
 * 
 * @param uuid The id of the project
 * @returns A promise resolving to an array of work items
 */
export function getProjectWork(uuid: string): Promise<Work[]> {
    return executeApiGet(`project/${uuid}/work`, ({ work }) => work.map((work: any) => ({
        ...work,
        started: new Date(work.started),
        finished: work.finished ? new Date(work.finished) : undefined,
    })), "Failed to get project work");
}

/**
 * Get the activity for the project with the given id between the specified dates.
 * 
 * @param uuid The id of the project
 * @param from The date to start from
 * @param to The date to end with
 * @returns A promise resolving to an array of activity entries
 */
export function getProjectActivity(uuid: string, from: Date = new Date(0), to: Date = new Date()): Promise<Activity[]> {
    return executeApiGet(
        `project/${uuid}/activity?since=${from.getTime()}&to=${to.getTime()}`,
        ({ activity }) => activity, "Failed to get project activity"
    );
}

/**
 * Get the completion for the project with the given id between the specified dates.
 * 
 * @param uuid The id of the project
 * @param from The date to start from
 * @param to The date to end with
 * @returns A promise resolving to a completion item
 */
export function getProjectCompletion(uuid: string, from: Date = new Date(0), to: Date = new Date()): Promise<Completion> {
    return executeApiGet(
        `project/${uuid}/completion?since=${from.getTime()}&to=${to.getTime()}`,
        ({ completion }) => ({...completion, sum: (
            completion.open + 
            completion.closed + 
            completion.suspended +
            completion.overdue
        ) || 1}), "Failed to get project completion"
    );
}

interface NewProjectData {
    teams: Array<string>;
    name: string;
    text: string;
    color: string;
    deadline?: string;
}

/**
 * Create a new project.
 * 
 * @param project The data for the new project
 * @returns A promise resolving to the id of the new project
 */
export function createProject(project: NewProjectData): Promise<string> {
    return executeApiPost(`project`, project, ({ id }) => id, "Failed to create project");
}

interface UpdateProjectData {
    remove_teams?: Array<string>;
    add_teams?: Array<string>;
    name?: string;
    text?: string;
    color?: string;
    status?: string;
    deadline?: string;
}

/**
 * Update an existing project.
 * 
 * @param uuid The id of the project
 * @param project The data to update
 */
export function updateProject(uuid: string, project: UpdateProjectData) {
    return executeApiPut(`project/${uuid}`, project, () => {}, "Failed to update project");
}


