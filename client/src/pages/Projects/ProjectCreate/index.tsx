import { createProject } from "adapters/project";
import ProjectForm from "components/forms/ProjectForm";
import { useCallback, useState } from "react";
import { useHistory } from "react-router";
import Callout from 'components/ui/Callout';

export default function ProjectCreate() {
    const history = useHistory();
    const [error, setError] = useState('');
    const handleSubmit = useCallback(async (name: string, text: string, color: string, deadline?: Date) => {
        try {
            if (await createProject({ name, text, color, deadline, teams: ['fa68e88a-cee2-43bd-bed2-4d8424f76b51'] })) {
                history.push('/projects');
            } else {
                setError('There was an error with your registration. Please try again!');
            }
        } catch (e) { }
    }, [history]);


    return (
        <div className="project-create-page">
            <div className="content-container">
                <h1>Create a new Project</h1>
                {error && <Callout message={error} />}
                <ProjectForm onSubmit={handleSubmit} />
            </div>
        </div>
    )
}