import './member-list.scss';
import TeamMember, { TeamMemberProps } from 'components/ui/TeamMember';

interface Props {
    members: TeamMemberProps[];
}

export default function MemberList({ members }: Props) {
    return (
        <div className="team-member-list">
            <div className="add-btn">
                +
            </div>
            {members.map((member) => (
                <TeamMember key={member.user.id} {...member} />
            ))}
        </div>
    );
}