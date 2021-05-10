import './project-grid.scss';
import Project, { ProjectProps } from 'components/ui/Project';

interface Props {
    projects: ProjectProps[]
}

export default function ProjectGrid({ projects }: Props) {
    return (
        <div className="project-grid">
            <div className="add-project project">
                <div className="content">
                    +
        </div>
            </div>
            {
                projects.map(project => (
                    <Project key={project.project.id} {...project} />
                ))
            }
        </div >
    )
}