import './task.scss';
import { Link } from 'react-router-dom';
import AssigneeList from 'components/ui/AssigneeList';
import { Task as ITask } from 'adapters/task';
import { useEffect, useState } from 'react';
import { getUser, User } from 'adapters/user';

export interface TaskProps {
    task: ITask;
    color?: string;
    subtitle?: string;
}

export default function Task({ task, color, subtitle }: TaskProps) {
    const [assignees, setAssignees] = useState<User[]>([]);

    useEffect(() => {
        task.assigned.forEach((assign) => {
            getUser(assign.user).then((user) => setAssignees(state => [...state, user])).catch(() => {})
        })
    }, [task]);

    return (
        <Link to={'/tasks/' + task.id} className="task">
            <div className={'indicator' + (color ? ' bg-gradient-' + color : '')}></div>
            <div className="main-info">
                <div className="icon-container">
                {task.icon}
                </div>
                <div className="text-container">
                    <h4>{task.name}</h4>
                    <div className="time">{subtitle}</div>
                </div>
            </div>
            <div className="description-container">
                {task.text}
            </div>
            <AssigneeList assignees={assignees} max={3} />

        </Link>
    )
}