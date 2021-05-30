
import { NavLink } from 'react-router-dom';

import './navigation.scss';

export default function Navigation() {
    return (
        <nav className="site-nav">
            <NavLink to="/tasks" activeClassName="active" className="nav-link">
                <span className="icon material-icons-outlined">
                    task
                </span>
                <span className="label">Tasks</span>
            </NavLink>
            <NavLink to="/projects" activeClassName="active" className="nav-link">
                <span className="icon material-icons-outlined">
                    folder
                </span>
                <span className="label">Projects</span>
            </NavLink>
            <NavLink to="/teams" activeClassName="active" className="nav-link">
                <span className="icon material-icons-outlined">
                    people
                </span>
                <span className="label">Teams</span>
            </NavLink>
        </nav>
    );
}

