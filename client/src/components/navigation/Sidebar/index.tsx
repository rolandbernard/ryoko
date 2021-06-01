
import { NavLink, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { clearToken, isLoggedIn } from 'adapters/auth';
import { getCurrentUser, getUserActivity, User } from 'adapters/user';
import { subtractTime } from 'timely';

import Navigation from 'components/navigation/Navigation';
import Avatar from 'components/ui/Avatar';
import BarChart, { ChartItem, parseActivity } from 'components/graphs/BarChart';
import LoadingScreen from 'components/ui/LoadingScreen';

import './sidebar.scss';

interface Props {
    mobileShown: boolean;
    setMobileShown: Function;
}

export default function Sidebar({ mobileShown, setMobileShown }: Props) {
    const [user, setUser] = useState<User>();
    const [activity, setActivity] = useState<ChartItem[]>();

    useEffect(() => {
        if (isLoggedIn()) {
            getCurrentUser().then(setUser).catch(() => { });
            getUserActivity(subtractTime(new Date(), 1, 'week'))
                .then(parseActivity)
                .then(setActivity);
        }
    }, [])

    const history = useHistory();

    const logout = () => {
        clearToken();
        history.push('/login');
    }

    return (
        <aside className={'site-aside' + (mobileShown ? ' shown' : '')}>
            <div className="top">
                <div className="profile">
                    <Avatar user={user} />
                    <span className="name">{user?.realname ?? user?.username}</span>
                    {user?.realname && <span className="username">{user?.username}</span>}
                </div>
                <Navigation />
                <nav className="secondary-nav">
                    <NavLink to="/stats" className="nav-link" onClick={() => setMobileShown(false)}>
                        <span className="icon material-icons-outlined">
                            assessment
                        </span>
                        Stats
                    </NavLink>
                    <NavLink to="/settings" className="nav-link" onClick={() => setMobileShown(false)}>
                        <span className="icon material-icons-outlined">
                            settings
                        </span>
                        Settings
                    </NavLink>
                    <button className="nav-link" onClick={logout}>
                        <span className="icon material-icons-outlined">
                            logout
                        </span>
                        Logout
                    </button>
                </nav>
            </div>
            {
                activity
                    ? (
                        <div className="stats">
                            <BarChart unit="h" multiplier={1 / 60 / 60 / 1000} data={activity} />
                            <div className="comment">Recent activity</div>
                        </div>
                    )
                    : <LoadingScreen />
            }
        </aside>
    );
}

