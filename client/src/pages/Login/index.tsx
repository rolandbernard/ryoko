import Page from 'components/ui/Page';
import { Link, useHistory } from 'react-router-dom';
import LoginForm from 'components/forms/LoginForm';
import './login.scss';
import { useCallback } from 'react';
import { login } from 'adapters/auth';

export default function Login() {
    const history = useHistory();
    const handleSubmit = useCallback(async (username: string, password: string) => {
        try {
            if (await login(username, password)) {
                history.push('/tasks');
            }
        } catch (e) { }
    }, [history]);

    return (
        <div className="login-page-container">
            <Page className="login-page">
                <div className="content-container">
                    <h1 className="underlined">Login</h1>
                    <LoginForm onSubmit={handleSubmit} />
                    <Link to="/register" className="link">You don't have an account?</Link>
                </div>
            </Page>
            <div className="background-container">
                <div className="bubble primary" style={{ top: '0', right: '0' }}></div>
                <div className="bubble accent" style={{ bottom: '-20%', left: '-20%' }}></div>
            </div>
        </div>
    );
}

