
import { executeApiDelete, executeApiGet, executeApiPost, executeApiPut } from './request';
import { User } from './user';
import { ReducedProject } from './project';
import { Work } from './work';
import { Activity, Completion } from './common';

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

/**
 * Get all teams visible to the user.
 * 
 * @returns A promise resolving to the array of teams
 */
export function getTeams(): Promise<Team[]> {
    return executeApiGet(`team`, ({ teams }) => teams, "Failed to get teams");
}

/**
 * Get data for the team with the given id.
 * 
 * @param uuid The id of the team
 * @returns A promise resolving to the team
 */
export function getTeam(uuid: string): Promise<Team> {
    return executeApiGet(`team/${uuid}`, ({ team }) => team, "Failed to get team");
}

/**
 * Get all members of the team with the given id.
 * 
 * @param uuid The id of the team
 * @returns A promise resolving to the array of members
 */
export function getTeamMembers(uuid: string): Promise<TeamMember[]> {
    return executeApiGet(`team/${uuid}/members`, ({ members }) => members, "Failed to get team members");
}

/**
 * Get all roles that are part of the team with the given id.
 * 
 * @param uuid The id of the team
 * @returns A promise resolving to the array of roles
 */
export function getTeamRoles(uuid: string): Promise<TeamRole[]> {
    return executeApiGet(`team/${uuid}/roles`, ({ roles }) => roles, "Failed to get team roles");
}

/**
 * Get all projects the team with the given id belongs to.
 * 
 * @param uuid The id of the team
 * @returns A promise resolving to the array of projects
 */
export function getTeamProjects(uuid: string): Promise<ReducedProject[]> {
    return executeApiGet(`team/${uuid}/projects`, ({ projects }) => projects.map((project: any) => ({
        ...project,
        deadline: new Date(project.deadline),
    })), "Failed to get team projects");
}

/**
 * Get all work items done by members of the team with the given id.
 * 
 * @param uuid The id of the tea,
 * @returns A promise resolving to the array of work items
 */
export function getTeamWork(uuid: string): Promise<Work[]> {
    return executeApiGet(`team/${uuid}/work`, ({ work }) => work.map((work: any) => ({
        ...work,
        started: new Date(work.started),
        finished: work.finished ? new Date(work.finished) : undefined,
    })), "Failed to get team work");
}

/**
 * Get the activity for the the team with the given id.
 * 
 * @param uuid The id of the team
 * @param from The starting date
 * @param to The ending date
 * @returns A promise resolving to the array of activity items
 */
export function getTeamActivity(uuid: string, from: Date = new Date(0), to: Date = new Date()): Promise<Activity[]> {
    return executeApiGet(
        `team/${uuid}/activity?since=${from.getTime()}&to=${to.getTime()}`,
        ({ activity }) => activity, "Failed to get team activity"
    );
}

/**
 * Get the completion for the the team with the given id.
 * 
 * @param uuid The id of the team
 * @param from The starting date
 * @param to The ending date
 * @returns A promise resolving to completion data
 */
export function getTeamCompletion(uuid: string, from: Date = new Date(0), to: Date = new Date()): Promise<Completion> {
    return executeApiGet(
        `team/${uuid}/completion?since=${from.getTime()}&to=${to.getTime()}`,
        ({ completion }) => ({...completion, sum: (
            completion.open + 
            completion.closed + 
            completion.suspended + 
            completion.overdue
        ) || 1}), "Failed to get team completion"
    );
}

/**
 * Create a new team with the given name.
 * 
 * @param name The name for the new team
 * @returns A promise resolving to the id of the new team
 */
export function createTeam(name: string): Promise<string> {
    return executeApiPost(`team`, { name: name }, ({ id }) => id, "Failed to create team");
}

/**
 * Update the name of the team with the given id.
 * 
 * @param uuid The id of the team
 * @param name The new name of the team
 */
export function updateTeam(uuid: string, name: string) {
    return executeApiPut(`team/${uuid}`, { name: name }, () => {}, "Failed to update team");
}

/**
 * Create a new team role with the given name in the team with the given id.
 * 
 * @param team The id of the team
 * @param name The name for the new team role
 * @returns A promise resolving to the new role
 */
export function createTeamRole(team: string, name: string): Promise<TeamRole> {
    return executeApiPost(`team/${team}/roles`, { name: name }, ({ role }) => role, "Failed to create team role");
}

/**
 * Update the name of the team role with the given id in the team with the given id.
 * 
 * @param team The id of the team
 * @param role The id of the role
 * @param name The new name of the role
 */
export function updateTeamRole(team: string, role: string, name: string) {
    return executeApiPut(`team/${team}/roles/${role}`, { name: name }, () => {}, "Failed to update team role");
}

/**
 * Remove the role with the given id from the team with the given id. This function will only
 * succeed if no member currently has the given role.
 * 
 * @param team The id of the team
 * @param role The id of the role
 */
export function deleteTeamRole(team: string, role: string) {
    return executeApiDelete(`team/${team}/roles/${role}`, () => {}, "Failed to delete team role");
}

/**
 * Add a new member to the team with the given id
 * 
 * @param team The id of the team
 * @param member The information of the new member
 */
export function addTeamMember(team: string, member: { user: string, role: string }) {
    return executeApiPost(`team/${team}/members`, member, () => {}, "Failed to add team member");
}

/**
 * Update the role of a member to the team with the given id
 * 
 * @param team The id of the team
 * @param member The new information of the member
 */
export function updateTeamMember(team: string, member: { user: string, role: string }) {
    return executeApiPut(`team/${team}/members`, member, () => {}, "Failed to update team member");
}

/**
 * Remove a member with the given id from the team with te given id.
 * 
 * @param team The id of the team
 * @param user The id of the user that is a member of the team
 */
export function removeTeamMember(team: string, user: string) {
    return executeApiDelete(`team/${team}/members/${user}`, () => {}, "Failed to remove team member");
}

/**
 * Leave the team with the given id.
 * 
 * @param team The id of the team
 */
export function leaveTeam(team: string) {
    return executeApiDelete(`team/${team}`, () => {}, "Failed to leave team");
}

