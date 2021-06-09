
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

serviceWorkerRegistration.register({ onUpdate: registration => {
    registration.waiting?.postMessage({type: 'SKIP_WAITING'});
}});

