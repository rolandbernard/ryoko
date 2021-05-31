
import MemberList from 'components/layout/MemberList';
import LoadingScreen from 'components/ui/LoadingScreen';
import { TeamMemberProps } from 'components/ui/TeamMember';

interface Props {
    assignees: TeamMemberProps[]
}

export default function TaskAssignees({ assignees }: Props) {
    return (
        <section className="task-assignees-section">
            {
                assignees
                    ? <MemberList members={assignees} />
                    : <LoadingScreen />
            }
        </section>
    );
}

