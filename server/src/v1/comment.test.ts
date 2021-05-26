
import supertest from 'supertest';

import { api } from '../api';
import { generateAuthToken } from './auth';

const request = supertest(api);

describe('GET /comment/:uuid', () => {
    test('returns information for the requested comments', async () => {
        const resp = await request
            .get('/v1/comment/00000000-0000-4000-8000-000000000000')
            .set('Authorization', `Bearer ${await generateAuthToken('00000000-0000-4000-8000-000000000000')}`);
        expect(resp.status).toEqual(200);
        expect(resp.body.status).toEqual('success');
        expect(resp.body.comment).toEqual({
            id: '00000000-0000-4000-8000-000000000000',
            task: '00000000-0000-4000-8000-000000000005',
            user: '00000000-0000-4000-8000-000000000000',
            text: 'Comment0',
            created: Date.parse('2020-10-10T00:00:00'),
            edited: Date.parse('2020-10-10T01:00:00'),
        });
    });
});

