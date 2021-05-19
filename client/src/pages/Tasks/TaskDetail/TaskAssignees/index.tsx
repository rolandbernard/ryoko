import { getTaskAssignees } from 'adapters/task';
import MemberList from 'components/layout/MemberList';
import { TeamMemberProps } from 'components/ui/TeamMember';
import { useEffect, useState } from 'react';

interface Props {
    taskId: string
}

export default function TaskAssignees({ taskId }: Props) {
    const [assignees, setAssignees] = useState<TeamMemberProps[]>([]);
    //TODO add role
    useEffect(() => {
        getTaskAssignees(taskId).then(assignees =>

            setAssignees(assignees.map(assignee => {
                return {
                    user: assignee,
                    info: assignee.time.toString() +  ' - '
                }
            })
            )
        )
    }, [taskId])


    return (
        <section className="teams-assignees-section">
            <MemberList members={assignees} />
        </section>
    );
}