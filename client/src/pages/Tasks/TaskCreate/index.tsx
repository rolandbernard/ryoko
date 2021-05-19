import { useHistory, useParams } from "react-router";
import TaskForm from 'components/forms/TaskForm';
import { useCallback, useEffect, useState } from "react";
import { createTask, Priority, TaskAssignment, TaskRequirement } from "adapters/task";
import Callout from "components/ui/Callout";
import { getProject, Project } from "adapters/project";

interface Params {
    projectId: string;
}

export default function TaskCreate() {
    const { projectId } = useParams<Params>();
    const history = useHistory();
    const [error, setError] = useState('');
    const [project, setProject] = useState<Project>();

    useEffect(() => {
        getProject(projectId).then((project) => setProject(project));
    }, []);

    const handleSubmit = useCallback(async (name: string, text: string, icon: string, priority: Priority, dependencies: string[], requirements: TaskRequirement[], assignees: TaskAssignment[]) => {
        try {
            if (await createTask({ project: projectId, name, text, icon, priority, dependencies, requirements, assigned: assignees  })) {
            history.push('/projects/' + projectId);
            } else {
            setError('There was an error with creating your project. Please try again!');
            }
        } catch (e) { }
    }, [history, projectId]);
    return (
        <div className="task-create-page">
            <div className="content-container">
                <h1>Create a new Task</h1>
                {error && <Callout message={error} />}
                {
                    project &&
                    <TaskForm onSubmit={handleSubmit} project={project} />
                }
            </div>
        </div>
    )


}