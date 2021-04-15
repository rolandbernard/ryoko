
import { ComponentType } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isLoggedIn } from 'adapters/api';

interface Props {
    path: string,
    exact?: boolean,
    component: ComponentType<any>
}
export default function ProtectedRoute({ path, exact, component }: Props) {
    if (isLoggedIn()) {
        return (
            <Route path={path} exact={exact} component={component} />
        );
    }
    return (
        <Redirect to="/login" />
    );
}