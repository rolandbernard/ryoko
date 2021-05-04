import './teams.scss';
import Page from 'components/ui/Page';
import DetailGrid from 'components/ui/DetailGrid';
import ButtonLink from 'components/navigation/ButtonLink';
import Tabs from 'components/navigation/Tabs';
import { useParams } from 'react-router';

interface Params {
    tab: string
}

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
        route: '/teams',
        label: 'Members',
    }, {
        route: '/teams/stats',
        label: 'Stats'
    }];

    const {tab} = useParams<Params>();


    return (
        <Page className="teams-page">
            <div className="content-container">
                <h1 className="underlined">Teams</h1>
                <DetailGrid details={teamDetails} />
                <ButtonLink href="/teams/uuid/edit" routing={true} className="expanded">
                    Edit
                </ButtonLink>
                <Tabs tabs={tabs} />
                {!tab && (<h2>Members</h2>)}
                {tab === "stats" && (<h2>Stats</h2>)}
            </div>
        </Page>
    )
}