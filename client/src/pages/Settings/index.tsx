
import { useHistory } from 'react-router';
import { useCallback, useEffect, useState } from 'react';

import { reload } from 'index';
import { getCurrentUser, updateUser, updateUserImage, User } from 'adapters/user';

import Callout from 'components/ui/Callout';
import UserForm from 'components/forms/UserForm';
import LoadingScreen from 'components/ui/LoadingScreen';

import './settings.scss';

/**
 * This page allows the user to change personal user settings like email and real name. It also
 * allows the user to upload an image.
 */
export default function Settings() {
    const [user, setUser] = useState<User>();
    const [error, setError] = useState('');
    const history = useHistory();

    useEffect(() => {
        getCurrentUser().then(setUser)
    }, []);

    const handleSubmit = useCallback(async (name?: string, email?: string, avatar?: File) => {
        try {
            await Promise.all([
                updateUser({ realname: name, email: email }),
                avatar && updateUserImage(avatar)
            ])
            history.push('/tasks');
            reload();
        } catch (e) {
            setError('There was an issue with saving your settings. Please try again!')
        }
    }, [history]);

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

