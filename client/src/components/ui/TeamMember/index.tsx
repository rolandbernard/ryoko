import './team-member.scss';
import Avatar from 'components/ui/Avatar';
import { User } from 'adapters/user';
import Dropdown, { DropDownItem } from 'components/navigation/Dropdown';

export interface TeamMemberProps {
    user: User;
    info: string;
    settings?: DropDownItem[]
}

export default function TeamMember({ user, info, settings }: TeamMemberProps) {
    return (
        <div className="team-member-item">
            <Avatar user={user} />
            <div className="details">
                <div className="name">{user.realname ?? user.username}</div>
                <div className="info">{info}</div>
            </div>
            {
                settings &&
                <Dropdown items={settings} position="right">
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