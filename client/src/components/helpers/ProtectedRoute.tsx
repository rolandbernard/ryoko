
import { useEffect, useState } from 'react';
import { Route, RouteProps, useHistory } from 'react-router-dom';

import { isLoggedIn } from 'adapters/auth';
import { getTeams } from 'adapters/team';

import LoadingScreen from 'components/ui/LoadingScreen';
import ErrorScreen from 'components/ui/ErrorScreen';

/**
 * This is a helper component that wrapped a react router route. The route is only
 * accessible if the user is currently logged in. Otherwise, the user will be redirected
 * to the login page.
 * 
 * @param props The properties to give to the actual react route
 */
export default function ProtectedRoute(props: RouteProps) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (!isLoggedIn()) {
            history.push('/login');
        }
    });

    useEffect(() => {
        setError(false);
        getTeams().then(teams => {
            if (teams.length === 0) {
                history.push('/introduction');
            } else {
                setLoaded(true);
            }
        }).catch(() => setError(true));
    }, [history, error])

    if (error) {
        return <ErrorScreen
            onReload={() => {
                setError(false);
                setLoaded(false);
            }}
            onGoHome={() => history.push('/')}
        />;
    } else if (loaded) {
        return <Route {...props} />;
    } else {
        return <LoadingScreen />;
    }
}

