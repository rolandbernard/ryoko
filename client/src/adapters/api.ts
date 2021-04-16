import axios from 'axios';

const baseUrl = 'http://localhost:8000/v1';

export const authAxios = axios.create({
    baseURL: baseUrl,
    headers: {
        Authorization: `Bearer ${getAccessToken}`
    }
});

export function isLoggedIn() {
    return getAccessToken();
}

export function getAccessToken(): string | null {
    return localStorage.getItem('access-token');
}

export function setAccesstoken(token: string): void {
    localStorage.setItem('access-token', token);
}

export function registerUser(username: string, password: string): boolean {
    axios.post(`${baseUrl}/auth/register`, {
        username: username,
        password: password
    }).then(() => {
        axios.post(`${baseUrl}/auth/token`, {
            username: username,
            password: password
        }).then(({ data }) => {
            setAccesstoken(data.token);
            return true;
        }).catch(() => {
        });
    }).catch(() => {
    });
    return false;
}
