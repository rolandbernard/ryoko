
import { apiRoot } from 'config';

/**
 * Get headers to use for the API authorization.
 * 
 * @returns The headers for the API
 */
export function getAuthHeader(): HeadersInit {
    if (isLoggedIn()) {
        return {
            'Authorization': `Bearer ${getToken()}`,
        };
    } else {
        return {};
    }
}

/**
 * Test if the current user is logged in.
 * 
 * @returns true if the user is logged in, false otherwise
 */
export function isLoggedIn(): boolean {
    return typeof getToken() === 'string';
}

/**
 * Get the auth token for the current user.
 * 
 * @returns The auth token
 */
export function getToken(): string | null {
    return localStorage.getItem('access-token');
}

/**
 * Set the auth token to user for API requests.
 * 
 * @param token The token to set
 */
export function setToken(token: string) {
    localStorage.setItem('access-token', token);
}

/**
 * Clear the saved token, effectively logging out the user.
 */
export function clearToken() {
    localStorage.removeItem('access-token');
    sessionStorage.clear()
}

/**
 * Get the ID of the logged in user.
 * 
 * @returns The id of the user
 */
export function getLoggedInUser() {
    const token = getToken();
    if (token) {
        const data = token.split('.')[1];
        return JSON.parse(atob(data)).id;
    }
}

extendAccessToken();
setInterval(extendAccessToken, 1000 * 60 * 5);

/**
 * Try to extend the saved token. If extension fails, clear the token.
 */
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

/**
 * Try to register a new user.
 * 
 * @param username The username for the new user
 * @param password The password for the new user
 * @param realname The real name for the new user
 * @param email The email for the new user
 * @returns A promise resolving to the true if registration was successful
 */
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

/**
 * Try to log in the user.
 * 
 * @param username The username to log in with
 * @param password The password to log in with
 * @returns A promise resolving to the true if login was successful
 */
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

