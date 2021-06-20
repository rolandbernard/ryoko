
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import AppWrapper from 'pages/AppWrapper';
import LoginRoute from 'components/helpers/LoginRoute';
import ProtectedRoute from 'components/helpers/ProtectedRoute';

const Landing = lazy(() => import('pages/Landing'));
const Login = lazy(() => import('pages/Login'));
const Register = lazy(() => import('pages/Register'));
const Introduction = lazy(() => import('pages/Introduction'));

export default function App() {
    return (
        <Router>
            <Suspense fallback={false}>
                <Switch>
                    <LoginRoute path="/login" component={Login} />
                    <LoginRoute path="/register" component={Register} />
                    <Route path="/introduction" component={Introduction} />
                    <ProtectedRoute path={['/tasks', '/projects', '/stats', '/teams', '/settings']} component={AppWrapper} />
                    <Route path="/" component={Landing} />
                </Switch>
            </Suspense>
        </Router>
    );
}

