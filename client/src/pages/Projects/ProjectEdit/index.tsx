
import { Link } from 'react-router-dom';
import { useHistory, useParams } from 'react-router';
import { useCallback, useEffect, useState } from 'react';

import { Status } from 'adapters/common';
import { getProject, Project, updateProject } from 'adapters/project';

import Callout from 'components/ui/Callout';
import ProjectForm from 'components/forms/ProjectForm';
import LoadingScreen from 'components/ui/LoadingScreen';

interface Params {
    projectId: string;
}

export default function ProjectEdit() {
    const [project, setProject] = useState<Project>();
    const [error, setError] = useState('');
    const history = useHistory();

    const { projectId } = useParams<Params>();

    useEffect(() => {
        getProject(projectId).then((project) => {
            setProject(project);
        }).catch(() => {
            history.goBack();
        });
    }, [history, projectId]);

    const handleSubmit = useCallback(async (teams: string[], name: string, text: string, color: string, status?: Status, deadline?: string) => {
        try {
            if (project) {
                let removedTeams = project.teams, addedTeams = teams;
                removedTeams.filter((teamId) => teams.indexOf(teamId) === -1);
                addedTeams.filter((teamId) => project.teams.indexOf(teamId) === -1);
                await updateProject(project.id, {
                    remove_teams: removedTeams,
                    add_teams: addedTeams,
                    name: name,
                    text, color,
                    status: status,
                    deadline: deadline?.toString()
                });
                history.push(`/projects/${project.id}`);
            }
        } catch (e) {
            setError('There was an error with updating your project. Please try again!');
        }
    }, [history, project]);

    return (
        project
            ? (
                <div className={'project-create-page theme-' + project.color}>
                    <Link className="material-icons back-btn" to={`/projects/${projectId}`} >
                        arrow_back
                    </Link>
                    <div className="content-container">
                        <h1>Edit the project {project.name}</h1>
                        {error && <Callout message={error} />}
                        <ProjectForm onSubmit={handleSubmit} project={project} />
                    </div>
                </div>
            )
            : <LoadingScreen />
    );
}

