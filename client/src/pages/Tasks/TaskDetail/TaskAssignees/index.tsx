
import { AssignedUser } from 'adapters/user';
import { durationFor, formatDuration } from 'timely';

import UserList from 'components/layout/UserList';
import LoadingScreen from 'components/ui/LoadingScreen';

interface Props {
    assignees: AssignedUser[]
}

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
                            }
                        />
                    )
                    : <LoadingScreen />
            }
        </section>
    );
}

