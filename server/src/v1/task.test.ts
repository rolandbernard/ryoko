
import supertest from 'supertest';

import { api } from '../api';
import { generateAuthToken } from './auth';

const request = supertest(api);

describe('GET /task', () => {
    test('returns all tasks the user can see', async () => {
        const resp = await request
            .get('/v1/task')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.tasks.length).toEqual(6);
    });

    test('includes tasks of project 0', async () => {
        const resp = await request
            .get('/v1/task')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.tasks).toContainEqual({
            id: '00000000-0000-4000-8000-000000000000',
            project: '00000000-0000-4000-8000-000000000000',
            name: 'Task0',
            text: 'Task0 Text',
            icon: '0',
            status: 'open',
            priority: 'medium',
            created: Date.parse('2020-10-05'),
            edited: Date.parse('2020-10-10'),
            assigned: [ ],
            dependencies: [ ],
            requirements: [
                { role: '00000000-0000-4000-8000-000000000000', time: 30 },
            ],
        });
    });

    test('includes tasks of project 1', async () => {
        const resp = await request
            .get('/v1/task')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.tasks).toContainEqual({
            id: '00000000-0000-4000-8000-000000000001',
            project: '00000000-0000-4000-8000-000000000001',
            name: 'Task1',
            text: 'Task1 Text',
            icon: '1',
            status: 'closed',
            priority: 'high',
            created: Date.parse('2020-10-10'),
            edited: Date.parse('2020-10-15'),
            assigned: [ ],
            dependencies: [ ],
            requirements: [
                { role: '00000000-0000-4000-8000-000000000001', time: 30 },
            ],
        });
    });

    test('includes tasks of project 2', async () => {
        const resp = await request
            .get('/v1/task')
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

describe('GET /task/open', () => {
    test('returns all open tasks the user can see', async () => {
        const resp = await request
            .get('/v1/task/open')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.tasks.length).toEqual(3);
    });

    test('includes tasks of project 0', async () => {
        const resp = await request
            .get('/v1/task/open')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.tasks).toContainEqual({
            id: '00000000-0000-4000-8000-000000000000',
            project: '00000000-0000-4000-8000-000000000000',
            name: 'Task0',
            text: 'Task0 Text',
            icon: '0',
            status: 'open',
            priority: 'medium',
            created: Date.parse('2020-10-05'),
            edited: Date.parse('2020-10-10'),
            assigned: [ ],
            dependencies: [ ],
            requirements: [
                { role: '00000000-0000-4000-8000-000000000000', time: 30 },
            ],
        });
    });

    test('includes tasks of project 2', async () => {
        const resp = await request
            .get('/v1/task/open')
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
});

describe('GET /task/closed', () => {
    test('returns all closed tasks the user can see', async () => {
        const resp = await request
            .get('/v1/task/closed')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.tasks.length).toEqual(2);
    });

    test('includes tasks of project 1', async () => {
        const resp = await request
            .get('/v1/task/closed')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.tasks).toContainEqual({
            id: '00000000-0000-4000-8000-000000000001',
            project: '00000000-0000-4000-8000-000000000001',
            name: 'Task1',
            text: 'Task1 Text',
            icon: '1',
            status: 'closed',
            priority: 'high',
            created: Date.parse('2020-10-10'),
            edited: Date.parse('2020-10-15'),
            assigned: [ ],
            dependencies: [ ],
            requirements: [
                { role: '00000000-0000-4000-8000-000000000001', time: 30 },
            ],
        });
    });

    test('includes tasks of project 2', async () => {
        const resp = await request
            .get('/v1/task/closed')
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
});

describe('GET /task/suspended', () => {
    test('returns all suspended tasks the user can see', async () => {
        const resp = await request
            .get('/v1/task/suspended')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.tasks.length).toEqual(1);
    });

    test('includes tasks of project 2', async () => {
        const resp = await request
            .get('/v1/task/suspended')
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

describe('GET /task/possible', () => {
    test('returns all open tasks without dependencies the user can see', async () => {
        const resp = await request
            .get('/v1/task/possible')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.tasks.length).toEqual(2);
    });

    test('includes tasks of project 0', async () => {
        const resp = await request
            .get('/v1/task/possible')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.tasks).toContainEqual({
            id: '00000000-0000-4000-8000-000000000000',
            project: '00000000-0000-4000-8000-000000000000',
            name: 'Task0',
            text: 'Task0 Text',
            icon: '0',
            status: 'open',
            priority: 'medium',
            created: Date.parse('2020-10-05'),
            edited: Date.parse('2020-10-10'),
            assigned: [ ],
            dependencies: [ ],
            requirements: [
                { role: '00000000-0000-4000-8000-000000000000', time: 30 },
            ],
        });
    });

    test('includes tasks of project 2', async () => {
        const resp = await request
            .get('/v1/task/possible')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
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
});

describe('GET /task/:uuid', () => {
    test('returns the information for a task', async () => {
        const resp = await request
            .get('/v1/task/00000000-0000-4000-8000-000000000000')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.task).toEqual({
            id: '00000000-0000-4000-8000-000000000000',
            project: '00000000-0000-4000-8000-000000000000',
            name: 'Task0',
            text: 'Task0 Text',
            icon: '0',
            status: 'open',
            priority: 'medium',
            created: Date.parse('2020-10-05'),
            edited: Date.parse('2020-10-10'),
            assigned: [ ],
            dependencies: [ ],
            requirements: [
                { role: '00000000-0000-4000-8000-000000000000', time: 30 },
            ],
        });
    });
});

describe('GET /task/:uuid/comments', () => {
    test('returns all the comments for a task', async () => {
        const resp = await request
            .get('/v1/task/00000000-0000-4000-8000-000000000005/comments')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.comments.length).toEqual(3);
    });

    test('contains the information for the comments', async () => {
        const resp = await request
            .get('/v1/task/00000000-0000-4000-8000-000000000005/comments')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.comments).toContainEqual({
            id: '00000000-0000-4000-8000-000000000000',
            task: '00000000-0000-4000-8000-000000000005',
            user: '00000000-0000-4000-8000-000000000000',
            text: 'Comment0',
            created: Date.parse('2020-10-10T00:00:00'),
            edited: Date.parse('2020-10-10T01:00:00'),
        });
        expect(resp.body.comments).toContainEqual({
            id: '00000000-0000-4000-8000-000000000001',
            task: '00000000-0000-4000-8000-000000000005',
            user: '00000000-0000-4000-8000-000000000001',
            text: 'Comment1',
            created: Date.parse('2020-10-10T03:00:00'),
            edited: Date.parse('2020-10-10T04:00:00'),
        });
        expect(resp.body.comments).toContainEqual({
            id: '00000000-0000-4000-8000-000000000002',
            task: '00000000-0000-4000-8000-000000000005',
            user: '00000000-0000-4000-8000-000000000001',
            text: 'Comment2',
            created: Date.parse('2020-10-10T05:00:00'),
            edited: Date.parse('2020-10-10T05:00:00'),
        });
    });
});

describe('GET /task/:uuid/work', () => {
    test('returns all the work items done for the tasks', async () => {
        const resp = await request
            .get('/v1/task/00000000-0000-4000-8000-000000000005/work')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.work.length).toEqual(3);
    });

    test('containt all finished work information', async () => {
        const resp = await request
            .get('/v1/task/00000000-0000-4000-8000-000000000005/work')
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
            .get('/v1/task/00000000-0000-4000-8000-000000000005/work')
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
            .get(`/v1/task/00000000-0000-4000-8000-000000000005/work?since=${Date.parse('2020-10-10T20:00:00')}`)
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.work.length).toEqual(1);
    });

    test('can be limited in time with to date', async () => {
        const resp = await request
            .get(`/v1/task/00000000-0000-4000-8000-000000000005/work?to=${Date.parse('2020-10-10T20:00:00')}`)
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.work.length).toEqual(2);
    });
});

describe('GET /task/:uuid/assigned', () => {
    test('returns all users that are assigned to the tasks', async () => {
        const resp = await request
            .get('/v1/task/00000000-0000-4000-8000-000000000005/assigned')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.assigned.length).toEqual(1);
    });

    test('contains the user information', async () => {
        const resp = await request
            .get('/v1/task/00000000-0000-4000-8000-000000000005/assigned')
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

