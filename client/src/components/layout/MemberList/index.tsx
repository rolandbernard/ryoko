import './member-list.scss';
import TeamMember from 'components/ui/TeamMember';
import { TeamMember as ITeamMember } from 'adapters/team';

interface Props {
    members: ITeamMember[]
}

export default function MemberList({ members }: Props) {
    return (
        <div className="team-member-list">
            <div className="add-btn">
                +
            </div>
            {members.map((member) => (
                <TeamMember key={member.id} member={member} />
            ))}
        </div>
    );
}