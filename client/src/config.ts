export let apiRoot: string;

// Automatically select the correct api location depending on the environment.
if (process.env.NODE_ENV === 'production') {
    apiRoot = `${window.location.origin}/api/v1`;
} else {
    apiRoot = `http://${window.location.hostname}:8000/api/v1`;
}

