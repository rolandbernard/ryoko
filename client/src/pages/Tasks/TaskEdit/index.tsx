import { getProject, Project } from "adapters/project";
import { getTask, Priority, Status, Task, TaskAssignment, TaskRequirement, updateTask } from "adapters/task";
import TaskForm from "components/forms/TaskForm";
import { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";

interface Params {
    taskId: string;
}

export default function TaskEdit() {
    const { taskId } = useParams<Params>();
    const [task, setTask] = useState<Task>();
    const [project, setProject] = useState<Project>();
    const [error, setError] = useState('');
    const history = useHistory();

    useEffect(() => {
        getTask(taskId).then((task) => {
            setTask(task);
            getProject(task.project).then((project) => {
                setProject(project);
            })
        })

    }, [taskId])
    const handleSubmit = useCallback(async (name: string, text: string, icon: string, priority: Priority, dependencies: string[], requirements: TaskRequirement[], assignees: TaskAssignment[], status?: Status) => {
        try {
            let addedDependencies: string[] = dependencies;
            addedDependencies.filter((dep) => task?.dependencies.indexOf(dep) === -1);
            let removedDependencies: string[] = task?.dependencies ?? [];
            removedDependencies.filter((dep) => dependencies.indexOf(dep) === -1);

            let addedRequirements: TaskRequirement[] = requirements;
            addedRequirements.filter((req) => task?.requirements.indexOf(req) === -1);
            let removedRequirementsTemp: TaskRequirement[] = task?.requirements ?? [];
            removedRequirementsTemp.filter((req) => requirements.indexOf(req) === -1);
            let removedRequirements: string[] = removedRequirementsTemp.map((req) => req.role);

            let addedAssignees: TaskAssignment[] = assignees;
            addedAssignees.filter((assignee) => task?.assigned.indexOf(assignee) === -1);
            let removedAssigneesTemp: TaskAssignment[] = task?.assigned ?? [];
            removedAssigneesTemp.filter((assignee) => assignees.indexOf(assignee) === -1);
            let removedAssignees: string[] = removedAssigneesTemp.map((assignee) => assignee.user);

            await updateTask(taskId, {
                name,
                text,
                icon,
                priority,
                status,
                remove_dependencies: removedDependencies,
                add_dependencies: addedDependencies,
                add_assigned: addedAssignees,
                remove_assigned: removedAssignees,
                add_requirements: addedRequirements,
                remove_requirements: removedRequirements
            });

            history.push('/tasks/' + taskId);
        } catch (e) { }
    }, [history, taskId, task]);

    if (task && project) {
        return (
            <div className="task-edit-page">
                <div className="content-container">
                    <h1>Edit your task</h1>
                    <TaskForm project={project} task={task} onSubmit={handleSubmit} />
                </div>
            </div>
        )

    } else {
        return <>Loading</>
    }
}