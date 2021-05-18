
import CircularProgress from 'components/graphs/CircularProgress';
import AssigneeList from 'components/ui/AssigneeList';
import { AssignedUser, getProjectAssignees, Project as IProject } from 'adapters/project';
import './project.scss';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export interface ProjectProps {
    project: IProject
}

export default function Project({ project }: ProjectProps) {
    const [assignees, setAssignees] = useState<AssignedUser[]>([]);
    useEffect(() => {
        getProjectAssignees(project.id).then((assignee) => setAssignees(assignee))
    }, []);
    
    return (
        <Link to={'/projects/' + project.id} className="project">
            <div className="content">
                <CircularProgress percent={75} color={project.color} />
                <div className="title">{project.name}</div>
                <div className="details">
                    {project.deadline && (
                        <div className="range">{project.deadline}</div>
                    )}
                    <AssigneeList assignees={assignees} max={3} />
                </div>
            </div>

        </Link>
    );
}

