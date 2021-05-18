import './task-list.scss';
import { Task as ITask } from 'adapters/task';
import Task from 'components/ui/Task';

interface Props {
    tasks: ITask[]
    addButton?: boolean
}

export default function TaskList({ tasks, addButton }: Props) {
    return (
        <div className="task-list">
            {
                addButton && (
                    <div className="add-btn">
                        +
                    </div>
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