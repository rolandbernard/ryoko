
import { Redirect, Route } from 'react-router-dom';
import { isLoggedIn } from 'adapters/api';
import Navigation from 'components/ui/Navigation';
import Header from 'components/ui/Header';

interface Props {
    path: string,
    exact?: boolean,
    component: JSX.Element
}


export default function ProtectedRoute({ path, exact, component }: Props) {
    console.log(component);


    if (isLoggedIn()) {
        return (
            <Route path={path} exact={exact} render={() =>
                <>
                    <Header />
                    <Navigation />
                    { component }
                </>
            } />
        );
    }
    return (
        <Redirect to="/login" />
    );
}