
import { getUserImageUri, User } from 'adapters/user';

import './avatar.scss';

interface Props {
    user?: User;
}

export default function Avatar({ user }: Props) {
    const avatarSrc = user && getUserImageUri(user.id);

    return (
        <div className="avatar">
            <img src={avatarSrc} alt={user?.username.charAt(0) ?? "?"} />
        </div>
    )
}

