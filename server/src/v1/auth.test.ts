
import supertest, { Response } from 'supertest';

import { database } from '../database';
import { api } from '../api';
import { generateAuthToken } from './auth';

const request = supertest(api);

describe('requesting a token', () => {
    test('fails if username does not exist', async () => {
        const response = await request
            .post('/v1/auth/token')
            .send({
                username: 'User2',
                password: 'testtest',
            });
        expect(response.status).toEqual(404);
        expect(response.body.status).toEqual('error');
    });

    test('fails if the password is wrong', async () => {
        const response = await request
            .post('/v1/auth/token')
            .send({
                username: 'User0',
                password: 'test',
            });
        expect(response.status).toEqual(403);
        expect(response.body.status).toEqual('error');
    });

    test('succeeds if username and password are correct', async () => {
        const response = await request
            .post('/v1/auth/token')
            .send({
                username: 'User0',
                password: 'testtest',
            });
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.token).toBeTruthy();
    });
});

test('registering a user with an existing username fails', async () => {
    const response = await request
        .post('/v1/auth/register')
        .send({
            username: 'User0',
            password: 'testtest',
        });
    expect(response.status).toEqual(400);
    expect(response.body.status).toEqual('error');
});

describe('successful user registration', () => {
    let response: Response;

    beforeAll(async () => {
        response = await request
            .post('/v1/auth/register')
            .send({
                username: 'User2',
                password: 'testing',
                email: 'test@example.com',
                realname: 'Real Test',
            });
    });

    test('returns a valid token', async () => {
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.token).toBeTruthy();
    });

    test('creates a new user', async () => {
        const user = await database('users')
            .select()
            .where({ 'users.user_name': 'user2' });
        expect(user.length).toEqual(1);
        expect(user[0].user_name).toEqual('user2');
        expect(user[0].email).toEqual('test@example.com');
        expect(user[0].real_name).toEqual('Real Test');
    });

    test('auth token can be requested', async () => {
        const response = await request
            .post('/v1/auth/token')
            .send({
                username: 'User2',
                password: 'testing',
            });
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.token).toBeTruthy();
    });

    afterAll(async () => {
        await database('users')
            .delete()
            .where({ 'users.user_name': 'user2' });
    });
})

describe('password can be changed', () => {
    let response: Response;

    beforeAll(async () => {
        response = await request
            .put('/v1/auth/password')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-0000-0000-000000000000')}`)
            .send({
                password: 'testtest2',
            });
    })
    
    test('returns successfully', async () => {
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
    });
    
    test('token request with old password fails', async () => {
        const response = await request
            .post('/v1/auth/token')
            .send({
                username: 'User0',
                password: 'testtest',
            });
        expect(response.status).toEqual(403);
        expect(response.body.status).toEqual('error');
    });
    
    test('token request with new password succeeds', async () => {
        const response = await request
            .post('/v1/auth/token')
            .send({
                username: 'User0',
                password: 'testtest2',
            });
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.token).toBeTruthy();
    });

    afterAll(async () => {
        response = await request
            .put('/v1/auth/password')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-0000-0000-000000000000')}`)
            .send({
                password: 'testtest',
            });
    })
});

test('changing username to an existing one fails', async () => {
    const response = await request
        .put('/v1/auth/username')
        .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-0000-0000-000000000000')}`)
        .send({
            username: 'User1',
        });
    expect(response.status).toEqual(400);
    expect(response.body.status).toEqual('error');
});

describe('username can be changed', () => {
    let response: Response;

    beforeAll(async () => {
        response = await request
            .put('/v1/auth/username')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-0000-0000-000000000000')}`)
            .send({
                username: 'User00',
            });
    })
    
    test('returns successfully', async () => {
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
    });
    
    test('token request with old username fails', async () => {
        const response = await request
            .post('/v1/auth/token')
            .send({
                username: 'User0',
                password: 'testtest',
            });
        expect(response.status).toEqual(404);
        expect(response.body.status).toEqual('error');
    });
    
    test('token request with new username succeeds', async () => {
        const response = await request
            .post('/v1/auth/token')
            .send({
                username: 'User00',
                password: 'testtest',
            });
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('success');
        expect(response.body.token).toBeTruthy();
    });

    afterAll(async () => {
        response = await request
            .put('/v1/auth/username')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-0000-0000-000000000000')}`)
            .send({
                username: 'User0',
            });
    })
});

test('valid tokens can be extended', async () => {
    const response = await request
        .get('/v1/auth/extend')
        .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-0000-0000-000000000000')}`);
    expect(response.status).toEqual(200);
    expect(response.body.status).toEqual('success');
});

test('invalid tokens cause an 403 error', async () => {
    const response = await request
        .get('/v1/auth/extend')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCJ9.Kq2cI42E_-c1No89CpGyqwLV3BL4fFpe5fGhDjrUr2c');
    expect(response.status).toEqual(403);
    expect(response.body.status).toEqual('error');
});

