
import { apiRoot } from 'config';

import { getAuthHeader } from './auth';
import { User } from './user';
import { ReducedProject } from './project';
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

export async function getTeamProjects(uuid: string): Promise<ReducedProject[]> {
    try {
        const response = await fetch(`${apiRoot}/team/${uuid}/projects`, { headers: getAuthHeader() });
        if (response.ok) {
            return (await response.json()).projects.map((project: any) => ({
                ...project,
                deadline: new Date(project.deadline),
            }));
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
            return (await response.json()).work.map((work: any) => ({
                ...work,
                started: new Date(work.started),
                finished: new Date(work.finished),
            }));
        } else {
            throw new Error("Failed to get team work");
        }
    } catch (e) {
        throw e;
    }
}

export async function createTeam(name: string): Promise<string> {
    try {
        const response = await fetch(`${apiRoot}/team/`, {
            method: 'POST',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
            }),
        });
        if (response.ok) {
            return (await response.json()).id;
        } else {
            throw new Error("Failed to create team");
        }
    } catch (e) {
        throw e;
    }
}

export async function removeTeamMember(team: string, user: string) {
    try {
        const response = await fetch(`${apiRoot}/team/${team}/members/${user}`, {
            method: 'DELETE',
            headers: getAuthHeader(),
        });
        if (!response.ok) {
            throw new Error("Failed to create team");
        }
    } catch (e) {
        throw e;
    }
}

export async function createTeamRole(team: string, name: string): Promise<TeamRole> {
    try {
        const response = await fetch(`${apiRoot}/team/${team}/roles`, {
            method: 'POST',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
            }),
        });
        if (response.ok) {
            return (await response.json()).role;
        } else {
            throw new Error("Failed to create team role");
        }
    } catch (e) {
        throw e;
    }
}

export async function deleteTeamRole(team: string, role: string) {
    try {
        const response = await fetch(`${apiRoot}/team/${team}/roles/${role}`, {
            method: 'DELETE',
            headers: getAuthHeader(),
        });
        if (!response.ok) {
            throw new Error("Failed to delete team role");
        }
    } catch (e) {
        throw e;
    }
}

export async function addTeamMember(team: string, member: { user: string, role: string }) {
    try {
        const response = await fetch(`${apiRoot}/team/${team}/members`, {
            method: 'POST',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(member),
        });
        if (!response.ok) {
            throw new Error("Failed to add team member");
        }
    } catch (e) {
        throw e;
    }
}

export async function updateTeamMember(team: string, member: { user: string, role: string }) {
    try {
        const response = await fetch(`${apiRoot}/team/${team}/members`, {
            method: 'PUT',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(member),
        });
        if (!response.ok) {
            throw new Error("Failed to update team member");
        }
    } catch (e) {
        throw e;
    }
}

export async function leaveTeam(team: string) {
    try {
        const response = await fetch(`${apiRoot}/team/${team}`, {
            method: 'DELETE',
            headers: getAuthHeader(),
        });
        if (!response.ok) {
            throw new Error("Failed to leave team");
        }
    } catch (e) {
        throw e;
    }
}

