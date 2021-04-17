import Page from 'components/ui/Page';
import TextInput from 'components/ui/TextInput';
import Button from 'components/ui/Button';
import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { registerUser } from 'adapters/api';
import './register.scss';

function usernameIsValid(username: string) {
    return (username && username.length > 3) ? null : 'Username has to be at least 4 characters long.';
}

function passwordIsValid(password: string) {
    return (password && password.length > 5) ? null : 'Password has to be at least 6 characters long';
}

export default function Register() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const history = useHistory();


    const register = async (e: FormEvent) => {
        e.preventDefault();

        if (usernameIsValid(username) && passwordIsValid(password)) {
            await registerUser(username, password).then((data) => {
                history.push('/tasks');
            }).catch(() => {
            });

        }
    }

    return (
        <Page header={false}>
            <div className="content-container">
                <h1>Register</h1>
                <form onSubmit={register}>
                    <TextInput
                        label="Username"
                        name="username"
                        color="dark"
                        onChange={setUsername}
                        validateFn={usernameIsValid}
                    />
                    <TextInput
                        label="Password"
                        name="password"
                        color="dark"
                        type="password"
                        onChange={setPassword}
                        validateFn={passwordIsValid}
                    />
                    <Button type="submit">
                        Register now
                    </Button>
                </form>
                <Link to="/login">You already have an account?</Link>
            </div>
        </Page>
    );
}