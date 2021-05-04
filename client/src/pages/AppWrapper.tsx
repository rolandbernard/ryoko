
import { Suspense, lazy } from 'react';

import ProtectedRoute from 'components/helpers/ProtectedRoute';
import Header from 'components/navigation/Header';

const Tasks = lazy(() => import('pages/Tasks'));
const TaskDetail = lazy(() => import('pages/Tasks/TaskDetail'));
const Projects = lazy(() => import('pages/Projects'));
const Stats = lazy(() => import('pages/Stats'));
const TeamsEdit = lazy(() => import('pages/Teams/TeamsEdit'));
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
                <ProtectedRoute path="/teams/:uuid/edit" component={TeamsEdit} />
                <ProtectedRoute path={["/teams", "/teams/:tab"]} exact component={Teams} />
                <ProtectedRoute path="/settings" component={Settings} />
            </Suspense>
        </Header>
        <div className="background-container">
            <div className="bubble primary" style={{ top: '-20%', right: '-20%' }}></div>
            <div className="bubble secondary" style={{ bottom: '-20%', left: '20%' }}></div>
        </div>
    </>);
}

