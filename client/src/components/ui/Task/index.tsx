
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { User } from 'adapters/user';
import { getTaskAssignees, Task } from 'adapters/task';

import Tag from 'components/ui/Tag';
import LongText from 'components/ui/LongText';
import AssigneeList from 'components/ui/AssigneeList';

import './task.scss';

export interface TaskProps {
    task: Task;
    subtitle?: string;
    started?: boolean;
}

/**
 * This component shows task information given in the task property. It will also show the given
 * subtitle under the name of the task. If the started property is true, a tag will be displayed
 * above the task and the link will go directly to the tasks start page.
 */
export default function TaskComponent({ task, subtitle, started }: TaskProps) {
    const [assignees, setAssignees] = useState<User[]>([]);

    useEffect(() => {
        getTaskAssignees(task.id).then(setAssignees);
    }, [task]);

    return (
        <Link to={'/tasks/' + task.id + (started ? '/start' : '')} className="task">
            <div className={'indicator' + (task.color ? ' bg-gradient-' + task.color : '')}></div>
            <div className="main-info">
                <div className="icon-container">
                {task.icon}
                </div>
                <div className="text-container">
                    <div className="name">
                        {task.name}
                    </div>
                    <div className="time">{subtitle}</div>
                </div>
                { started &&
                    <Tag label="Started"/>
                }
            </div>
            <div className="description-container">
                <LongText text={task.text} open={true} />
            </div>
            <AssigneeList assignees={assignees} max={3} />
        </Link>
    )
}

