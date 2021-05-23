
import { ready, close } from './database';

beforeAll(async () => {
    await ready;
});

afterAll(async () => {
    await close();
});

