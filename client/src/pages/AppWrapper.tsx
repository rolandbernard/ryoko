
import { Suspense, lazy } from 'react';
import { Switch } from 'react-router-dom';

import ProtectedRoute from 'components/helpers/ProtectedRoute';
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
                    <ProtectedRoute path="/tasks/:taskId/start" component={TaskStart} />
                    <ProtectedRoute path="/tasks/:taskId/edit" component={TaskEdit} />
                    <ProtectedRoute path="/tasks/:taskId" component={TaskDetail} />
                    <ProtectedRoute path="/tasks" exact component={Tasks} />
                    <ProtectedRoute path="/projects/create" component={ProjectCreate} />
                    <ProtectedRoute path="/projects/:projectId/tasks/create" component={TaskCreate} />
                    <ProtectedRoute path="/projects/:projectId/edit" component={ProjectEdit} />
                    <ProtectedRoute path="/projects/:projectId" component={ProjectDetail} />
                    <ProtectedRoute path="/projects" component={Projects} />
                    <ProtectedRoute path="/stats" component={Stats} />
                    <ProtectedRoute path="/settings" component={Settings} />
                    <ProtectedRoute path="/teams/create" exact component={TeamsCreate} />
                    <ProtectedRoute path="/teams/:teamId/edit" exact component={TeamsEdit} />
                    <ProtectedRoute path={['/teams/:teamId', '/teams']} component={Teams} />
                </Switch>
            </Suspense>
        </Header>
    );
}

