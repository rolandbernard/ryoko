
import { Suspense, lazy } from 'react';

import ProtectedRoute from 'components/helpers/ProtectedRoute';
import Header from 'components/ui/Header';

const Tasks = lazy(() => import('pages/Tasks'));
const TaskDetail = lazy(() => import('pages/Tasks/TaskDetail'));
const Projects = lazy(() => import('pages/Projects'));
const Stats = lazy(() => import('pages/Stats'));
const Teams = lazy(() => import('pages/Teams'));
const Settings = lazy(() => import('pages/Settings'));

export default function AppWrapper() {
    return (<>
        <Header>
            <Suspense fallback={false}>
                <ProtectedRoute path="/tasks/:uuid" component={TaskDetail} />
                <ProtectedRoute path="/tasks" exact component={Tasks} />
                <ProtectedRoute path="/projects" component={Projects} />
                <ProtectedRoute path="/stats" component={Stats} />
                <ProtectedRoute path="/teams" component={Teams} />
                <ProtectedRoute path="/settings" component={Settings} />
            </Suspense>
        </Header>
    </>);
}

