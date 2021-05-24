import './settings.scss';
import { useCallback, useEffect, useState } from 'react';
import { getCurrentUser, updateUser, updateUserImage, User } from 'adapters/user';
import LoadingScreen from 'components/ui/LoadingScreen';
import UserForm from 'components/forms/UserForm';
import { useHistory } from 'react-router';

export default function Settings() {
    const [user, setUser] = useState<User>();
    const history = useHistory();

    useEffect(() => {
        getCurrentUser().then((user) => setUser(user))
    }, []);


    const handleSubmit = useCallback(async (name?: string, email?: string, avatar?: File) => {
        try {
            if (user && updateUser({realname: name, email })) {
                if(avatar) {
                    updateUserImage(avatar);
                }
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
                    <div className="description-container">
                        Here you can edit your personal information.
                    </div>
                    <UserForm user={user} onSubmit={handleSubmit} />
                </div>
            </div>
        )

    }
    return <LoadingScreen />
}