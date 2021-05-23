
import { api } from '../api';
import { migrated } from '../database';
import supertest from 'supertest';

const request = supertest(api);

beforeAll(async () => {
    await migrated;
});

test('non existant username returns 404 for /v1/user/name/', async () => {
    const response = await request.get('/v1/user/name/__NO_REAL_NAME__');
    expect(response.status).toEqual(404);
    expect(response.body.status).toEqual('error');
    expect(response.body.message).toEqual('user not found');
});

