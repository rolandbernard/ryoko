
import React from 'react';
import ReactDOM from 'react-dom';

import App from 'App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import 'index.scss';

serviceWorkerRegistration.register();

export function getTheme() {
    const root = document.getElementsByTagName('html')[0];
    return root.classList.contains('dark-theme') ? 'dark' : 'light';
}

export function toggleTheme() {
    const root = document.getElementsByTagName('html')[0];
    if (root.classList.contains('dark-theme')) {
        root.classList.remove('dark-theme');
        localStorage.setItem('selected-theme', 'light');
    } else {
        root.classList.add('dark-theme');
        localStorage.setItem('selected-theme', 'dark');
    }
}

if (localStorage.getItem('selected-theme') === 'dark') {
    const root = document.getElementsByTagName('html')[0];
    root.classList.add('dark-theme');
}

function render() {
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('root')
    );
}

export function reload() {
    const root = document.getElementById('root');
    if (root) {
        ReactDOM.unmountComponentAtNode(root);
        render();
    }
}

render();

