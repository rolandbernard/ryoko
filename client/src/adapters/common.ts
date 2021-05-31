
export const StatusColors = new Map<string, string>([
    ['open', 'blue'],
    ['closed', 'purple'],
    ['suspended', 'red']
]);

export enum Status {
    OPEN = 'open',
    CLOSED = 'closed',
    SUSPENDED = 'suspended'
}

export interface Activity {
    day: string;
    time: number;
}

export interface Completion {
    open: number,
    closed: number,
    suspended: number,
    overdue: number,
    sum?: number
}

