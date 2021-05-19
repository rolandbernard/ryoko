import './task-list.scss';
import Task, { TaskProps } from 'components/ui/Task';
import { Link } from 'react-router-dom';

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