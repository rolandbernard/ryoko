
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { isLoggedIn } from 'adapters/api';

const Home = lazy(() => import('pages/Home'));
const Login = lazy(() => import('pages/Login'));
const Register = lazy(() => import('pages/Register'));
const Tasks = lazy(() => import('pages/Tasks'));
const Navigation = lazy(() => import('components/ui/Navigation'));

export default function App() {
    return (
        <Router>
            <Suspense fallback={false}>
                {isLoggedIn() && <Navigation />}
                <Switch>
                    {!isLoggedIn() && <Route path="/register" component={Register} />}
                    {!isLoggedIn() && <Route exact path="/" component={Home} />}
                    {!isLoggedIn() && <Route path="/" component={Login} />}
                    <Route path="/" component={Tasks} />
                </Switch>
            </Suspense>
        </Router>
    );
}

