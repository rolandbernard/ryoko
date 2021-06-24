
import { NavLink } from 'react-router-dom';

import './navigation.scss';

/**
 * This component implements the bottom navigation that is visible on the mobile version of the
 * application. It contains three links to the task, project and team pages.
 */
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

