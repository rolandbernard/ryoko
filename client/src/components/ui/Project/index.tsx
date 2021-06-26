
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
    project: IProject;
    large?: boolean;
    demo?: boolean;
}

/**
 * This is a component that is used in the project grid and shows the information of the given
 * project. It will also show the deadline, assignees and completion of the project.
 */
export default function Project({ project, large, demo }: ProjectProps) {
    const [assignees, setAssignees] = useState<AssignedUser[]>([]);
    const [completion, setCompletion] = useState<Completion>();
    
    useEffect(() => {
        if (!demo) {
            getProjectAssignees(project.id).then(setAssignees)
            getProjectCompletion(project.id).then(setCompletion);
        } else {
            setAssignees([]);
            setCompletion({
                closed: parseInt(project.id),
                open: 0, suspended: 0, overdue: 0,
                sum: 100
            });
        }
    }, [project, demo]);

    const content = <>
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
    </>;

    if (demo) {
        return (
            <div className={'project demo' + (large ? ' large' : '')}>
                { content }
            </div>
        );
    } else {
        return (
            <Link to={'/projects/' + project.id} className={'project' + (large ? ' large' : '')}>
                { content }
            </Link>
        );
    }
}

