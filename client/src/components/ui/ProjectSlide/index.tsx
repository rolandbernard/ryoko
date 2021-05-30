
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { Completion } from 'adapters/common';
import { AssignedUser } from 'adapters/user';
import { durationBetween, formatDate } from 'timely';
import { getProjectAssignees, getProjectCompletion, getProjectWork, Project } from 'adapters/project';

import AssigneeList from 'components/ui/AssigneeList';
import LoadingScreen from 'components/ui/LoadingScreen';
import LinearProgress from 'components/graphs/LinearProgress';

import './project-slide.scss';

export interface ProjectSlideProps {
    project: Project;
}

export default function ProjectSlide({ project }: ProjectSlideProps) {
    const [assignees, setAssignees] = useState<AssignedUser[]>([]);
    const [completion, setCompletion] = useState<Completion>();
    const [time, setTime] = useState(0);
    const [totalTime, setTotalTime] = useState(1);

    useEffect(() => {
        getProjectAssignees(project.id).then(
            (assignee) => {
                setAssignees(assignee);
                setTotalTime(assignee.map(a => a.time).reduce((total, c) => total + c, 1) * 60 * 1000)
            }
        )
        getProjectCompletion(project.id).then((completion) => setCompletion(completion));
        getProjectWork(project.id).then((work) =>
            setTime(
                work.map(w => durationBetween(w.started, w.finished ?? new Date()))
                    .reduce((total, c) => total + c, 0)
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
                <AssigneeList assignees={assignees} max={3} />
                {
                    completion
                        ? (
                            <div className="progress">
                                <LinearProgress percent={time / totalTime * 100} />
                                <div className="label">{(time / 60 / 60 / 1000).toFixed(2)}h /
                                <strong>{(totalTime / 60 / 60 / 1000).toFixed(2)}h</strong></div>
                            </div>
                        )
                        : <LoadingScreen />
                }
            </div>
        </Link>
    )
}

