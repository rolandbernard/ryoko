import './task-list.scss';
import { Task as ITask } from 'adapters/task';
import Task from 'components/ui/Task';
import { Link } from 'react-router-dom';

interface Props {
    tasks: ITask[]
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
                    <Task key={task.id} task={task} />
                ))
            }
        </div>
    )
}