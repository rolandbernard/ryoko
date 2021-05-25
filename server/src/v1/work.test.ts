
import supertest from 'supertest';

import { api } from '../api';
import { generateAuthToken } from './auth';

const request = supertest(api);

describe('GET /work', () => {
    test('returns information for the unfinished work', async () => {
        const resp = await request
            .get('/v1/work')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.work).toEqual({
            id: '00000000-0000-4000-8000-000000000002',
            task: '00000000-0000-4000-8000-000000000005',
            user: '00000000-0000-4000-8000-000000000000',
            started: Date.parse('2020-10-11T12:00:00'),
            finished: null,
        });
    });

    test('returns 404 if no work is unfinished', async () => {
        const resp = await request
            .get('/v1/work')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000001')}`);
        expect(resp.status).toEqual(404);
        expect(resp.body.status).toEqual('error');
    });
});

