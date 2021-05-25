
import supertest, { Response } from 'supertest';

import database from '../database';
import { api } from '../api';
import { generateAuthToken } from './auth';

const request = supertest(api);

describe('POST /team', () => {
    let response: Response;

    beforeAll(async () => {
        response = await request
            .post('/v1/team')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`)
            .send({
                name: 'Team20',
            });
    });

    test('returns the id of the new team', async () => {
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.id).toBeTruthy();
    });

    test('team can be requested afterwards', async () => {
        const resp = await request
            .get(`/v1/team/${response.body.id}`)
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.team.id).toEqual(response.body.id);
        expect(resp.body.team.name).toEqual('Team20');
        expect(resp.body.team.role).toBeTruthy();
    });

    afterAll(async () => {
        await database('teams')
            .delete()
            .where({ 'teams.name': 'Team20' });
    });
});

describe('PUT /team/:uuid', () => {
    let response: Response;

    beforeAll(async () => {
        response = await request
            .put('/v1/team/00000000-0000-4000-8000-000000000000')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`)
            .send({
                name: 'Team20',
            });
    });

    test('returns successfully', async () => {
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
    });

    test('team has now the new name', async () => {
        const resp = await request
            .get('/v1/team/00000000-0000-4000-8000-000000000000')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.team.id).toEqual('00000000-0000-4000-8000-000000000000');
        expect(resp.body.team.name).toEqual('Team20');
        expect(resp.body.team.role).toEqual('00000000-0000-4000-8000-000000000000');
    });

    afterAll(async () => {
        await request
            .put('/v1/team/00000000-0000-4000-8000-000000000000')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`)
            .send({
                name: 'Team0',
            });
    });
});

describe('GET /team', () => {
    test('returns all teams the user is a member of', async () => {
        const resp = await request
            .get('/v1/team')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.teams.length).toEqual(2);
    });

    test('includes teams with a single member', async () => {
        const resp = await request
            .get('/v1/team')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.teams).toContainEqual({
            id: '00000000-0000-4000-8000-000000000000',
            name: 'Team0',
            role: '00000000-0000-4000-8000-000000000000',
        });
    });

    test('includes shared teams', async () => {
        const resp = await request
            .get('/v1/team')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.teams).toContainEqual({
            id: '00000000-0000-4000-8000-000000000002',
            name: 'Team2',
            role: '00000000-0000-4000-8000-000000000002',
        });
    });
});

describe('GET /team/:uuid', () => {
    test('returns the requested teams', async () => {
        const resp = await request
            .get('/v1/team/00000000-0000-4000-8000-000000000000')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.team.id).toEqual('00000000-0000-4000-8000-000000000000');
        expect(resp.body.team.name).toEqual('Team0');
        expect(resp.body.team.role).toEqual('00000000-0000-4000-8000-000000000000');
    });

    test('can request teams one is not part of', async () => {
        const resp = await request
            .get('/v1/team/00000000-0000-4000-8000-000000000001')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.team.id).toEqual('00000000-0000-4000-8000-000000000001');
        expect(resp.body.team.name).toEqual('Team1');
        expect(resp.body.team.role).toBeNull();
    });
});

describe('GET /team/:uuid', () => {
    test('returns the requested teams', async () => {
        const resp = await request
            .get('/v1/team/00000000-0000-4000-8000-000000000000')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.team.id).toEqual('00000000-0000-4000-8000-000000000000');
        expect(resp.body.team.name).toEqual('Team0');
        expect(resp.body.team.role).toEqual('00000000-0000-4000-8000-000000000000');
    });

    test('can request teams one is not part of', async () => {
        const resp = await request
            .get('/v1/team/00000000-0000-4000-8000-000000000001')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.team.id).toEqual('00000000-0000-4000-8000-000000000001');
        expect(resp.body.team.name).toEqual('Team1');
        expect(resp.body.team.role).toBeNull();
    });
});

describe('GET /team/:uuid/members', () => {
    test('returns all the members of the team', async () => {
        const resp = await request
            .get('/v1/team/00000000-0000-4000-8000-000000000002/members')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.members.length).toEqual(2);
    });

    test('contains the user itself', async () => {
        const resp = await request
            .get('/v1/team/00000000-0000-4000-8000-000000000002/members')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.members).toContainEqual({
            id: '00000000-0000-4000-8000-000000000000',
            username: 'user0',
            realname: 'Testing Tester',
            email: 'test0@example.com',
            role: { id: '00000000-0000-4000-8000-000000000002', name: 'Role2' },
        });
    });

    test('contains other members', async () => {
        const resp = await request
            .get('/v1/team/00000000-0000-4000-8000-000000000002/members')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.members).toContainEqual({
            id: '00000000-0000-4000-8000-000000000001',
            username: 'user1',
            realname: 'Tester Testing',
            email: 'test1@example.com',
            role: { id: '00000000-0000-4000-8000-000000000003', name: 'Role3' },
        });
    });
});

describe('GET /team/:uuid/roles', () => {
    test('returns all the roles of the team', async () => {
        const resp = await request
            .get('/v1/team/00000000-0000-4000-8000-000000000002/roles')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.roles.length).toEqual(2);
    });

    test('contains the users own role', async () => {
        const resp = await request
            .get('/v1/team/00000000-0000-4000-8000-000000000002/roles')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.roles).toContainEqual({
            id: '00000000-0000-4000-8000-000000000002',
            name: 'Role2',
        });
    });

    test('contains other members roles', async () => {
        const resp = await request
            .get('/v1/team/00000000-0000-4000-8000-000000000002/roles')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.roles).toContainEqual({
            id: '00000000-0000-4000-8000-000000000003',
            name: 'Role3',
        });
    });
});

describe('GET /team/:uuid/projects', () => {
    test('returns all the projects of the team', async () => {
        const resp = await request
            .get('/v1/team/00000000-0000-4000-8000-000000000000/projects')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.projects.length).toEqual(2);
    });

    test('containt all the projects information', async () => {
        const resp = await request
            .get('/v1/team/00000000-0000-4000-8000-000000000000/projects')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.projects).toContainEqual({
            id: '00000000-0000-4000-8000-000000000000',
            name: 'Project0',
            text: 'Project0 Text',
            color: '#00f',
            status: 'open',
            deadline: '2020-10-10',
        });
        expect(resp.body.projects).toContainEqual({
            id: '00000000-0000-4000-8000-000000000002',
            name: 'Project2',
            text: 'Project2 Text',
            color: '#f00',
            status: 'suspended',
            deadline: null,
        });
    });
});

describe('GET /team/:uuid/work', () => {
    test('returns all the work items done by teams members', async () => {
        const resp = await request
            .get('/v1/team/00000000-0000-4000-8000-000000000000/work')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.work.length).toEqual(3);
    });

    test('containt all finished work information', async () => {
        const resp = await request
            .get('/v1/team/00000000-0000-4000-8000-000000000000/work')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.work).toContainEqual({
            id: '00000000-0000-4000-8000-000000000000',
            task: '00000000-0000-4000-8000-000000000005',
            user: '00000000-0000-4000-8000-000000000000',
            started: Date.parse('2020-10-10T12:00:00'),
            finished: Date.parse('2020-10-10T13:00:00'),
        });
        expect(resp.body.work).toContainEqual({
            id: '00000000-0000-4000-8000-000000000001',
            task: '00000000-0000-4000-8000-000000000005',
            user: '00000000-0000-4000-8000-000000000000',
            started: Date.parse('2020-10-10T13:00:00'),
            finished: Date.parse('2020-10-10T14:00:00'),
        });
    });

    test('containt all unfinished work information', async () => {
        const resp = await request
            .get('/v1/team/00000000-0000-4000-8000-000000000000/work')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.work).toContainEqual({
            id: '00000000-0000-4000-8000-000000000002',
            task: '00000000-0000-4000-8000-000000000005',
            user: '00000000-0000-4000-8000-000000000000',
            started: Date.parse('2020-10-11T12:00:00'),
            finished: null,
        });
    });

    test('can be limited in time with from date', async () => {
        const resp = await request
            .get(`/v1/team/00000000-0000-4000-8000-000000000000/work?since=${Date.parse('2020-10-10T20:00:00')}`)
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.work.length).toEqual(1);
    });

    test('can be limited in time with to date', async () => {
        const resp = await request
            .get(`/v1/team/00000000-0000-4000-8000-000000000000/work?to=${Date.parse('2020-10-10T20:00:00')}`)
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.work.length).toEqual(2);
    });
});

describe('GET /team/:uuid/activity', () => {
    test('returns time worked for all days', async () => {
        const response = await request
            .get('/v1/team/00000000-0000-4000-8000-000000000000/activity')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.activity.length).toEqual(1);
    });

    test('returns the total amount of work for each day', async () => {
        const response = await request
            .get('/v1/team/00000000-0000-4000-8000-000000000000/activity')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.activity[0].day).toEqual('2020-10-10');
        expect(response.body.activity[0].time).toEqual(120 * 60 * 1000);
    });

    test('can be limited in time with from date', async () => {
        const response = await request
            .get(`/v1/team/00000000-0000-4000-8000-000000000000/activity?since=${Date.parse('2020-10-10T20:00:00')}`)
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.activity.length).toEqual(0);
    });
});

describe('GET /team/:uuid/completion', () => {
    test('returns completion for all tasks of all projects', async () => {
        const response = await request
            .get('/v1/team/00000000-0000-4000-8000-000000000000/completion')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.completion).toEqual({
            open: 2,
            closed: 1,
            suspended: 1,
            overdue: 1,
        });
    });

    test('can be limited in time with from date', async () => {
        const response = await request
            .get(`/v1/team/00000000-0000-4000-8000-000000000000/completion?since=${Date.parse('2020-10-30T20:00:00')}`)
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.completion).toEqual({
            open: 0,
            closed: 0,
            suspended: 0,
            overdue: 1,
        });
    });
});

