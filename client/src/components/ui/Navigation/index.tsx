import { NavLink } from 'react-router-dom';

import './navigation.scss';
import background from 'images/svg/nav-bg.svg';


export default function Navigation() {
    return (
        <nav className="site-nav">
            <img src={background} alt="Background" className="background" />
            <NavLink to="/tasks" activeClassName="active" className="nav-link">
                <span className="icon material-icons-outlined">
                    home
                </span>
                <span className="label">Home</span>
            </NavLink>
            <NavLink to="/projects" activeClassName="active" className="nav-link">
                <span className="icon material-icons-outlined">
                    public
                </span>
                <span className="label">Projects</span>
            </NavLink>
            <NavLink to="/stats" activeClassName="active" className="nav-link">
                <span className="icon material-icons-outlined">
                    public
                </span>
                <span className="label">Stats</span>
            </NavLink>
        </nav>
    );
}