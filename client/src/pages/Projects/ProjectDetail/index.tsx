
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import { Status, StatusColors } from 'adapters/common';
import { getProject, Project, updateProject } from 'adapters/project';

import EditableTag from 'components/ui/EditableTag';
import LongText from 'components/ui/LongText';
import Tabs, { Tab } from 'components/navigation/Tabs';
import LoadingScreen from 'components/ui/LoadingScreen';
import ButtonLink from 'components/navigation/ButtonLink';

import ProjectTasks from './ProjectTasks';
import ProjectDetails from './ProjectDetails';

import './project-detail.scss';

export interface Params {
    projectId: string;
}

export default function ProjectDetail() {
    const [project, setProject] = useState<Project>();
    const [tabs, setTabs] = useState<Tab[]>([]);
    const history = useHistory();

    const { projectId } = useParams<Params>();
    sessionStorage.setItem('task-return-location', `/projects/${projectId}/tasks`);
    
    useEffect(() => {
        getProject(projectId).then((project) => {
            setProject(project);
            setTabs([
                {
                    label: 'Details',
                    route: ['/projects/' + projectId, '/projects/' + projectId + '/stats/:time'],
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

    const onStatusChange = useCallback((status: Status) => {
        if (project) {
            updateProject(project.id, {
                status: status,
            }).then(() => {
                setProject({
                    ...project,
                    status: status
                });
            });
        }
    }, [project]);

    if (project) {
        return (
            <div className={'project-detail-page theme-' + project.color}>
                <Link className="material-icons back-btn" to="/projects" >
                    arrow_back
                </Link>
                <div className="content-container">
                    <EditableTag
                        label={project.status}
                        color={StatusColors.get(project.status)}
                        possible={Object.values(Status)}
                        onChange={onStatusChange}
                    />
                    <h1>{project.name}</h1>
                    <div className="description-container">
                        <LongText text={project.text} />
                    </div>
                    <ButtonLink href={`/projects/${project.id}/edit`} className="expanded">
                        Edit
                    </ButtonLink>
                    {
                        tabs
                            ? <Tabs tabs={tabs} />
                            : <LoadingScreen />
                    }
                </div>
            </div>
        )
    }
    return <LoadingScreen />
}

