
import { User } from 'adapters/user';

import Avatar from 'components/ui/Avatar';
import Dropdown, { DropDownItem } from 'components/navigation/Dropdown';

import './user.scss';

export interface UserProps<T extends User> {
    user: T;
    info?: (user: T) => string;
    settings?: (user: T) => DropDownItem[];
}

/**
 * This component shows the details for one user. The user is given in the properties together with
 * a info string that will be shown under the users name and a settings function to generate a
 * dropdown for a settings dropdown.
 */
export default function UserComponent<T extends User>({ user, info, settings }: UserProps<T>) {
    return (
        <div className="team-member-item">
            <Avatar user={user} />
            <div className="details">
                <div className="name">{user.realname ?? user.username}</div>
                <div className="info">{info?.(user)}</div>
            </div>
            {
                settings &&
                    <Dropdown items={settings(user)} position="right">
                        <div className="settings">
                            <span className="material-icons icon">
                                expand_more
                            </span>
                        </div>
                    </Dropdown>
            }
        </div>
    );
}

