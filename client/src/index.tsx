
import React from 'react';
import ReactDOM from 'react-dom';

import App from 'App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import 'index.scss';

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

if (localStorage.getItem('selected-theme') === 'dark') {
    const root = document.getElementsByTagName('html')[0];
    root.classList.add('dark-theme');
}

serviceWorkerRegistration.register({ onUpdate: registration => {
    registration.waiting?.postMessage({type: 'SKIP_WAITING'});
}});

