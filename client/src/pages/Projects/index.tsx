import ProjectsSlider from 'components/layout/ProjectsSlider';
import './projects.scss';
import ProjectGrid from 'components/layout/ProjectGrid';
import Filter from 'components/helpers/Filter';
import { useEffect, useState } from 'react';
import { getProjects, Project } from 'adapters/project';

export default function Projects() {
    const [filter, setFilter] = useState({ term: '', items: [''] });
    const [allProjects, setAllProjects] = useState<Project[]>([]);

    useEffect(() => {
        getProjects().then((projects) => {
            setAllProjects(projects);
        })
    }, [])

    return (
        <div className="projects-page">
            <div className="content-container">
                <h1 className="underlined">Projects</h1>
                <h2>Recent Projects</h2>
                <ProjectsSlider projects={[]} />
                <h2>All Projects</h2>
                <Filter setFilter={setFilter} />
                <ProjectGrid projects={allProjects} />
            </div>
        </div>
    );
}
