
import { useEffect, useState } from 'react';

import { Status, StatusColors } from 'adapters/common';
import { getProjects, Project } from 'adapters/project';

import Filter from 'components/helpers/Filter';
import ProjectGrid from 'components/layout/ProjectGrid';
import LoadingScreen from 'components/ui/LoadingScreen';
import ProjectsSlider from 'components/layout/ProjectsSlider';

import './projects.scss';

/**
 * This page should show all projects a user is a part of. It should also facilitate the creation of
 * new projects.
 */
export default function Projects() {
    const [filter, setFilter] = useState({ term: '', tags: Object.values(Status) });
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [shownProjects, setShownProjects] = useState<Project[]>([]);
    const [slideProjects, setSlideProjects] = useState<Project[]>([]);

    const allStatus = Object.values(Status).map(status => ({
        label: status,
        color: StatusColors.get(status.toString())
    }));

    useEffect(() => {
        getProjects().then((projects) => {
            setAllProjects(projects);
            setShownProjects(projects);
            setSlideProjects(projects.slice(0, 6));
        })
        .catch(() => { /* Just leave everything empty for now */ });
    }, []);

    useEffect(() => {
        setShownProjects(allProjects.filter(project => {
            return project.name.toLowerCase().includes(filter.term.toLowerCase())
                && filter.tags.some(tag => tag === project.status);
        }));
    }, [filter, allProjects])

    return (
        <div className="projects-page">
            <div className="content-container">
                <h1 className="underlined">Projects</h1>
                <h2>Recent Projects</h2>
                <ProjectsSlider projects={slideProjects} />
                <h2>All Projects</h2>
                <Filter setFilter={setFilter} filter={filter} tags={allStatus} />
                {
                    shownProjects
                        ? (<ProjectGrid projects={shownProjects} />)
                        : (<LoadingScreen />)
                }
            </div>
        </div>
    );
}

