
import { Status } from 'adapters/common';

import Project from 'components/ui/Project';

import './about-app.scss';

export default function AboutApp() {
    return (
        <section className="about-app-section content-container">
            <div className="text-container">
                <h2 className="left">Plan your projects like a journey!</h2>
                <p className="lead">
                    Do you want to boost your productivity and agility of your
                    development?
                </p>
                <p>
                    With ryoko you are able to effectively plan your tasks
                    and manage your projects. It is build with developers in mind and
                    facilitates effective collaboration.
                </p>
            </div>
            <div className="preview-container">
                <div className="project-overview">
                    <div className="small-1">
                        <Project demo project={{
                            id: '55',
                            name: 'Travel app',
                            text: 'xxx',
                            color: 'red',
                            status: Status.OPEN,
                            deadline: new Date(),
                            teams: [],
                        }} />
                    </div>
                    <div className="small-2">
                        <Project demo project={{
                            id: '5',
                            name: 'Shopping List',
                            text: 'xxx',
                            color: 'orange',
                            status: Status.SUSPENDED,
                            deadline: new Date(),
                            teams: [],
                        }} />
                    </div>
                    <div className="large">
                        <Project demo large project={{
                            id: '93',
                            name: 'Redesign App',
                            text: 'xxx',
                            color: 'blue',
                            status: Status.CLOSED,
                            deadline: new Date(),
                            teams: [],
                        }} />
                    </div>
                </div>
            </div>
        </section>
    )
}

