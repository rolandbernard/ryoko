import './team-member.scss';
import { TeamMember as ITeamMember } from 'adapters/team';
import Avatar from 'components/ui/Avatar';

interface Props {
    member: ITeamMember
}

export default function TeamMember({ member }: Props) {
    return (
        <div className="team-member-item">
            <Avatar user={member} />
            <div className="details">
                <div className="name">{member.username}</div>
                <div className="role">{member.role.name}</div>
            </div>
            <div className="settings">

            </div>
        </div>
    );
}