
import { executeApiGet, executeApiPost, executeApiPut } from './request';

export interface Work {
    id: string;
    task: string;
    user: string;
    started: Date;
    finished?: Date;
}

/**
 * Start working with the current user on the task with the given id.
 * 
 * @param task The id of the task
 * @returns A promise resolving to the id of the new work item
 */
export function startWork(task: string): Promise<string> {
    return executeApiPost(`work/start`, { task: task }, ({ id }) => id, "Failed to start work");
}

/**
 * Finish working on the task the user currently works on.
 */
export function finishWork() {
    return executeApiPut(`work/finish`, null, () => {}, "Failed to finish work");
}

/**
 * Get the currently open work element for the current user.
 * 
 * @returns A promise resolving to the work element
 */
export function openWork(): Promise<Work> {
    return executeApiGet(`work/`, ({ work }) => ({
        ...work,
        started: new Date(work.started),
        finished: work.finished ? new Date(work.finished) : undefined,
    }), "Failed to get open work");
}

