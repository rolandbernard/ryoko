
import { executeApiGet, executeApiPost, executeApiPut } from './request';
import { Comment } from './comment';
import { Work } from './work';
import { AssignedUser } from './user';
import { ProjectColors } from './project';
import { Status } from './common';

export interface TaskRequirement {
    role: string;
    time: number;
}

export enum Priority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent'
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
    priority: Priority;
    status: Status;
    dependencies: Array<string>;
    requirements: Array<TaskRequirement>;
    assigned: Array<TaskAssignment>;
    created: Date;
    edited: Date;
    color: ProjectColors;
}

export function sortTasks(tasks: Task[]): Task[] {
    const PRIORITY: Record<Priority, number> = {
        'low': 4,
        'medium': 3,
        'high': 2,
        'urgent': 1,
    };
    return tasks.sort((a, b) => {
        if (a.priority !== b.priority) {
            return PRIORITY[a.priority] - PRIORITY[b.priority];
        } else if (a.dependencies.length !== b.dependencies.length) {
            return a.dependencies.length - b.dependencies.length;
        } else if (a.created.getTime() !== b.created.getTime()) {
            return a.created.getTime() - b.created.getTime();
        } else {
            return a.edited.getTime() - b.edited.getTime();
        }
    });
}

export function getTasks(): Promise<Task[]> {
    return executeApiGet(`task`, ({ tasks }) => sortTasks(tasks.map((task: any) => ({
        ...task,
        edited: new Date(task.edited),
        created: new Date(task.created),
    }))), "Failed to get tasks");
}

export function getTasksWithStatus(status: 'open' | 'closed' | 'suspended'): Promise<Task[]> {
    return executeApiGet(`task/${status}`, ({ tasks }) => sortTasks(tasks.map((task: any) => ({
        ...task,
        edited: new Date(task.edited),
        created: new Date(task.created),
    }))), "Failed to get tasks with status");
}

export function getPossibleTasks(): Promise<Task[]> {
    return executeApiGet(`task/possible`, ({ tasks }) => sortTasks(tasks.map((task: any) => ({
        ...task,
        edited: new Date(task.edited),
        created: new Date(task.created),
    }))), "Failed to get possible tasks");
}

export function getTask(uuid: string): Promise<Task> {
    return executeApiGet(`task/${uuid}`, ({ task }) => ({
        ...task,
        edited: new Date(task.edited),
        created: new Date(task.created),
    }), "Failed to get task");
}

export function getTaskComments(uuid: string): Promise<Comment[]> {
    return executeApiGet(`task/${uuid}/comments`, ({ comments }) => comments.map((comment: any) => ({
        ...comment,
        edited: new Date(comment.edited),
        created: new Date(comment.created),
    })), "Failed to get task comments");
}

export function getTaskWork(uuid: string): Promise<Work[]> {
    return executeApiGet(`task/${uuid}/work`, ({ work }) => work.map((work: any) => ({
        ...work,
        started: new Date(work.started),
        finished: work.finished ? new Date(work.finished) : undefined,
    })), "Failed to get task work");
}

export function getTaskAssignees(uuid: string): Promise<AssignedUser[]> {
    return executeApiGet(`task/${uuid}/assigned`, ({ assigned }) => assigned, "Failed to get task assignees");
}

interface AddTaskBody {
    project: string;
    name: string;
    text: string;
    icon: string;
    priority: Priority;
    dependencies: Array<string>;
    requirements: Array<TaskRequirement>;
    assigned: Array<TaskAssignment>;
}

export function createTask(task: AddTaskBody): Promise<string> {
    return executeApiPost(`task`, task, ({ id }) => id, "Failed to create task");
}

interface UpdateTaskBody {
    name?: string;
    text?: string;
    icon?: string;
    priority?: Priority;
    status?: Status;
    remove_dependencies?: Array<string>;
    remove_requirements?: Array<string>;
    remove_assigned?: Array<string>;
    add_dependencies?: Array<string>;
    add_requirements?: Array<TaskRequirement>;
    add_assigned?: Array<TaskAssignment>;
}

export function updateTask(uuid: string, task: UpdateTaskBody) {
    return executeApiPut(`task/${uuid}`, task, () => {}, "Failed to update task");
}

