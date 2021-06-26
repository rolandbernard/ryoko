
import { useCallback, useState } from 'react';

import { getUserImageUri, User } from 'adapters/user';

import './avatar.scss';

interface Props {
    user?: User;
}

/**
 * This helper function extracts the initials of the users real name or username to be used in the
 * Avatar component. If no user is given, a question mark will be returned.
 *
 * @param user The user to get the initials from
 * @returns The initials of the user
 */
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

/**
 * This component displays the avatar image for the given user. If the user has not set a image,
 * this component will display the initials of the real name of the user, or if that is not present,
 * it will display the first character of the username.
 */
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

