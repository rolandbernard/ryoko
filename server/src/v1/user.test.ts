
import supertest from 'supertest';

import { api } from '../api';
import { generateAuthToken } from './auth';

const request = supertest(api);

describe('/user/name', () => {
    test('non existant username returns', async () => {
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
})

describe('/user/:uuid/image', () => {
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
})

describe('/user', () => {
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

describe('/user/tasks', () => {
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

describe('/user/work', () => {
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
            started: (new Date('2020-10-10T00:00:00')).toString(),
            finished: (new Date('2020-10-10T01:00:00')).toString(),
        });
        expect(response.body.work).toContainEqual({
            id: '00000000-0000-4000-8000-000000000001',
            task: '00000000-0000-4000-8000-000000000005',
            user: '00000000-0000-4000-8000-000000000000',
            started: (new Date('2020-10-10T03:00:00')).toString(),
            finished: (new Date('2020-10-10T04:00:00')).toString(),
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
            started: (new Date('2020-10-11T05:00:00')).toString(),
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
});

describe('/user/activity', () => {
    test('returns time worked for all days', async () => {
        const response = await request
            .get('/v1/user/activity')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.activity.length).toEqual(1);
    });

    test('returns time worked for all days', async () => {
        const response = await request
            .get(`/v1/user/activity?to=${Date.parse("2020-10-20")}`)
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.activity.length).toEqual(1);
    });
});

