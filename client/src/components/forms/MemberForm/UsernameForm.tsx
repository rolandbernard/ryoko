import TextInput from 'components/ui/TextInput';
import Button from 'components/ui/Button';
import { FormEvent, useCallback, useState } from 'react';
import { getUserByName } from 'adapters/user';
import Callout from 'components/ui/Callout';

interface Props {
    setResult: Function;
}

export default function UsernameForm({ setResult }: Props) {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const onSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        getUserByName(username)
            .then((user) => setResult(user.id))
            .catch(() => setError('The user ' + username + ' was not found!'));
    }, [setResult, username])

    return (
        <form className="username-form" onSubmit={onSubmit}>
            <h2>Add a member to your team</h2>
            {error && <Callout message={error} />}
            <TextInput
                label="Username"
                name="name"
                onChange={setUsername}
            />
            <Button type="submit">
                Add user
            </Button>

        </form >
    )
}