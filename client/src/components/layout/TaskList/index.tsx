import './task-list.scss';
import { Task as ITask } from 'adapters/task';
import Task from 'components/ui/Task';

interface Props {
    tasks: ITask[]
}

export default function TaskList({ tasks }: Props) {
    return (
        <div className="task-list">

            {
                tasks.map(task => (
                    <Task key={task.id} task={task} />
                ))
            }
        </div>
    )
}