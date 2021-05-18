import { getProject, Project, updateProject } from 'adapters/project';
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
    }, []);
    const handleSubmit = useCallback(async (teams: string[], name: string, text: string, color: string, deadline?: Date) => {
        try {
            /*if (await updateProject({ teams, name, text, color, deadline })) {
                history.push('/projects');
            } else {
                setError('There was an error with your registration. Please try again!');
            }*/
        } catch (e) { }
    }, [history]);

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