import { TeamMember } from 'adapters/team';
import MemberList from 'components/layout/MemberList';

interface Props {
    assignees: TeamMember[] 
}

export default function TaskAssignees({assignees}: Props) {
    return (
        <section className="teams-assignees-section">
            <MemberList members={assignees} />
        </section>
    );
}