import { getTaskAssignees } from 'adapters/task';
import MemberList from 'components/layout/MemberList';
import LoadingScreen from 'components/ui/LoadingScreen';
import { TeamMemberProps } from 'components/ui/TeamMember';
import { useEffect, useState } from 'react';

interface Props {
    taskId: string
}

export default function TaskAssignees({ taskId }: Props) {
    const [assignees, setAssignees] = useState<TeamMemberProps[]>();
    useEffect(() => {
        getTaskAssignees(taskId).then(assignees =>
            setAssignees(assignees.map(assignee => ({
                user: assignee,
                info: assignee.time.toString()
            }
        ))))
    }, [taskId])


    return (
        <section className="task-assignees-section">
            {
                assignees ?
                    <MemberList members={assignees} />
                    : <LoadingScreen />
            }
        </section>
    );
}