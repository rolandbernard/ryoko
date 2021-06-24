
import { AssignedUser } from 'adapters/user';
import { durationFor, formatDuration } from 'timely';

import UserList from 'components/layout/UserList';
import LoadingScreen from 'components/ui/LoadingScreen';

interface Props {
    assignees: AssignedUser[]
}

/**
 * This is a tab of the task details page. It contains the list of all users assigned to the task
 * with the amount of time the user is assigned for.
 */
export default function TaskAssignees({ assignees }: Props) {
    return (
        <section className="task-assignees-section">
            {
                assignees
                    ? (
                        <UserList
                            users={assignees}
                            info={user =>
                                formatDuration(durationFor(user.time, 'minute'), 'second', 2, true)
                                + (user.finished ? ' (finished)' : '')
                            }
                        />
                    )
                    : <LoadingScreen />
            }
        </section>
    );
}

