
import React from 'react';
import logo from './logo.svg';
import './App.scss';

function App() {
    return (
        <div className="app">
            <header className="app-header">
                <img src={logo} className="app-logo" alt="logo" />
                <p>
                    Hello world!
                </p>
            </header>
        </div>
    );
}

export default App;

