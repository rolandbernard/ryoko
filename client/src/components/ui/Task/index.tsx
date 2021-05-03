import './task.scss';
import { Link } from 'react-router-dom';

interface TaskInt {
    uuid: string,
    name: string,
    icon: string,
    start: number,
    end: number,
    description: string
}

interface Props {
    task: TaskInt,
    active?: boolean,
}

function formattedTime(date: Date) {
    return date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
}

export default function Task({ task, active }: Props) {
    const start = new Date(task.start);
    const end = new Date(task.end);



    return (
        <Link to={'/tasks/' + task.uuid} className="task">
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
                {task.description}
            </div>

        </Link>
    )
}