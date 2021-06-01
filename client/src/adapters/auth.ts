
import { apiRoot } from 'config';

export function getAuthHeader(): HeadersInit {
    if (isLoggedIn()) {
        return {
            'Authorization': `Bearer ${getToken()}`,
        };
    } else {
        return {};
    }
}

export function isLoggedIn(): boolean {
    return typeof getToken() === 'string';
}

export function getToken(): string | null {
    return localStorage.getItem('access-token');
}

export function setToken(token: string) {
    localStorage.setItem('access-token', token);
}

export function clearToken() {
    localStorage.removeItem('access-token');
}

export function getLoggedInUser() {
    const token = getToken();
    if (token) {
        const data = token.split('.')[1];
        return JSON.parse(atob(data)).id;
    }
}

extendAccessToken();
setInterval(extendAccessToken, 1000 * 60 * 5);

async function extendAccessToken() {
    if (isLoggedIn()) {
        try {
            const response = await fetch(`${apiRoot}/auth/extend`, { headers: getAuthHeader() });
            if (response.ok) {
                const json = await response.json();
                setToken(json.token);
            } else {
                clearToken();
            }
        } catch(e) {
            clearToken();
        }
    }
}

export async function register(username: string, password: string, realname: string | null, email: string | null): Promise<boolean> {
    try {
        const response = await fetch(`${apiRoot}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                realname,
                email,
            }),
        });
        if (response.ok) {
            const json = await response.json();
            setToken(json.token);
        }
        return response.ok;
    } catch (e) {
        // Probably a network error
        throw e;
    }
}

export async function login(username: string, password: string): Promise<boolean> {
    try {
        const response = await fetch(`${apiRoot}/auth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
        });
        if (response.ok) {
            const json = await response.json();
            setToken(json.token);
        }
        return response.ok;
    } catch (e) {
        // Probably a network error
        throw e;
    }
}

