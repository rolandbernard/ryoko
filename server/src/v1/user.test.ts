
import supertest from 'supertest';

import { api } from '../api';

const request = supertest(api);

test('non existant username returns 404 for /v1/user/name/', async () => {
    const response = await request.get('/v1/user/name/User3');
    expect(response.status).toEqual(404);
    expect(response.body.status).toEqual('error');
});

