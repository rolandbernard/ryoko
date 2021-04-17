
import { apiRoot } from 'config';

export async function exists(username: string) {
    try {
        const response = await fetch(`${apiRoot}/user/name/${username}`);
        return response.ok;
    } catch (e) {
        // Probably a network error
        return false;
    }
}

