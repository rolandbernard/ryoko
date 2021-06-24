
import { Link } from 'react-router-dom';

import { Project as IProject } from 'adapters/project';

import Project from 'components/ui/Project';

import './project-grid.scss';

interface Props {
    projects: IProject[]
}

/**
 * This component implements a grid for showing multiple projects. The grid will display all
 * projects given in the projects property. The grid also gives a link to the project creation
 * page.
 */
export default function ProjectGrid({ projects }: Props) {
    let counter = 0;
    return (
        <div className="project-grid">
            <Link className="add-project project" to="/projects/create" >
                <div className="content">
                    +
                </div>
            </Link>
            {
                projects.map(project => {
                    counter++;
                    return (<Project
                        key={project.id}
                        project={project}
                        large={(counter - 1) % 5 === 0 && projects.length - 3 >= counter}
                    />)
                })
            }
        </div >
    )
}

