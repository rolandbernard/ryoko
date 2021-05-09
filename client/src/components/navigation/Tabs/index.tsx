import { NavLink, RouteProps, Route } from 'react-router-dom';
import './tabs.scss';

interface Tab extends RouteProps {
    label: string;
    routePath?: string;
}

interface Props {
    tabs: Tab[]
}

export default function Tabs({ tabs }: Props) {

    return (
        <>
            <nav className="tabs-container">
                {tabs.map((tab) => (
                    <NavLink key={tab.label} className="tab" exact activeClassName="active" to={{ pathname: tab.path?.toString() }}>
                        {tab.label}
                    </NavLink>
                ))}
                <div className="background"></div>
            </nav>
            {
                tabs.map((tab) => (
                    <Route exact key={tab.label} {...tab} path={tab.routePath ?? tab.path} />
                ))
            }
        </>
    );
}