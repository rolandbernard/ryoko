import { Route, RouteProps, useHistory } from 'react-router-dom';
import { isLoggedIn } from 'adapters/auth';
import { useEffect } from 'react';
import { getTeams } from 'adapters/team';

export default function ProtectedRoute(props: RouteProps) {
    const history = useHistory();

    useEffect(() => {
        if (!isLoggedIn()) {
            history.push('/login');
        }
    })
    
    useEffect(() => {
        getTeams().then((teams) => {
            if(teams.length <= 0) {
                history.push('/introduction');
            }
        }).catch(() => {
            history.push('/introduction');
        });
    });

    return (
        <Route {...props} />
    );
}

