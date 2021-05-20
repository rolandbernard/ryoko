
import CircularProgress from 'components/graphs/CircularProgress';
import AssigneeList from 'components/ui/AssigneeList';
import { AssignedUser } from 'adapters/user';
import { getProjectAssignees, getProjectCompletion, Project as IProject } from 'adapters/project';
import './project.scss';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Completion } from 'adapters/util';
import LoadingScreen from '../LoadingScreen';

export interface ProjectProps {
    project: IProject
}

export default function Project({ project }: ProjectProps) {
    const [assignees, setAssignees] = useState<AssignedUser[]>([]);
    const [completion, setCOmpletion] = useState<Completion>();
    useEffect(() => {
        getProjectAssignees(project.id).then((assignee) => setAssignees(assignee))
        getProjectCompletion(project.id).then((completion) => setCOmpletion(completion));
    }, [project]);

    return (
        <Link to={'/projects/' + project.id} className="project">
            <div className="content">
                {
                    completion ? (
                        <CircularProgress percent={completion.closed / (completion.sum ?? 1) * 100 } color={project.color} />
                    ) : (
                        <LoadingScreen />
                    )
                }
                <div className="title">{project.name}</div>
                <div className="details">
                    {project.deadline && (
                        <div className="range">{project.deadline.getDate()}</div>
                    )}
                    <AssigneeList assignees={assignees} max={3} />
                </div>
            </div>

        </Link>
    );
}

