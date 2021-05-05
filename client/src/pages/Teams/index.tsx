import './teams.scss';
import Page from 'components/ui/Page';
import DetailGrid from 'components/ui/DetailGrid';
import ButtonLink from 'components/navigation/ButtonLink';
import Tabs from 'components/navigation/Tabs';

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
        route: '/teams/members',
        label: 'Members',
    }, {
        route: '/teams/stats',
        label: 'Stats'
    }];

    return (
        <div className="teams-page">
            <div className="content-container">
                <h1 className="underlined">Teams</h1>
                <DetailGrid details={teamDetails} />
                <ButtonLink href="/teams/uuid/edit" routing={true} className="expanded">
                    Edit
                </ButtonLink>
                <Tabs tabs={tabs} />
            </div>
        </div>
    )
}