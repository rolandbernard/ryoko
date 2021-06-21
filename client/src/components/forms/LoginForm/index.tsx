
import { FormEvent, useCallback, useState } from "react";

import Button from 'components/ui/Button';
import TextInput from 'components/ui/TextInput';
import LoadingScreen from 'components/ui/LoadingScreen';

import './login-form.scss';
import '../form.scss';

interface Props {
    onSubmit?: (username: string, password: string) => Promise<void>
}

export default function RegisterForm({ onSubmit }: Props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit?.(username, password);
        setLoading(false);
    }, [onSubmit, password, username]);

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <TextInput
                label="Username"
                name="username"
                onChange={setUsername}
            />
            <TextInput
                label="Password"
                name="password"
                type="password"
                onChange={setPassword}
            />
            { loading
                ? <LoadingScreen />
                : <Button type="submit">Login</Button>
            }
        </form>
    );
}

