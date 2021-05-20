import './settings.scss';
import { useCallback, useEffect, useState } from 'react';
import { getCurrentUser, updateUser, User } from 'adapters/user';
import LoadingScreen from 'components/ui/LoadingScreen';
import UserForm from 'components/forms/UserForm';
import { useHistory } from 'react-router';

export default function Settings() {
    const [user, setUser] = useState<User>();
    const history = useHistory();

    useEffect(() => {
        getCurrentUser().then((user) => setUser(user))
    }, []);


    const handleSubmit = useCallback(async (name?: string, email?: string) => {
        try {
            if (user && updateUser({realname: name, email })) {
                history.push('/tasks');
            }
        } catch (e) {
        }
    }, [history, user]);

    if (user) {
        return (
            <div className="settings-page">
                <div className="content-container">
                    <h1 className="underlined">Settings</h1>
                    <UserForm user={user} onSubmit={handleSubmit} />
                </div>
            </div>
        )

    }
    return <LoadingScreen />
}