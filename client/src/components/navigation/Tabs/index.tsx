import { NavLink } from 'react-router-dom';
import './tabs.scss';

interface Tab {
    route: string,
    label: string
}

interface Props {
    tabs: Tab[]
}

export default function Tabs({ tabs }: Props) {
    return (
        <nav className="tabs-container">
            {tabs.map((tab) => (
                <NavLink key={tab.route} className="tab" exact activeClassName="active" to={tab.route}>
                    {tab.label}
                </NavLink>
            ))}
        </nav>
    );
}