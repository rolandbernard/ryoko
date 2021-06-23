
import React from 'react';
import ReactDOM from 'react-dom';

import App from 'App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import 'index.scss';

serviceWorkerRegistration.register();

const root = document.getElementsByTagName('html')[0];

/**
 * Get the theme the web application is currently displayed in.
 * 
 * @returns The current theme
 */
export function getTheme() {
    return root.classList.contains('dark-theme') ? 'dark' : 'light';
}

/**
 * Toggle the theme the application is currently displayed in.
 */
export function toggleTheme() {
    const current = getComputedStyle(root, '::before').getPropertyValue('content');
    if (current === '"dark"') {
        root.classList.remove('dark-theme');
        root.classList.add('light-theme');
        localStorage.setItem('selected-theme', 'light');
    } else {
        root.classList.remove('light-theme');
        root.classList.add('dark-theme');
        localStorage.setItem('selected-theme', 'dark');
    }
}

// Restore the theme that was set last time
const lastTheme = localStorage.getItem('selected-theme');
if (lastTheme === 'dark') {
    root.classList.add('dark-theme');
} else if (lastTheme === 'light') {
    root.classList.add('light-theme');
}

/**
 * Render the application by creating the react virtual dom.
 */
function render() {
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('root')
    );
}

/**
 * Completely reload the application, by destroying the current react virtual dom
 * and render a new one.
 */
export function reload() {
    const root = document.getElementById('root');
    if (root) {
        ReactDOM.unmountComponentAtNode(root);
        render();
    }
}

render();

