import './teams-members.scss';
import MemberList from 'components/layout/MemberList';
import { TeamMember } from 'adapters/team';

interface Props {
    members: TeamMember[];
}

export default function TeamsMembers({ members }: Props) {
    return (
        <section className="teams-members-section">
            <MemberList members={members} />
        </section>
    )
}