import Page from 'components/ui/Page';
import TextInput from 'components/ui/TextInput';
import Button from 'components/ui/Button';
import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { registerUser } from 'adapters/api';
import './register.scss';

function usernameIsValid(username: string) {
    return (username && username.length > 3);
}

function passwordIsValid(password: string) {
    return (password && password.length > 5);
}

export default function Register() {
    const [username, setUsername] = useState<string>('');
    const [usernameError, setUsernameError] = useState<string>('');

    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    
    const history = useHistory();


    const register = async (e: FormEvent) => {
        e.preventDefault();

        if (usernameIsValid(username) && passwordIsValid(password)) {
            setPasswordError('');
            setUsernameError('');

            
            await registerUser(username, password).then((data) => {
                console.log(data);
                
                history.push('/tasks');
            }).catch(() => {
                setUsernameError('This username is already used.');
            });

        } else {
            if (!usernameIsValid(username))
                setUsernameError('Your username has to be at least 4 characters long');
            else
                setUsernameError('');

            if (!passwordIsValid(password))
                setPasswordError('Your password has to be at least 6 characters long');
            else
                setPasswordError('');
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
                        valueSetter={setUsername}
                        error={usernameError}
                    />
                    <TextInput
                        label="Password"
                        name="password"
                        color="dark"
                        type="password"
                        valueSetter={setPassword}
                        error={passwordError}
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