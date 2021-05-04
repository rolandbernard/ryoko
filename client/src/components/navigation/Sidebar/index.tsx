import Navigation from 'components/navigation/Navigation';
import avatar from 'images/daniel-planoetscher.jpg';
import LineGraph from 'components/graphs/LineGraph';
import { NavLink, useHistory } from 'react-router-dom';
import { clearToken } from 'adapters/auth';
import './sidebar.scss';

interface Props {
    mobileShown: boolean;
}

export default function Sidebar({ mobileShown }: Props) {

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
                        <img src={avatar} alt="Profile" />
                    </div>
                    <span className="name">Daniel Planötscher</span>
                    <span className="team">ryoko</span>
                </div>
                <Navigation />
                <nav className="secondary-nav">
                    <NavLink to="/stats" className="nav-link">
                        <span className="icon material-icons-outlined">
                            assessment
                        </span>
                        Stats
                    </NavLink>
                    <NavLink to="/settings" className="nav-link">
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