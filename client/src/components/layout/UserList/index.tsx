
import { ReactNode, useState } from 'react';

import { User } from 'adapters/user';

import Popup from 'components/ui/Popup';
import UserComponent from 'components/ui/User';
import { DropDownItem } from 'components/navigation/Dropdown';

import './user-list.scss';

interface Props<T extends User> {
    users: T[];
    addContent?: ReactNode
    info?: (user: T) => string;
    settings?: (user: T) => DropDownItem[];
}

/**
 * This component implements a list of user. The list will be displayed with the users name and user
 * image and also include information given by the info function. If the settings function is given
 * as a property, the dropdown returned by this function will be accessible to the user by a button.
 */
export default function UserList<T extends User>({ users, addContent, info, settings }: Props<T>) {
    const [showAdd, setShowAdd] = useState(false);
    return (
        <>
            {
                addContent && showAdd &&
                <Popup onClose={() => setShowAdd(false)}>
                    {addContent}
                </Popup>
            }
            <div className="team-member-list">
                {
                    addContent &&
                    <div className="add-btn" onClick={() => setShowAdd(true)}>
                        +
                    </div>
                }

                {users.length > 0 ? users.map((user) => (
                    <UserComponent
                        key={user.id}
                        user={user}
                        info={info}
                        settings={settings}
                    />
                )) : (
                    <div>No user found.</div>
                )}
            </div>
        </>
    );
}

