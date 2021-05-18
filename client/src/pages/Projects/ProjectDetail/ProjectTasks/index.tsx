import './project-tasks.scss';
import TaskList from 'components/layout/TaskList';
import { Priority, Status, Task } from 'adapters/task';
import { useEffect, useState } from 'react';
import Filter from 'components/helpers/Filter';
import { getProjectTasks, Project } from 'adapters/project';

interface Props {
    project: Project
}

export default function ProjectTasks({ project }: Props) {
    const [filter, setFilter] = useState({ term: '', items: [''] });
    const [tasks, setTasks] = useState<Task[]>([]);


    useEffect(() => {
        getProjectTasks(project.id)
            .then((tasks) => setTasks(tasks));
    }, []);
    return (
        <div className="project-tasks">
            {/*<Filter setFilter={setFilter} />*/}
            <TaskList tasks={tasks} addButton />
        </div>
    )
}