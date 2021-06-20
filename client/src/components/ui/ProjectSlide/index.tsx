
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { AssignedUser } from 'adapters/user';
import { durationBetween, formatDate, formatDuration, durationFor } from 'timely';
import { getProjectAssignees, getProjectWork, Project } from 'adapters/project';

import AssigneeList from 'components/ui/AssigneeList';
import LoadingScreen from 'components/ui/LoadingScreen';
import LinearProgress from 'components/graphs/LinearProgress';

import './project-slide.scss';

export interface ProjectSlideProps {
    project: Project;
}

export default function ProjectSlide({ project }: ProjectSlideProps) {
    const [assignees, setAssignees] = useState<AssignedUser[]>([]);
    const [time, setTime] = useState<number>();
    const [totalTime, setTotalTime] = useState<number>();


    useEffect(() => {
        getProjectAssignees(project.id).then(assignee => {
            setAssignees(assignee);
            setTotalTime(durationFor(assignee.map(a => a.time).reduce((total, c) => total + c, 0), 'minute'))
        });
        getProjectWork(project.id).then((work) =>
            setTime(
                work.map(w => durationBetween(w.started, w.finished ?? new Date()))
                    .reduce((total, c) => total + c, 0),
            )
        )
    }, [project]);

    return (
        <Link to={'/projects/' + project.id} className="project-slide">
            <div className="head">
                <div className="name">{project.name}</div>
                {
                    project.deadline && (
                        <div className="range">{formatDate(project.deadline, 'month')}</div>
                    )
                }
            </div>
            <div className="details">
                {
                    assignees.length > 0 &&
                    <AssigneeList assignees={assignees} max={3} />
                }
                {
                    (time !== undefined && totalTime !== undefined)
                        ? (
                            <div className="progress">
                                <LinearProgress percent={time / totalTime * 100} color={project.color} />
                                {totalTime > 0 && time > 0 ? (
                                    <div className="label">{formatDuration(time, 'second', 2, true)} /
                                        <strong>{formatDuration(totalTime, 'second', 2, true)}</strong></div>
                                ) : <div className="label">No tasks found</div>}
                            </div>
                        )
                        : <LoadingScreen />
                }
            </div>
        </Link>
    )
}

