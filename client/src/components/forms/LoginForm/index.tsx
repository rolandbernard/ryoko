import { FormEvent, useCallback, useState } from "react";
import TextInput from 'components/ui/TextInput';
import Button from 'components/ui/Button';
import './login-form.scss';

interface Props {
    onSubmit?: (username: string, password: string) => void
}

export default function RegisterForm({ onSubmit }: Props) {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        onSubmit?.(username, password);
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
            <Button type="submit">
                Login
            </Button>
        </form>
    );
}

