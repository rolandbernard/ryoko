
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ProtectedRoute from 'components/helpers/Rerouters/ProtectedRoute'; 
import LoginRoute from 'components/helpers/Rerouters/LoginRoute'; 

const Home = lazy(() => import('pages/Home'));
const Login = lazy(() => import('pages/Login'));
const Register = lazy(() => import('pages/Register'));
const Tasks = lazy(() => import('pages/Tasks'));

export default function App() {
    return (
        <Router>
            <Suspense fallback={false}>
                <Switch>
                    <ProtectedRoute path="/tasks" component={Tasks} />
                    <LoginRoute path="/login" component={Login} />
                    <LoginRoute path="/register" component={Register} />
                    <Route path="/" component={Home} />
                </Switch>
            </Suspense>
        </Router>
    );
}

