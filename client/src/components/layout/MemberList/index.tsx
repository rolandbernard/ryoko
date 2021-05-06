import './member-list.scss';
import TeamMember from 'components/ui/TeamMember';

interface TeamMemberInterface {
    uuid: string;
    name: string;
    role: string;
}

interface Props {
    members: TeamMemberInterface[]
}

export default function MemberList({ members }: Props) {
    return (
        <div className="team-member-list">
            <div className="add-btn">
                +
            </div>
            {members.map((member) => (
                <TeamMember key={member.uuid} member={member} />
            ))}
        </div>
    );
}