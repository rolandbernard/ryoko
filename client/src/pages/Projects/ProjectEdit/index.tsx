import { getProject, Project, Status, updateProject } from 'adapters/project';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import ProjectForm from 'components/forms/ProjectForm';
import Callout from 'components/ui/Callout';

interface Params {
    projectId: string;
}

export default function ProjectEdit() {
    const { projectId } = useParams<Params>();
    const [project, setProject] = useState<Project>();
    const [error, setError] = useState('');
    const history = useHistory();

    useEffect(() => {
        getProject(projectId).then((project) => {
            setProject(project);
        }).catch(() => {
            history.goBack();
        });
    }, [history, projectId]);
    
    const handleSubmit = useCallback(async (teams: string[], name: string, text: string, color: string, status?: Status, deadline?: Date) => {
        try {

            if (project) {
                let removedTeams = project.teams, addedTeams = teams;
                removedTeams.filter((teamId) => teams.indexOf(teamId) === -1);
                addedTeams.filter((teamId) => project.teams.indexOf(teamId) === -1);

                await updateProject(project.id, { remove_teams: removedTeams, add_teams: addedTeams, name, text, color, status, deadline: deadline?.toString() });
                history.push('/projects');
            }
        } catch (e) {
            setError('There was an error with updating your project. Please try again!');
        }
    }, [history, project]);

    return (
        <div className="project-create-page">
            {
                project ?
                    <div className="content-container">
                        <h1>Edit the project {project?.name}</h1>
                        {error && <Callout message={error} />}
                        <ProjectForm onSubmit={handleSubmit} project={project} />
                    </div> :
                    <h2>Loading...</h2>
            }
        </div>
    )

}