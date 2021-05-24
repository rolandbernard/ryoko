import './project-detail.scss';
import Tag from 'components/ui/Tag';
import Tabs, { Tab } from 'components/navigation/Tabs';
import { useHistory, useParams } from 'react-router';
import ProjectDetails from './ProjectDetails';
import ProjectTasks from './ProjectTasks';
import { useEffect, useState } from 'react';
import { getProject, Project, StatusColors } from 'adapters/project';
import LoadingScreen from 'components/ui/LoadingScreen';

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
                    component: <ProjectDetails project={project} />
                },
                {
                    label: 'Tasks',
                    route: '/projects/' + projectId + '/tasks',
                    component: <ProjectTasks project={project} />
                }
            ]);

        }).catch(() => {
            history.push('/projects');
        });
    }, [history, projectId])


    if (project) {
        return (
            <div className={"project-detail-page theme-" + project.color}>
                <span className="material-icons back-btn" onClick={history.goBack} >
                    arrow_back
                </span>
                <div className="content-container">
                    <Tag label={project.status} color={StatusColors.get(project.status)} />
                    <h1>{project.name}</h1>
                    <div className="description-container">
                        <p>
                            {project.text}
                        </p>
                    </div>
                    {
                        tabs ?
                            <Tabs tabs={tabs} /> :
                            <LoadingScreen />
                    }

                </div>
            </div>
        )
    }
    return <LoadingScreen />
}