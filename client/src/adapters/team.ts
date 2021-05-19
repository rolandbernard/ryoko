
import { executeApiDelete, executeApiGet, executeApiPost, executeApiPut } from './util';
import { User } from './user';
import { ReducedProject } from './project';
import { Work } from './work';
import { Activity, Completion } from './util';

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

export function getTeams(): Promise<Team[]> {
    return executeApiGet(`team`, ({ teams }) => teams, "Failed to get teams");
}

export function getTeam(uuid: string): Promise<Team> {
    return executeApiGet(`team/${uuid}`, ({ team }) => team, "Failed to get team");
}

export function getTeamMembers(uuid: string): Promise<TeamMember[]> {
    return executeApiGet(`team/${uuid}/members`, ({ members }) => members, "Failed to get team members");
}

export function getTeamRoles(uuid: string): Promise<TeamRole[]> {
    return executeApiGet(`team/${uuid}/roles`, ({ roles }) => roles, "Failed to get team roles");
}

export function getTeamProjects(uuid: string): Promise<ReducedProject[]> {
    return executeApiGet(`team/${uuid}/projects`, ({ projects }) => projects.map((project: any) => ({
        ...project,
        deadline: new Date(project.deadline),
    })), "Failed to get team projects");
}

export function getTeamWork(uuid: string): Promise<Work[]> {
    return executeApiGet(`team/${uuid}/work`, ({ work }) => work.map((work: any) => ({
        ...work,
        started: new Date(work.started),
        finished: work.finished ? new Date(work.finished) : undefined,
    })), "Failed to get team work");
}

export function getTeamActivity(uuid: string, from: Date = new Date(0), to: Date = new Date()): Promise<Activity[]> {
    return executeApiGet(
        `team/${uuid}/activity?since=${from.getTime()}&to=${to.getTime()}`,
        ({ activity }) => activity, "Failed to get team activity"
    );
}

export function getTeamCompletion(uuid: string, from: Date = new Date(0), to: Date = new Date()): Promise<Completion> {
    return executeApiGet(
        `team/${uuid}/completion?since=${from.getTime()}&to=${to.getTime()}`,
        ({ completion }) => completion, "Failed to get team completion"
    );
}

export function createTeam(name: string): Promise<string> {
    return executeApiPost(`team`, { name: name }, ({ id }) => id, "Failed to create team");
}

export function updateTeam(uuid: string, name: string) {
    return executeApiPut(`team/${uuid}`, { name: name }, () => {}, "Failed to update team");
}

export function createTeamRole(team: string, name: string): Promise<TeamRole> {
    return executeApiPost(`team/${team}/roles`, { name: name }, ({ role }) => role, "Failed to create team role");
}

export function updateTeamRole(team: string, role: string, name: string) {
    return executeApiPut(`team/${team}/roles/${role}`, { name: name }, () => {}, "Failed to update team role");
}

export function deleteTeamRole(team: string, role: string) {
    return executeApiDelete(`team/${team}/roles/${role}`, () => {}, "Failed to delete team role");
}

export function addTeamMember(team: string, member: { user: string, role: string }) {
    return executeApiPost(`team/${team}/members`, member, () => {}, "Failed to add team member");
}

export function updateTeamMember(team: string, member: { user: string, role: string }) {
    return executeApiPut(`team/${team}/members`, member, () => {}, "Failed to update team member");
}

export function removeTeamMember(team: string, user: string) {
    return executeApiDelete(`team/${team}/members/${user}`, () => {}, "Failed to remove team member");
}

export function leaveTeam(team: string) {
    return executeApiDelete(`team/${team}`, () => {}, "Failed to leave team");
}

