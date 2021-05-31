
import { Link } from 'react-router-dom';

import Task, { TaskProps } from 'components/ui/Task';

import './task-list.scss';

interface Props {
    tasks: TaskProps[]
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
                    <Task key={task.task.id} {...task} />
                ))
            }
        </div>
    )
}

