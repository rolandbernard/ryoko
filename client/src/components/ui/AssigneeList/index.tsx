
import { User } from 'adapters/user';

import Tooltip from 'components/ui/Tooltip';
import Avatar from 'components/ui/Avatar';

import './assignee-list.scss';

interface Props {
    assignees: User[],
    max: number
}

export default function AssigneeList({ assignees, max }: Props) {
    let shownAssignees = assignees, overhead = 0;
    if (assignees.length > max) {
        shownAssignees = assignees.slice(0, max - 1);
        overhead = assignees.length - max;
    }
    return (
        <div className="assignee-list">
            {
                (overhead > 0) && (
                    <div className="overhead assignee">
                        +{overhead}
                    </div>
                )
            }
            {
                shownAssignees.map(assignee => (
                    <Tooltip key={assignee.id} text={assignee.realname ?? assignee.username} className="assignee">
                        <Avatar user={assignee} />
                    </Tooltip>
                ))
            }
        </div>
    )
}

