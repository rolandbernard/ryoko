import ProjectsSlider from 'components/layout/ProjectsSlider';
import './projects.scss';
import ProjectGrid from 'components/layout/ProjectGrid';
import Filter from 'components/helpers/Filter';
import { useEffect, useState } from 'react';
import { getProjects, Project, Status, StatusColors } from 'adapters/project';
import LoadingScreen from 'components/ui/LoadingScreen';
import { ProjectSlideProps } from 'components/ui/ProjectSlide';

export default function Projects() {
    const [filter, setFilter] = useState({ term: '', tags: [] });
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [shownProjects, setShownProjects] = useState<Project[]>([]);
    const [slideProjects, setSlideProjects] = useState<ProjectSlideProps[]>([]);

    const allStatus = Object.values(Status).map((status) => {
        return {
            label: status.toString(),
            color: StatusColors.get(status.toString())
        }
    });

    useEffect(() => {
        getProjects().then((projects) => {
            setAllProjects(projects);
            setShownProjects(projects);
            setSlideProjects(projects.slice(0, 6).map((project) => ({project})))
        })
    }, []);

    useEffect(() => {
        setShownProjects(allProjects.filter(project => {
            if (!filter.tags.length) {
                return project.name.indexOf(filter.term) >= 0;
            } else {
                return project.name.indexOf(filter.term) >= 0 && filter.tags.find(tag => tag === project.status);
            }
        }
        ));
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
                    shownProjects ? (
                        <ProjectGrid projects={shownProjects} />
                    ) : (
                        <LoadingScreen />
                    )
                }
            </div>
        </div>
    );
}
