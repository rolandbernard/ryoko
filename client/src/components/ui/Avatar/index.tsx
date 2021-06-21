
import { useCallback, useState } from 'react';

import { getUserImageUri, User } from 'adapters/user';

import './avatar.scss';

interface Props {
    user?: User;
}

function getUserInitials(user?: User): string {
    if (user) {
        if (user.realname) {
            const names = user.realname.split(/\W+/);
            if (names.length > 1) {
                return names[0][0] + names[names.length - 1][0];
            } else {
                return user.realname[0];
            }
        } else {
            return user.username[0];
        }
    } else {
        return '?';
    }
}

export default function Avatar({ user }: Props) {
    const [error, setError] = useState(false);
    const avatarSrc = user && getUserImageUri(user.id);

    const onError = useCallback(() => {
        setError(true);
    }, []);

    return (
        <div className="avatar">
            {
                !error && (
                    <img src={avatarSrc} alt="" onError={onError} />
                )
            }
            {
                error && (
                    <div className="standard-image">
                        {getUserInitials(user)}
                    </div>
                )
            }
        </div>
    )
}

