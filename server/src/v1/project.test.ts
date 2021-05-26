
import supertest from 'supertest';

import { api } from '../api';
import { generateAuthToken } from './auth';

const request = supertest(api);

describe('GET /project', () => {
    test('returns all projects the user can see', async () => {
        const resp = await request
            .get('/v1/project')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.projects.length).toEqual(3);
    });

    test('includes projects of team 0', async () => {
        const resp = await request
            .get('/v1/project')
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

    test('includes projects of team 2', async () => {
        const resp = await request
            .get('/v1/project')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.projects).toContainEqual({
            id: '00000000-0000-4000-8000-000000000001',
            name: 'Project1',
            text: 'Project1 Text',
            color: '#0f0',
            status: 'closed',
            deadline: null,
        });
    });
});

describe('GET /project/:uuid', () => {
    test('returns information for the requested project', async () => {
        const resp = await request
            .get('/v1/project/00000000-0000-4000-8000-000000000000')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.project).toEqual({
            id: '00000000-0000-4000-8000-000000000000',
            name: 'Project0',
            text: 'Project0 Text',
            color: '#00f',
            status: 'open',
            deadline: '2020-10-10',
            teams: [ '00000000-0000-4000-8000-000000000000' ],
        });
    });
});

describe('GET /project/:uuid/tasks', () => {
    test('returns all the tasks in the project', async () => {
        const resp = await request
            .get('/v1/project/00000000-0000-4000-8000-000000000002/tasks')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.tasks.length).toEqual(4);
    });

    test('contains open tasks', async () => {
        const resp = await request
            .get('/v1/project/00000000-0000-4000-8000-000000000002/tasks')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.tasks).toContainEqual({
            id: '00000000-0000-4000-8000-000000000002',
            project: '00000000-0000-4000-8000-000000000002',
            name: 'Task2',
            text: 'Task2 Text',
            icon: '2',
            status: 'open',
            priority: 'low',
            created: Date.parse('2020-10-15'),
            edited: Date.parse('2020-10-20'),
            assigned: [],
            dependencies: [ '00000000-0000-4000-8000-000000000005' ],
            requirements: [],
        });
        expect(resp.body.tasks).toContainEqual({
            id: '00000000-0000-4000-8000-000000000005',
            project: '00000000-0000-4000-8000-000000000002',
            name: 'Task5',
            text: 'Task5 Text',
            icon: '5',
            status: 'open',
            priority: 'urgent',
            created: Date.parse('2020-10-15'),
            edited: Date.parse('2020-11-20'),
            assigned: [ { user: '00000000-0000-4000-8000-000000000000', time: 120, finished: false } ],
            dependencies: [ ],
            requirements: [
                { role: '00000000-0000-4000-8000-000000000000', time: 60 },
                { role: '00000000-0000-4000-8000-000000000001', time: 30 },
            ],
        });
    });

    test('contains closed tasks', async () => {
        const resp = await request
            .get('/v1/project/00000000-0000-4000-8000-000000000002/tasks')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.tasks).toContainEqual({
            id: '00000000-0000-4000-8000-000000000003',
            project: '00000000-0000-4000-8000-000000000002',
            name: 'Task3',
            text: 'Task3 Text',
            icon: '3',
            status: 'closed',
            priority: 'urgent',
            created: Date.parse('2020-10-15'),
            edited: Date.parse('2020-10-20'),
            assigned: [ ],
            dependencies: [ ],
            requirements: [ ],
        });
    });

    test('contains suspended tasks', async () => {
        const resp = await request
            .get('/v1/project/00000000-0000-4000-8000-000000000002/tasks')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.tasks).toContainEqual({
            id: '00000000-0000-4000-8000-000000000004',
            project: '00000000-0000-4000-8000-000000000002',
            name: 'Task4',
            text: 'Task4 Text',
            icon: '4',
            status: 'suspended',
            priority: 'urgent',
            created: Date.parse('2020-10-15'),
            edited: Date.parse('2020-10-20'),
            assigned: [ ],
            dependencies: [ ],
            requirements: [ ],
        });
    });
});

describe('GET /project/:uuid/assigned', () => {
    test('returns all users that are assigned to one of the projects tasks', async () => {
        const resp = await request
            .get('/v1/project/00000000-0000-4000-8000-000000000002/assigned')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.assigned.length).toEqual(1);
    });

    test('contains the user information', async () => {
        const resp = await request
            .get('/v1/project/00000000-0000-4000-8000-000000000002/assigned')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.assigned).toContainEqual({
            id: '00000000-0000-4000-8000-000000000000',
            username: 'user0',
            email: 'test0@example.com',
            realname: 'Testing Tester',
            time: 120,
        });
    });
});

describe('GET /project/:uuid/work', () => {
    test('returns all the work items done for the projects tasks', async () => {
        const resp = await request
            .get('/v1/project/00000000-0000-4000-8000-000000000002/work')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.work.length).toEqual(3);
    });

    test('containt all finished work information', async () => {
        const resp = await request
            .get('/v1/project/00000000-0000-4000-8000-000000000002/work')
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
            .get('/v1/project/00000000-0000-4000-8000-000000000002/work')
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
            .get(`/v1/project/00000000-0000-4000-8000-000000000002/work?since=${Date.parse('2020-10-10T20:00:00')}`)
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.work.length).toEqual(1);
    });

    test('can be limited in time with to date', async () => {
        const resp = await request
            .get(`/v1/project/00000000-0000-4000-8000-000000000002/work?to=${Date.parse('2020-10-10T20:00:00')}`)
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.work.length).toEqual(2);
    });
});

describe('GET /project/:uuid/activity', () => {
    test('returns time worked for all days', async () => {
        const response = await request
            .get('/v1/project/00000000-0000-4000-8000-000000000002/activity')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.activity.length).toEqual(1);
    });

    test('returns the total amount of work for each day', async () => {
        const response = await request
            .get('/v1/project/00000000-0000-4000-8000-000000000002/activity')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.activity[0].day).toEqual('2020-10-10');
        expect(response.body.activity[0].time).toEqual(120 * 60 * 1000);
    });

    test('can be limited in time with from date', async () => {
        const response = await request
            .get(`/v1/project/00000000-0000-4000-8000-000000000002/activity?since=${Date.parse('2020-10-10T20:00:00')}`)
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.activity.length).toEqual(0);
    });
});

describe('GET /project/:uuid/completion', () => {
    test('returns completion for all tasks of the project', async () => {
        const response = await request
            .get('/v1/project/00000000-0000-4000-8000-000000000002/completion')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.completion).toEqual({
            open: 1,
            closed: 1,
            suspended: 1,
            overdue: 1,
        });
    });

    test('can be limited in time with from date', async () => {
        const response = await request
            .get(`/v1/project/00000000-0000-4000-8000-000000000002/completion?since=${Date.parse('2020-10-30T20:00:00')}`)
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

