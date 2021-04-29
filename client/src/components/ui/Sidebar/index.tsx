import Navigation from 'components/ui/Navigation';
import avatar from 'images/daniel-planoetscher.jpg';
import LineGraph from 'components/graphs/LineGraph';
import { Link, useHistory } from 'react-router-dom';
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
                    <Link to="/team" className="nav-link">
                        Team
                </Link>
                    <Link to="/settings" className="nav-link">
                        Settings
                </Link>
                    <button className="nav-link" onClick={logout}>
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