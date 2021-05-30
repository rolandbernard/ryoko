
import { useCallback, useState } from 'react';

import { getUserImageUri, User } from 'adapters/user';

import './avatar.scss';

interface Props {
    user?: User;
}

export default function Avatar({ user }: Props) {
    const [error, setError] = useState(false);
    const avatarSrc = user && getUserImageUri(user.id);

    const onError = useCallback(() => {
        setError(true);
    }, [setError]);

    return (
        <div className="avatar">
            {
                !error && (
                    <img src={avatarSrc} alt={user?.username} onError={onError} />
                )
            }
            {
                error && (
                    <div className="standard-image">
                        {user?.username && user.username.charAt(0)}
                    </div>
                )
            }
        </div>
    )
}

