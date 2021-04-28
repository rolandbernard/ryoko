
import { useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';

import Page from 'components/ui/Page';
import RegisterForm from 'components/forms/RegisterForm';
import { register } from 'adapters/auth';

import './register.scss';

export default function Register() {
    const history = useHistory();

    const handleSubmit = useCallback(async (username: string, password: string) => {
        try {
            if (await register(username, password)) {
                history.push('/tasks');
            }
        } catch (e) { }
    }, [history]);

    return (
        <div className="register-page-container">
            <Page className="register-page">
                <div className="content-container">
                    <h1 className="underlined">Register</h1>
                    <RegisterForm onSubmit={handleSubmit} />
                    <Link className="link" to="/login">You already have an account?</Link>
                </div>
            </Page>
            <div className="background-container">
                <div className="bubble primary" style={{ top: '-10%', right: '-20%' }}></div>
                <div className="bubble accent" style={{ bottom: '-20%', left: '-20%' }}></div>
            </div>
        </div>
    );
}

