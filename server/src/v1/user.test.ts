
import supertest from 'supertest';

import { api } from '../api';

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

describe('/:uuid/image', () => {
    test('returns 404 without body if no image is set', async () => {
        const response = await request.get('/v1/user/00000000-0000-4000-8000-000000000000/image');
        expect(response.status).toEqual(404);
        expect(response.body).toEqual({});
    })

    test('returns 404 if the user does not exist', async () => {
        const response = await request.get('/v1/user/00000000-0000-4000-8000-000000000002/image');
        expect(response.status).toEqual(404);
        expect(response.body.status).toEqual('error');
    })
})


