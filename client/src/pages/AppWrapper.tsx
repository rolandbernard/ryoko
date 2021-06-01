
import { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from 'components/navigation/Header';

const Tasks = lazy(() => import('pages/Tasks'));
const TaskDetail = lazy(() => import('pages/Tasks/TaskDetail'));
const TaskStart = lazy(() => import('pages/Tasks/TaskStart'));
const ProjectDetail = lazy(() => import('pages/Projects/ProjectDetail'));
const ProjectCreate = lazy(() => import('pages/Projects/ProjectCreate'));
const TaskCreate = lazy(() => import('pages/Tasks/TaskCreate'));
const TaskEdit = lazy(() => import('pages/Tasks/TaskEdit'));
const ProjectEdit = lazy(() => import('pages/Projects/ProjectEdit'));
const Projects = lazy(() => import('pages/Projects'));
const Stats = lazy(() => import('pages/Stats'));
const TeamsEdit = lazy(() => import('pages/Teams/TeamsEdit'));
const Teams = lazy(() => import('pages/Teams'));
const TeamsCreate = lazy(() => import('pages/Teams/TeamsCreate'));
const Settings = lazy(() => import('pages/Settings'));

export default function AppWrapper() {
    return (
        <Header>
            <Suspense fallback={false}>
                <Switch>
                    <Route path="/tasks/:taskId/start" component={TaskStart} />
                    <Route path="/tasks/:taskId/edit" component={TaskEdit} />
                    <Route path="/tasks/:taskId" component={TaskDetail} />
                    <Route path="/tasks" exact component={Tasks} />
                    <Route path="/projects/create" component={ProjectCreate} />
                    <Route path="/projects/:projectId/tasks/create" component={TaskCreate} />
                    <Route path="/projects/:projectId/edit" component={ProjectEdit} />
                    <Route path="/projects/:projectId" component={ProjectDetail} />
                    <Route path="/projects" component={Projects} />
                    <Route path="/stats" component={Stats} />
                    <Route path="/settings" component={Settings} />
                    <Route path="/teams/create" exact component={TeamsCreate} />
                    <Route path="/teams/:teamId/edit" exact component={TeamsEdit} />
                    <Route path={['/teams/:teamId', '/teams']} component={Teams} />
                </Switch>
            </Suspense>
        </Header>
    );
}

