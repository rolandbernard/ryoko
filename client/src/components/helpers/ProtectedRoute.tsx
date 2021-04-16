
import { Route, RouteProps, useHistory } from 'react-router-dom';
import { isLoggedIn } from 'adapters/api';
import { useEffect } from 'react';

export default function ProtectedRoute(props: RouteProps) {
    const history = useHistory();
    useEffect(() => {
        if (!isLoggedIn()) {
            history.push('/login');
        }
    })
    return (
        <Route {...props} />
    );
}

