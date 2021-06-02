
import { useCallback, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { register } from 'adapters/auth';

import Page from 'components/layout/Page';
import Callout from 'components/ui/Callout';
import RegisterForm from 'components/forms/RegisterForm';

import './register.scss';

export default function Register() {
    const [error, setError] = useState('');
    const history = useHistory();

    const handleSubmit = useCallback(async (username: string, password: string, realname?: string, email?: string) => {
        setError('');
        try {
            if (await register(username, password, realname ?? null, email ?? null)) {
                history.push('/tasks');
            } else {
                setError('There was an error with your registration. Please try again!');
            }
        } catch (e) {
            setError('Failed to register. Try again later.');
        }
    }, [history]);

    return (
        <div className="register-page-container">
            <Page className="register-page">
                <div className="content-container">
                    <h1 className="underlined">Register</h1>
                    {error && <Callout message={error} />}
                    <RegisterForm onSubmit={handleSubmit} setError={setError} />
                    <Link className="link" to="/login">You already have an account?</Link>
                </div>
            </Page>
        </div>
    );
}

