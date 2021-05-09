
import { executeApiGet, executeApiPost, executeApiPut } from './util';

export interface Work {
    id: string;
    task: string;
    user: string;
    started: Date;
    finished?: Date;
}

export function startWork(task: string): Promise<string> {
    return executeApiPost(`work/start`, { task: task }, ({ id }) => id, "Failed to start work");
}

export function finishWork() {
    return executeApiPut(`work/finish`, null, () => {}, "Failed to finish work");
}

export function openWork(): Promise<Work> {
    return executeApiGet(`work/`, ({ work }) => ({
        ...work,
        started: new Date(work.started),
        finished: work.finished ? new Date(work.finished) : undefined,
    }), "Failed to get open work");
}

