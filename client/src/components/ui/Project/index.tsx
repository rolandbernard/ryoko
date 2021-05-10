
import CircularProgress from 'components/graphs/CircularProgress';
import AssigneeList from 'components/ui/AssigneeList';
import { Project as IProject } from 'adapters/project';
import './project.scss';
import { Link } from 'react-router-dom';
const member = {
    id: 'asdf',
    username: 'testname',
    realname: 'Roland Bernard',
    role: 'Backend'
}

export interface ProjectProps {
    project: IProject
}

export default function Project({ project }: ProjectProps) {
    return (
        <Link to={'/projects/' + project.id} className="project">
            <div className="content">
                <CircularProgress percent={75} />
                <div className="title">{project.name}</div>
                <div className="details">
                    <div className="range">April - {project.deadline}</div>
                    <AssigneeList assignees={[member, member, member, member]} max={3} />
                </div>
            </div>
            
        </Link>
    );
}

