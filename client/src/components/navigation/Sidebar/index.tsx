import Navigation from 'components/navigation/Navigation';
import avatar from 'images/daniel-planoetscher.jpg';
import LineGraph from 'components/graphs/LineGraph';
import { NavLink, useHistory } from 'react-router-dom';
import { clearToken } from 'adapters/auth';
import './sidebar.scss';
import { useEffect, useState } from 'react';
import { getCurrentUser, getUserImageUri, User } from 'adapters/user';

interface Props {
    mobileShown: boolean;
    setMobileShown: Function;
}

export default function Sidebar({ mobileShown, setMobileShown }: Props) {
    const [user, setUser] = useState<User>();

    useEffect(() => {
        getCurrentUser().then((user) => {
            setUser(user);
        }).catch(() => { });
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
                    <div className="avatar">
                        <img src={user && getUserImageUri(user.id)} alt="Profile" />
                    </div>
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
            <div className="stats">
                <LineGraph />
                <div className="comment">You are doing well!</div>
            </div>
        </aside>
    );
}