
import supertest, { Response } from 'supertest';

import { api } from '../api';
import { generateAuthToken } from './auth';

const request = supertest(api);

describe('GET /user/name', () => {
    test('non existent username returns', async () => {
        const response = await request.get('/v1/user/name/User3');
        expect(response.status).toEqual(404);
        expect(response.body.status).toEqual('error');
    });

    test('existing username returns id', async () => {
        const response = await request.get('/v1/user/name/User0');
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.user.id).toEqual('00000000-0000-4000-8000-000000000000');
    });

    test('existing username returns name', async () => {
        const response = await request.get('/v1/user/name/User0');
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.user.username).toEqual('user0');
    });
});

describe('GET /user/:uuid/image', () => {
    test('returns 404 without body if no image is set', async () => {
        const response = await request.get('/v1/user/00000000-0000-4000-8000-000000000000/image');
        expect(response.status).toEqual(404);
        expect(response.body).toEqual({});
    });

    test('returns 404 if the user does not exist', async () => {
        const response = await request.get('/v1/user/00000000-0000-4000-8000-000000000002/image');
        expect(response.status).toEqual(404);
        expect(response.body.status).toEqual('error');
    });

    test('returns the image if the user has an image', async () => {
        const response = await request.get('/v1/user/00000000-0000-4000-8000-000000000001/image');
        expect(response.status).toEqual(200);
        expect(response.body).toBeTruthy();
    });
});

describe('GET /user', () => {
    test('returns the user that is authorized', async () => {
        const response = await request
            .get('/v1/user')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.user.id).toEqual('00000000-0000-4000-8000-000000000000');
        expect(response.body.user.username).toEqual('user0');
        expect(response.body.user.email).toEqual('test0@example.com');
        expect(response.body.user.realname).toEqual('Testing Tester');
    });
});

describe('GET /user/tasks', () => {
    test('returns the tasks the user is assigned to', async () => {
        const response = await request
            .get('/v1/user/tasks')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.tasks.length).toEqual(1);
        expect(response.body.tasks[0].id).toEqual('00000000-0000-4000-8000-000000000005');
    });
});

describe('GET /user/work', () => {
    test('returns all the users work items', async () => {
        const response = await request
            .get('/v1/user/work')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.work.length).toEqual(3);
    });

    test('returns all finished work items', async () => {
        const response = await request
            .get('/v1/user/work')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.work).toContainEqual({
            id: '00000000-0000-4000-8000-000000000000',
            task: '00000000-0000-4000-8000-000000000005',
            user: '00000000-0000-4000-8000-000000000000',
            started: Date.parse('2020-10-10T12:00:00'),
            finished: Date.parse('2020-10-10T13:00:00'),
        });
        expect(response.body.work).toContainEqual({
            id: '00000000-0000-4000-8000-000000000001',
            task: '00000000-0000-4000-8000-000000000005',
            user: '00000000-0000-4000-8000-000000000000',
            started: Date.parse('2020-10-10T13:00:00'),
            finished: Date.parse('2020-10-10T14:00:00'),
        });
    });

    test('returns unfinished work items', async () => {
        const response = await request
            .get('/v1/user/work')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.work).toContainEqual({
            id: '00000000-0000-4000-8000-000000000002',
            task: '00000000-0000-4000-8000-000000000005',
            user: '00000000-0000-4000-8000-000000000000',
            started: Date.parse('2020-10-11T12:00:00'),
            finished: null,
        });
    });

    test('can be limited in time with from date', async () => {
        const response = await request
            .get(`/v1/user/work?since=${Date.parse('2020-10-10T20:00:00')}`)
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.work.length).toEqual(1);
    });

    test('can be limited in time with to date', async () => {
        const response = await request
            .get(`/v1/user/work?to=${Date.parse('2020-10-10T20:00:00')}`)
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.work.length).toEqual(2);
    });
});

describe('GET /user/activity', () => {
    test('returns time worked for all days', async () => {
        const response = await request
            .get('/v1/user/activity')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.activity.length).toEqual(1);
    });

    test('returns the total amount of work for each day', async () => {
        const response = await request
            .get('/v1/user/activity')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.activity[0].day).toEqual('2020-10-10');
        expect(response.body.activity[0].time).toEqual(120 * 60 * 1000);
    });

    test('can be limited in time with from date', async () => {
        const response = await request
            .get(`/v1/user/activity?since=${Date.parse('2020-10-10T20:00:00')}`)
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.activity.length).toEqual(0);
    });
});

describe('GET /user/completion', () => {
    test('returns completion for assigned tasks', async () => {
        const response = await request
            .get('/v1/user/completion')
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

    test('can be limited in time with from date', async () => {
        const response = await request
            .get(`/v1/user/completion?since=${Date.parse('2020-10-30T20:00:00')}`)
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

describe('PUT /user', () => {
    let response: Response;

    beforeAll(async () => {
        response = await request
            .put('/v1/user')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`)
            .send({
                realname: 'Testing',
                email: 'test2@example.com',
            });
    });

    test('successfully returns', async () => {
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
    });

    test('the current user now contains the new information', async () => {
        const response = await request
            .get('/v1/user')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.user.email).toEqual('test2@example.com');
        expect(response.body.user.realname).toEqual('Testing');
    });

    test('the current user still contains the same username and id', async () => {
        const response = await request
            .get('/v1/user')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.user.id).toEqual('00000000-0000-4000-8000-000000000000');
        expect(response.body.user.username).toEqual('user0');
    });

    afterAll(async () => {
        await request
            .put('/v1/user')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`)
            .send({
                realname: 'Testing Tester',
                email: 'test0@example.com',
            });
    })
});

describe('GET /user/:uuid', () => {
    test('returns the user that is requested', async () => {
        const response = await request
            .get('/v1/user/00000000-0000-4000-8000-000000000001')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.user.id).toEqual('00000000-0000-4000-8000-000000000001');
        expect(response.body.user.username).toEqual('user1');
        expect(response.body.user.email).toEqual('test1@example.com');
        expect(response.body.user.realname).toEqual('Tester Testing');
    });
});

