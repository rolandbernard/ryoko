

import { useEffect, useState } from 'react';

import { Status, StatusColors } from 'adapters/common';
import { getProjectTasks, Project } from 'adapters/project';
import { Task } from 'adapters/task';

import Filter from 'components/helpers/Filter';
import TaskList from 'components/layout/TaskList';
import LoadingScreen from 'components/ui/LoadingScreen';

import './project-tasks.scss';

interface Props {
    project: Project
}

export default function ProjectTasks({ project }: Props) {
    const [filter, setFilter] = useState({ term: '', tags: Object.values(Status) });
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [shownTasks, setShownTasks] = useState<Task[]>();

    useEffect(() => {
        getProjectTasks(project.id).then(setAllTasks);
    }, [project]);

    useEffect(() => {
        setShownTasks(allTasks.filter(task => (
            task.name.toLowerCase().includes(filter.term.toLowerCase())
            && filter.tags.includes(task.status)
        )));
    }, [filter, allTasks])

    return (
        <div className="project-tasks">
            <Filter
                setFilter={setFilter}
                tags={
                    Object.values(Status).map(status => ({
                        label: status,
                        color: StatusColors.get(status.toString()),
                    }))
                }
                filter={filter}
            />
            {
                shownTasks
                    ? <TaskList tasks={shownTasks} addButton />
                    : <LoadingScreen />
            }
        </div>
    )
}

