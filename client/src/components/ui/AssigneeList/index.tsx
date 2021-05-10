import './assignee-list.scss';
import Tooltip from 'components/ui/Tooltip';
import avatar from 'images/daniel-planoetscher.jpg';
import { User } from 'adapters/user';

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
                    <Tooltip key={assignee.id} text={assignee.realname ?? ''} className="assignee">
                        <img src={avatar} alt={assignee.username} />
                    </Tooltip>
                ))
            }
        </div>
    )

}