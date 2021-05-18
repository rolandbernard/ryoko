import './project-tasks.scss';
import TaskList from 'components/layout/TaskList';
import { Priority, Status } from 'adapters/task';
import { useState } from 'react';
import Filter from 'components/helpers/Filter';

export default function ProjectTasks() {
    const [filter, setFilter] = useState({ term: '', items: [''] });
    const task = {
        id: 'asdf',
        priority: Priority.HIGH,
        status: Status.CLOSED,
        dependencies: ['test'],
        assigned: [{ user: 'test', time: 30, finished: false }],
        requirements: [{ role: 'test', time: 20 }],
        created: new Date(),
        edited: new Date(),

        project: 'asdf',

        name: 'Create API Routes',
        icon: '🌎',
        text: 'Create the API routes and implement them into the FrontEnd, by adding them into the controls.'
    }
    return (
        <div className="project-tasks">
            {/*<Filter setFilter={setFilter} />*/}
            <TaskList tasks={[task, task, task]} />
        </div>
    )
}