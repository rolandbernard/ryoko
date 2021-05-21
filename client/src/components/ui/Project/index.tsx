
import CircularProgress from 'components/graphs/CircularProgress';
import AssigneeList from 'components/ui/AssigneeList';
import { AssignedUser } from 'adapters/user';
import { getProjectAssignees, getProjectCompletion, Project as IProject } from 'adapters/project';
import './project.scss';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Completion } from 'adapters/util';
import LoadingScreen from '../LoadingScreen';
import Tag from '../Tag';
import { StatusColors } from 'adapters/project';

export interface ProjectProps {
    project: IProject
    large?: boolean
}

export default function Project({ project, large }: ProjectProps) {
    const [assignees, setAssignees] = useState<AssignedUser[]>([]);
    const [completion, setCompletion] = useState<Completion>();
    
    useEffect(() => {
        getProjectAssignees(project.id).then((assignee) => setAssignees(assignee))
        getProjectCompletion(project.id).then((completion) => setCompletion(completion));
    }, [project]);

    return (
        <Link to={'/projects/' + project.id} className={'project ' + (large ? 'large' : '')}>
            <div className="status">
                <Tag label={project.status} color={StatusColors.get(project.status)} />
            </div>
            <div className="content">
                {
                    completion ? (
                        <CircularProgress percent={completion.closed / (completion.sum ?? 1) * 100} color={project.color} />
                    ) : (
                        <LoadingScreen />
                    )
                }
                <div className="title">{project.name}</div>
                {
                    large &&
                    <div className="details">
                        {project.deadline && (
                            <div className="deadline">{project.deadline.toUTCString()}</div>
                        )}
                        <AssigneeList assignees={assignees} max={3} />
                    </div>
                }
            </div>
        </Link>
    );
}

