
import { useEffect } from 'react';
import { Route, RouteProps, useHistory } from 'react-router-dom';

import { isLoggedIn } from 'adapters/auth';

/**
 * This is a helper component that wrapped a react router route. The route is only
 * accessible if the user is not logged in. Otherwise, the user will be redirected
 * to the task page.
 * 
 * @param props The properties to give to the actual react route
 */
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

    return <Route {...props} />;
}

