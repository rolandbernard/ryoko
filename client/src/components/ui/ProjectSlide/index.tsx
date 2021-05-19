import './project-slide.scss';
import { Project } from 'adapters/project';
import AssigneeList from 'components/ui/AssigneeList';
import LinearProgress from 'components/graphs/LinearProgress';
import { Link } from 'react-router-dom';

export interface ProjectSlideProps {
    project: Project;
}
const member = {
    id: 'asdf',
    username: 'testname',
    realname: 'Roland Bernard',
    role: 'Backend'
}

export default function ProjectSlide({ project }: ProjectSlideProps) {
    return (
        <Link to={'/projects/' + project.id} className="project-slide">
            <div className="head">
                <div className="name">{project.name}</div>
                <div className="range">March - {project.deadline}</div>
            </div>
            <div className="details">
                <AssigneeList assignees={[member, member, member, member]} max={3} />
                <div className="progress">
                    <LinearProgress percent={75} />
                    <div className="label">30h / <strong>40h</strong></div>
                </div>
            </div>
        </Link>
    )
}