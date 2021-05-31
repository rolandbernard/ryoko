
import { useHistory, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";

import { Status } from "adapters/common";
import { getProject, Project } from "adapters/project";
import { getTask, Priority, Task, TaskAssignment, TaskRequirement, updateTask } from "adapters/task";

import TaskForm from "components/forms/TaskForm";
import LoadingScreen from "components/ui/LoadingScreen";

interface Params {
    taskId: string;
}

export default function TaskEdit() {
    const [task, setTask] = useState<Task>();
    const [project, setProject] = useState<Project>();
    const history = useHistory();

    const { taskId } = useParams<Params>();

    useEffect(() => {
        getTask(taskId).then((task) => {
            setTask(task);
            getProject(task.project).then((project) => {
                setProject(project);
            });
        });
    }, [taskId])

    const handleSubmit = useCallback(
        async (
            name: string,
            text: string,
            icon: string,
            priority: Priority,
            dependencies: string[],
            requirements: TaskRequirement[],
            assignees: TaskAssignment[],
            status?: Status
        ) => {
            try {
                await updateTask(taskId, {
                    name: name,
                    text: text,
                    icon: icon,
                    priority: priority,
                    status: status,
                    remove_dependencies: (task?.dependencies ?? []).filter(dep => !dependencies.includes(dep)),
                    add_dependencies: dependencies.filter(dep => task?.dependencies?.includes(dep) === false),
                    remove_assigned: (task?.assigned ?? []).filter(ass => !assignees.includes(ass)).map(ass => ass.user),
                    add_assigned: assignees.filter(ass => task?.assigned?.includes(ass) === false),
                    remove_requirements: (task?.requirements ?? []).filter(req => !requirements.includes(req)).map(req => req.role),
                    add_requirements: requirements.filter(req => task?.requirements?.includes(req) === false),
                });
                history.push('/tasks/' + taskId);
            } catch (e) {
                // TODO: output error
            }
        },
        [history, taskId, task]
    );

    return (
        (task && project)
            ? (
                <div className="task-edit-page">
                    <span className="material-icons back-btn" onClick={history.goBack} >
                        arrow_back
                    </span>
                    <div className="content-container">
                        <h1>Edit your task</h1>
                        <TaskForm project={project} task={task} onSubmit={handleSubmit} />
                    </div>
                </div>
            )
            : <LoadingScreen />
    );
}

