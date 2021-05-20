import './project-tasks.scss';
import TaskList from 'components/layout/TaskList';
import { Status, StatusColors } from 'adapters/task';
import { useEffect, useState } from 'react';
import Filter from 'components/helpers/Filter';
import { getProjectTasks, Project } from 'adapters/project';
import { TaskProps } from 'components/ui/Task';
import LoadingScreen from 'components/ui/LoadingScreen';

interface Props {
    project: Project
}

export default function ProjectTasks({ project }: Props) {
    const [filter, setFilter] = useState({ term: '', tags: [] });
    const [allTasks, setAllTasks] = useState<TaskProps[]>([]);
    const [shownTasks, setShownTasks] = useState<TaskProps[]>();

    useEffect(() => {
        getProjectTasks(project.id).then((tasks) => {
            setAllTasks(tasks.map((task) => {
                return {
                    task: task,
                    color: StatusColors.get(task.status),
                    subtitle: task.status
                }
            }))
        });
    }, [project]);

    const allStatus = Object.values(Status).map((status) => {
        return {
            label: status.toString(),
            color: StatusColors.get(status.toString())
        }
    });

    useEffect(() => {
        setShownTasks(allTasks.filter(task => {
            if (!filter.tags.length) {
                return task.task.name.indexOf(filter.term) >= 0;
            } else {
                return task.task.name.indexOf(filter.term) >= 0 && filter.tags.find(tag => tag === task.task.status);
            }
        }
        ));
    }, [filter, allTasks])


    return (
        <div className="project-tasks">
            <Filter setFilter={setFilter} tags={allStatus} filter={filter} />
            {
                shownTasks ?
                    <TaskList tasks={shownTasks} addButton /> :
                    <LoadingScreen />
            }
        </div>
    )
}