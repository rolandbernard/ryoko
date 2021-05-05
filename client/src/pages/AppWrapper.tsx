
import { Suspense, lazy } from 'react';

import ProtectedRoute from 'components/helpers/ProtectedRoute';
import Header from 'components/navigation/Header';

const Tasks = lazy(() => import('pages/Tasks'));
const TaskDetail = lazy(() => import('pages/Tasks/TaskDetail'));
const Projects = lazy(() => import('pages/Projects'));
const Stats = lazy(() => import('pages/Stats'));
const TeamsEdit = lazy(() => import('pages/Teams/TeamsEdit'));
const TeamsStats = lazy(() => import('pages/Teams/TeamsStats'));
const TeamsMembers = lazy(() => import('pages/Teams/TeamsMembers'));
const Teams = lazy(() => import('pages/Teams'));
const Settings = lazy(() => import('pages/Settings'));


export default function AppWrapper() {
    return (
        <Header>
            <Suspense fallback={false}>
                <ProtectedRoute path="/tasks/:uuid" component={TaskDetail} />
                <ProtectedRoute path="/tasks" exact component={Tasks} />
                <ProtectedRoute path="/projects" component={Projects} />
                <ProtectedRoute path="/stats" component={Stats} />
                <ProtectedRoute path="/team/:uuid/edit" component={TeamsEdit} />
                <ProtectedRoute path="/teams" component={Teams} />
                <ProtectedRoute path="/teams/stats" component={TeamsStats} />
                <ProtectedRoute path="/teams/members" component={TeamsMembers} />
                <ProtectedRoute path="/settings" component={Settings} />
            </Suspense>
        </Header>
        );
}

