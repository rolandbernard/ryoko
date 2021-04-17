
import { Route, RouteProps, useHistory } from 'react-router-dom';
import { isLoggedIn } from 'adapters/auth';
import { useEffect } from 'react';

export default function LoginRoute(props: RouteProps) {
    const history = useHistory();
    useEffect(() => {
        if (isLoggedIn()) {
            if (history.length === 0) {
                history.push('/tasks');
            } else {
                history.goBack();
            }
        }
    })
    return (
        <Route {...props} />
    );
}

