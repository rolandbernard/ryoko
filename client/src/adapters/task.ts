

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

