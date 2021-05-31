
import { Link } from 'react-router-dom';

import { Task } from 'adapters/task';

import TaskComponent from 'components/ui/Task';

import './task-list.scss';

interface Props {
    tasks: Task[]
    addButton?: boolean
}

export default function TaskList({ tasks, addButton }: Props) {
    return (
        <div className="task-list">
            {
                addButton && (
                    <Link to="tasks/create" className="add-btn">
                        +
                    </Link>
                )
            }
            {
                tasks.map(task => (
                    <TaskComponent
                        key={task.id}
                        task={task}
                        subtitle={task.status}
                    />
                ))
            }
        </div>
    )
}

