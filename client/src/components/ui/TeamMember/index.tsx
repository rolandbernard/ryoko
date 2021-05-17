import './team-member.scss';
import Avatar from 'components/ui/Avatar';
import { User } from 'adapters/user';

export interface TeamMemberProps {
    user: User;
    info: string;
}

export default function TeamMember({ user, info }: TeamMemberProps) {
    return (
        <div className="team-member-item">
            <Avatar user={user} />
            <div className="details">
                <div className="name">{user.username}</div>
                <div className="role">{info}</div>
            </div>
            <div className="settings">

            </div>
        </div>
    );
}