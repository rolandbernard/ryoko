
import { AssignedUser } from 'adapters/user';

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
                            info={user => user.time + " min"}
                        />
                    )
                    : <LoadingScreen />
            }
        </section>
    );
}

