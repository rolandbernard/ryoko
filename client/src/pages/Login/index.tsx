
import { useCallback, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { login } from 'adapters/auth';

import Page from 'components/layout/Page';
import Callout from 'components/ui/Callout';
import LoginForm from 'components/forms/LoginForm';

import './login.scss';

export default function Login() {
    const [error, setError] = useState<string>('');
    const history = useHistory();

    const handleSubmit = useCallback(async (username: string, password: string) => {
        try {
            if (await login(username, password)) {
                history.push('/tasks');
                setError('');
            } else {
                setError('The username or password are wrong.');
            }
        } catch(e) {}
    }, [history]);

    return (
        <div className="login-page-container">
            <Page className="login-page">
                <div className="content-container">
                    <h1 className="underlined">Login</h1>
                    {error && <Callout message={error} />}
                    <LoginForm onSubmit={handleSubmit} />
                    <Link to="/register" className="link">You don't have an account?</Link>
                </div>
            </Page>
        </div>
    );
}

