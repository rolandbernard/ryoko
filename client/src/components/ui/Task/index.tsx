
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { User } from 'adapters/user';
import { getTaskAssignees, Task } from 'adapters/task';

import LongText from '../LongText';
import AssigneeList from 'components/ui/AssigneeList';

import './task.scss';

export interface TaskProps {
    task: Task;
    subtitle?: string;
}

export default function TaskComponent({ task, subtitle }: TaskProps) {
    const [assignees, setAssignees] = useState<User[]>([]);

    useEffect(() => {
        getTaskAssignees(task.id).then(setAssignees);
    }, [task]);

    return (
        <Link to={'/tasks/' + task.id} className="task">
            <div className={'indicator' + (task.color ? ' bg-gradient-' + task.color : '')}></div>
            <div className="main-info">
                <div className="icon-container">
                {task.icon}
                </div>
                <div className="text-container">
                    <div className="name">{task.name}</div>
                    <div className="time">{subtitle}</div>
                </div>
            </div>
            <div className="description-container">
                <LongText text={task.text} open={true} />
            </div>
            <AssigneeList assignees={assignees} max={3} />
        </Link>
    )
}

