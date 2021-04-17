
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
    }, [ history ]);

    return (
        <Page header={false}>
            <div className="content-container">
                <h1>Register</h1>
                <RegisterForm onSubmit={handleSubmit} />
                <Link to="/login">You already have an account?</Link>
            </div>
        </Page>
    );
}

