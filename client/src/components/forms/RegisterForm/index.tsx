
import { FormEvent, useCallback, useState } from 'react';

import TextInput from 'components/ui/TextInput';
import Button from 'components/ui/Button';
import { exists } from 'adapters/user';

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
    onSubmit?: (username: string, password: string) => void
}

export default function RegisterForm({ onSubmit }: Props) {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [repeatedPassword, setRepeatedPassword] = useState<string>('');

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (await validateUsername(username) === null && validatePassword(password) === null && validateRepeatPassword(repeatedPassword, password) === null) {
            onSubmit?.(username, password);
        }
    }, [onSubmit, password, username, repeatedPassword]);

    return (
        <form className="register-form" onSubmit={handleSubmit}>
            <TextInput
                label="Username"
                name="username"
                onChange={setUsername}
                validation={validateUsername}
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
            <Button type="submit">
                Register now
            </Button>
        </form>
    );
}

