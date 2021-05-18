import './project-detail.scss';
import Tag from 'components/ui/Tag';
import Tabs, { Tab } from 'components/navigation/Tabs';
import { useHistory, useParams } from 'react-router';
import ProjectDetails from './ProjectDetails';
import ProjectTasks from './ProjectTasks';
import { useEffect, useState } from 'react';
import { getProject, Project, ProjectColors, StatusColors } from 'adapters/project';

export interface Params {
    projectId: string;
}

export default function ProjectDetail() {
    const { projectId } = useParams<Params>();
    const [project, setProject] = useState<Project>();
    const [tabs, setTabs] = useState<Tab[]>([]);
    const history = useHistory();
    useEffect(() => {
        getProject(projectId).then((project) => {
            setProject(project);
            setTabs([
                {
                    label: 'Details',
                    route: '/projects/' + projectId,
                    component: <ProjectDetails project={project}/>
                },
                {
                    label: 'Tasks',
                    route: '/projects/' + projectId + '/tasks',
                    component: <ProjectTasks />
                }
            ]);

        }).catch(() => {
            history.push('/projects');
        });
    }, [])



    return (
        <div className="project-detail-page">
            <div className="content-container">
                <Tag label={project?.status ?? ''} color={StatusColors.get(project?.status ?? '')} />
                <h1>{project?.name}</h1>
                <div className="description-container">
                    <p>
                        {project?.text}
                    </p>
                </div>
                {<Tabs tabs={tabs} />}

            </div>
        </div>
    )
}