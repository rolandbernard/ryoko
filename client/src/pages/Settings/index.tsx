
import { useHistory } from 'react-router';
import { useCallback, useEffect, useState } from 'react';

import { getCurrentUser, updateUser, updateUserImage, User } from 'adapters/user';

import Callout from 'components/ui/Callout';
import UserForm from 'components/forms/UserForm';
import LoadingScreen from 'components/ui/LoadingScreen';

import './settings.scss';

export default function Settings() {
    const [user, setUser] = useState<User>();
    const [error, setError] = useState('');
    const history = useHistory();

    useEffect(() => {
        getCurrentUser().then((user) => setUser(user))
    }, []);

    const handleSubmit = useCallback(async (name?: string, email?: string, avatar?: File) => {
        try {
            if (user && updateUser({ realname: name, email })) {
                if (avatar) {
                    updateUserImage(avatar);
                }
                history.push('/tasks');
            }
        } catch (e) {
            setError('There was an issue with saving your settings. Please try again!')
        }
    }, [history, user]);

    return (
        user
            ? (
                <div className="settings-page">
                    <div className="content-container">
                        <h1 className="underlined">Settings</h1>
                        <div className="description-container">
                            Here you can edit your personal information.
                        </div>
                        {error && <Callout message={error} />}
                        <UserForm user={user} onSubmit={handleSubmit} />
                    </div>
                </div>
            )
            : <LoadingScreen />
    );
}

