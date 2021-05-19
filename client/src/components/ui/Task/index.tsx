import './task.scss';
import { Link } from 'react-router-dom';
import AssigneeList from 'components/ui/AssigneeList';
import { Task as ITask } from 'adapters/task';
import { useEffect, useState } from 'react';
import { getUser, User } from 'adapters/user';

interface Props {
    task: ITask,
}

function formattedTime(date: Date) {
    return date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
}

export default function Task({ task }: Props) {
    const [assignees, setAssignees] = useState<User[]>([]);
    const start = new Date(200);
    const end = new Date(300);

    useEffect(() => {
        task.assigned.forEach((assign) => {
            getUser(assign.user).then((user) => setAssignees(state => [...state, user])).catch(() => {})
        })
    }, []);

    return (
        <Link to={'/tasks/' + task.id} className="task">
            <div className="project-indicator"></div>
            <div className="main-info">
                <div className="icon-container">
                {String.fromCharCode(parseInt(task.icon, 16))}
                </div>
                <div className="text-container">
                    <h4>{task.name}</h4>
                    <div className="time">{formattedTime(start)} - {formattedTime(end)}</div>
                </div>
            </div>
            <div className="description-container">
                {task.text}
            </div>
            <AssigneeList assignees={assignees} max={3} />

        </Link>
    )
}