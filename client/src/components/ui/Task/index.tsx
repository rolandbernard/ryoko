import './task.scss';
import { Link } from 'react-router-dom';
import AssigneeList from 'components/ui/AssigneeList';
import { Task as ITask } from 'adapters/task';

interface Props {
    task: ITask,
}

function formattedTime(date: Date) {
    return date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
}

export default function Task({ task }: Props) {
    const start = new Date(200);
    const end = new Date(300);

    const member = {
        id: 'asdf',
        username: 'testname',
        realname: 'Roland Bernard',
        role: 'Backend'
    }

    return (
        <Link to={'/tasks/' + task.id} className="task">
            <div className="project-indicator"></div>
            <div className="main-info">
                <div className="icon-container">
                    {task.icon}
                </div>
                <div className="text-container">
                    <h4>{task.name}</h4>
                    <div className="time">{formattedTime(start)} - {formattedTime(end)}</div>
                </div>
            </div>
            <div className="description-container">
                {task.text}
            </div>
            <AssigneeList assignees={[member, member, member, member, member]} max={3} />

        </Link>
    )
}