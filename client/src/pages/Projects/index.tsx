import ProjectsSlider from 'components/layout/ProjectsSlider';
import { Status } from 'adapters/project';
import './projects.scss';
import ProjectGrid from 'components/layout/ProjectGrid';
import Filter from 'components/helpers/Filter';
import { useState } from 'react';

export default function Projects() {
    const [filter, setFilter] = useState({term: '', items: ['']});

    const project = {
        project: {
            id: 'asdf',
            name: 'Shopping List',
            text: 'Some text',
            color: 'color',
            status: Status.OPEN,
            teams: ['ryoko']
        }
    }
    return (
        <div className="projects-page">
            <div className="content-container">
                <h1 className="underlined">Projects</h1>
                <h2>Recent Projects</h2>
                <ProjectsSlider projects={[project, project, project, project]} />
                <h2>All Projects</h2>
                <Filter setFilter={setFilter} />
                <ProjectGrid projects={[project, project, project, project, project, project, project, project, project, project, project, project]} />
            </div>
        </div>
    );
}
