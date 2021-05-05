
import { apiRoot } from 'config';

import { getAuthHeader } from './auth';
import { User } from './user';
import { Project } from './project';
import { Work } from './work';

export interface Team {
    id: string;
    name: string;
    role?: string;
}

export interface TeamRole {
    id: string;
    name: string;
}

export interface TeamMember extends User {
    role: TeamRole;
}

type TeamProject = Exclude<Project, 'teams'>;

export async function getTeams(): Promise<Team[]> {
    try {
        const response = await fetch(`${apiRoot}/team/`, { headers: getAuthHeader() });
        if (response.ok) {
            return (await response.json()).teams;
        } else {
            throw new Error("Failed to get teams");
        }
    } catch (e) {
        throw e;
    }
}

export async function getTeam(uuid: string): Promise<Team> {
    try {
        const response = await fetch(`${apiRoot}/team/${uuid}`, { headers: getAuthHeader() });
        if (response.ok) {
            return (await response.json()).team;
        } else {
            throw new Error("Failed to get team");
        }
    } catch (e) {
        throw e;
    }
}

export async function getTeamMembers(uuid: string): Promise<TeamMember[]> {
    try {
        const response = await fetch(`${apiRoot}/team/${uuid}/members`, { headers: getAuthHeader() });
        if (response.ok) {
            return (await response.json()).members;
        } else {
            throw new Error("Failed to get team members");
        }
    } catch (e) {
        throw e;
    }
}

export async function getTeamRoles(uuid: string): Promise<TeamRole[]> {
    try {
        const response = await fetch(`${apiRoot}/team/${uuid}/roles`, { headers: getAuthHeader() });
        if (response.ok) {
            return (await response.json()).roles;
        } else {
            throw new Error("Failed to get team roles");
        }
    } catch (e) {
        throw e;
    }
}

export async function getTeamProjects(uuid: string): Promise<TeamProject[]> {
    try {
        const response = await fetch(`${apiRoot}/team/${uuid}/projects`, { headers: getAuthHeader() });
        if (response.ok) {
            return (await response.json()).projects;
        } else {
            throw new Error("Failed to get team projects");
        }
    } catch (e) {
        throw e;
    }
}

export async function getTeamWork(uuid: string): Promise<Work[]> {
    try {
        const response = await fetch(`${apiRoot}/team/${uuid}/work`, { headers: getAuthHeader() });
        if (response.ok) {
            return (await response.json()).work;
        } else {
            throw new Error("Failed to get team work");
        }
    } catch (e) {
        throw e;
    }
}


