import './teams.scss';
import DetailGrid from 'components/layout/DetailGrid';
import ButtonLink from 'components/navigation/ButtonLink';
import Tabs from 'components/navigation/Tabs';
import Dropdown from 'components/navigation/Dropdown';
import TeamsMembers from './TeamsMembers';
import TeamsStats from './TeamsStats';

export default function Teams() {
    const teamDetails = [{
        icon: 'group',
        title: 'Member',
        number: 2
    }, {
        icon: 'folder',
        title: 'Projects',
        number: 3
    }];

    const tabs = [{
        path: '/teams',
        label: 'Members',
        component: TeamsMembers
    }, {
        path: '/teams/stats',
        label: 'Stats',
        component: TeamsStats
    }];

    const teams = [{
        route: '/teams/members?team=someOther',
        label: 'Some other Team',
    }];
    return (
        <div className="teams-page">
            <div className="content-container">
                <h1 className="underlined">Teams</h1>
                <Dropdown items={teams}>
                    <h2>Ryoko</h2>
                    <span className="material-icons icon">
                        expand_more
                    </span>
                </Dropdown>
                <DetailGrid details={teamDetails} />
                <ButtonLink href="/teams/uuid/edit" className="expanded">
                    Edit
                </ButtonLink>
                <Tabs tabs={tabs} />
            </div>
        </div>
    )
}