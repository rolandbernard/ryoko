
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const Home = lazy(() => import('pages/Home'));
const Login = lazy(() => import('pages/Login'));

export default function App() {
    return (
        <Router>
            <Suspense fallback={false}>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/" component={Home} />
                </Switch>
            </Suspense>
        </Router>
    );
}

