
import { FormEvent, useCallback, useState } from 'react';

import { exists } from 'adapters/user';

import Button from 'components/ui/Button';
import TextInput from 'components/ui/TextInput';
import LoadingScreen from 'components/ui/LoadingScreen';

import './register-form.scss';

async function validateUsername(username: string) {
    if (username?.length < 3) {
        return 'Username has to be at least 4 characters long.';
    } else if (await exists(username)) {
        return 'Username is already taken by someone else.';
    } else {
        return null;
    }
}

function validatePassword(password: string) {
    if (password?.length < 6) {
        return 'Password has to be at least 6 characters long';
    } else {
        return null;
    }
}

function validateRepeatPassword(password: string, password2: string) {
    if (password !== password2) {
        return 'The passwords are not the same.';
    } else {
        return null;
    }
}

interface Props {
    onSubmit?: (username: string, password: string, realname?: string, email?: string) => Promise<void>;
    setError?: Function;
}

export default function RegisterForm({ onSubmit, setError }: Props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [realName, setRealName] = useState<string | undefined>();
    const [email, setEmail] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (
            await validateUsername(username) === null
            && validatePassword(password) === null
            && validateRepeatPassword(repeatedPassword, password) === null
        ) {
            setLoading(true);
            await onSubmit?.(username, password, realName, email);
            setLoading(false);
        } else if(setError) {
            setError('Please fill in the mandatory fields.');
        }
    }, [onSubmit, password, username, repeatedPassword, setError, realName, email]);

    return (
        <form className="register-form" onSubmit={handleSubmit}>
            <TextInput
                label="Username"
                name="username"
                onChange={setUsername}
                validation={validateUsername}
            />
            <TextInput
                label="First- and Lastname"
                name="realname"
                onChange={setRealName}
            />
            <TextInput
                label="Email"
                name="email"
                onChange={setEmail}
            />
            <TextInput
                label="Password"
                name="password"
                type="password"
                onChange={setPassword}
                validation={validatePassword}
            />
            <TextInput
                label="Repeat password"
                name="repeat-password"
                type="password"
                onChange={setRepeatedPassword}
                compareValue={password}
                validation={validateRepeatPassword}
            />
            { loading
                ? <LoadingScreen />
                : <Button type="submit">Register now</Button>
            }
        </form>
    );
}

