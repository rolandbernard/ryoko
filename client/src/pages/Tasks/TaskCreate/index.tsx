
import { Link } from "react-router-dom";
import { useHistory, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";

import { getProject, Project } from "adapters/project";
import { createTask, Priority, TaskAssignment, TaskRequirement } from "adapters/task";

import Callout from "components/ui/Callout";
import TaskForm from 'components/forms/TaskForm';
import LoadingScreen from "components/ui/LoadingScreen";

interface Params {
    projectId: string;
}

/**
 * This page should allow the user to create a new task by requesting all required information.
 */
export default function TaskCreate() {
    const [error, setError] = useState('');
    const [project, setProject] = useState<Project>();
    const history = useHistory();

    const { projectId } = useParams<Params>();

    useEffect(() => {
        getProject(projectId).then((project) => setProject(project));
    }, [projectId]);

    const handleSubmit = useCallback(
        async (
            name: string,
            text: string,
            icon: string,
            priority: Priority,
            dependencies: string[],
            requirements: TaskRequirement[],
            assignees: TaskAssignment[]
        ) => {
            try {
                try {
                    const id = await createTask({
                        project: projectId,
                        name: name,
                        text: text,
                        icon: icon,
                        priority: priority,
                        dependencies: dependencies,
                        requirements: requirements,
                        assigned: assignees
                    });
                    history.push(`/tasks/${id}`);
                } catch (e) {
                    setError('There was an error with creating your project. Please try again!');
                }
            } catch (e) { }
        },
        [history, projectId]
    );

    return (
        project
            ? (
                <div className={'task-create-page theme-' + project.color}>
                    <Link className="material-icons back-btn" to={`/projects/${projectId}/tasks`} >
                        arrow_back
                    </Link>
                    <div className="content-container">
                        <h1>Create a new task</h1>
                        {error && <Callout message={error} />}
                        <p>
                            Create a new task in <strong>{project.name}</strong>
                        </p>
                        {
                            project
                                && <TaskForm onSubmit={handleSubmit} project={project} />
                        }
                    </div>
                </div>
            )
            : <LoadingScreen />
    );
}

