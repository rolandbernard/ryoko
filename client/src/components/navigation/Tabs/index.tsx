
import { ReactNode } from 'react';
import { NavLink, Route, matchPath } from 'react-router-dom';

import './tabs.scss';

export interface Tab {
    label: string;
    route: string | string[];
    link?: string;
    component: ReactNode
}

interface Props {
    tabs: Tab[]
}

/**
 * This component implements a tab navigation. The tabs given in the tabs property will be visible
 * at the top as links that can be used to switch content in the bottom. The tabs are selected using
 * react router routes.
 */
export default function Tabs({ tabs }: Props) {
    return (
        <>
            <nav className="tabs-container">
                {tabs.map((tab) => (
                    <NavLink
                        key={tab.label}
                        className="tab"
                        activeClassName="active"
                        to={tab.link ?? (typeof tab.route === 'string' ? tab.route : tab.route[0])}
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

