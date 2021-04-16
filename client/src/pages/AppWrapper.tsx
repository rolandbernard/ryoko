
import { Suspense, lazy } from 'react';

import ProtectedRoute from 'components/helpers/ProtectedRoute'; 
import Header from 'components/ui/Header';
import Navigation from 'components/ui/Navigation';

const Tasks = lazy(() => import('pages/Tasks'));
const Projects = lazy(() => import('pages/Projects'));
const Stats = lazy(() => import('pages/Stats'));

export default function AppWrapper() {
    return (<>
        <Header />
        <Navigation />
        <Suspense fallback={false}>
            <ProtectedRoute path="/tasks" component={Tasks} />
            <ProtectedRoute path="/projects" component={Projects} />
            <ProtectedRoute path="/stats" component={Stats} />
        </Suspense>
    </>);
}

