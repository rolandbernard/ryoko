
export interface Project {
    id: string;
    name: string;
    status: 'open' | 'closed' | 'suspended';
    teams: Array<string>;
}

