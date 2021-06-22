
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { useCallback, useState } from "react";

import { createProject } from "adapters/project";
import { Status } from "adapters/common";

import Callout from 'components/ui/Callout';
import ProjectForm from "components/forms/ProjectForm";

export default function ProjectCreate() {
    const [error, setError] = useState('');
    const history = useHistory();

    const handleSubmit = useCallback(async (teams: string[], name: string, text: string, color: string, _status?: Status, deadline?: string) => {
        try {
            const id = await createProject({ teams, name, text, color, deadline });
            history.push(`/projects/${id}`);
        } catch (e) {
            setError('There was an error with creating your project. Please try again!');
        }
    }, [history]);

    return (
        <div className="project-create-page">
            <Link className="material-icons back-btn" to="/projects" >
                arrow_back
            </Link>
            <div className="content-container">
                <h1>Create a new Project</h1>
                {error && <Callout message={error} />}
                <ProjectForm onSubmit={handleSubmit} />
            </div>
        </div>
    )
}

