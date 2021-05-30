
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { formatDate } from 'timely';
import { AssignedUser } from 'adapters/user';
import { Completion, StatusColors } from 'adapters/common';
import { getProjectAssignees, getProjectCompletion, Project as IProject } from 'adapters/project';

import Tag from 'components/ui/Tag';
import AssigneeList from 'components/ui/AssigneeList';
import LoadingScreen from 'components/ui/LoadingScreen';
import CircularProgress from 'components/graphs/CircularProgress';

import './project.scss';

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
                    completion
                        ? (<CircularProgress percent={completion.closed / (completion.sum ?? 1) * 100} color={project.color} />)
                        : (<LoadingScreen />)
                }
                <div className="title">{project.name}</div>
                {
                    large &&
                    <div className="details">
                        {
                            project.deadline
                                && (<div className="deadline">{formatDate(project.deadline, 'month')}</div>)
                        }
                        <AssigneeList assignees={assignees} max={3} />
                    </div>
                }
            </div>
        </Link>
    );
}


