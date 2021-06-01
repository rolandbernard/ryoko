
import { ReactNode } from 'react';
import { NavLink, Route, matchPath } from 'react-router-dom';

import './tabs.scss';

export interface Tab {
    label: string;
    route: string;
    link?: string;
    component: ReactNode
}

interface Props {
    tabs: Tab[]
}

export default function Tabs({ tabs }: Props) {
    return (
        <>
            <nav className="tabs-container">
                {tabs.map((tab) => (
                    <NavLink
                        key={tab.label}
                        className="tab"
                        activeClassName="active"
                        to={tab.link ?? tab.route}
                        isActive={(_, location) =>
                            matchPath(location.pathname, { path: tab.route, exact: true })
                                ? true
                                : false
                        }
                    >
                        {tab.label}
                    </NavLink>
                ))}
                <div className="background"></div>
            </nav>
            {
                tabs.map((tab) => (
                    <Route exact key={tab.label} path={tab.route} render={() => (tab.component)} />
                ))
            }
        </>
    );
}

