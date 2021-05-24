export let apiRoot: string;

if (process.env.NODE_ENV === 'production') {
    apiRoot = `${window.location.origin}/api/v1`;
} else {
    apiRoot = `http://localhost:8000/api/v1`;
}

