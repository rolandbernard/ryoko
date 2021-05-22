import './project-grid.scss';
import Project from 'components/ui/Project';
import { Project as IProject } from 'adapters/project';
import { Link } from 'react-router-dom';

interface Props {
    projects: IProject[]
}

export default function ProjectGrid({ projects }: Props) {
    let counter = 0;
    return (
        <div className="project-grid">
            <div className="add-project project">
                <Link to="/projects/create" className="content">
                    +
                </Link>
            </div>
            {
                projects.map(project => {
                    counter++;
                    return <Project key={project.id} project={project} large={(counter - 1) % 5 === 0 && projects.length - 3 >= counter} />
                }

                )}
        </div >
    )
}