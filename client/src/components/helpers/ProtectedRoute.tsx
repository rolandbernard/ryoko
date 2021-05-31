
import { useEffect, useState } from 'react';
import { Route, RouteProps, useHistory } from 'react-router-dom';

import { isLoggedIn } from 'adapters/auth';
import { getTeams, Team } from 'adapters/team';

import LoadingScreen from 'components/ui/LoadingScreen';

export default function ProtectedRoute(props: RouteProps) {
    const history = useHistory();
    const [team, setTeam] = useState<Team[]>();

    if (!isLoggedIn()) {
        history.push('/login');
    }

    useEffect(() => {
        getTeams().then((teams) => {
            setTeam(teams);
        }).catch(() => {

        });
    }, [])

    if (team && isLoggedIn()) {
        if (team.length === 0) {
            history.push('/introduction');
        } else {
            return <Route {...props} />
        }
    }
    return (
        <LoadingScreen />
    );
}

