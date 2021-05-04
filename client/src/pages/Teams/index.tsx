import './teams.scss';
import Page from 'components/ui/Page';
import DetailGrid from 'components/ui/DetailGrid';
import ButtonLink from 'components/navigation/ButtonLink';

export default function Teams() {
    const teamDetails = [{
        icon: 'group',
        title: 'Member',
        number: 2
    }, {
        icon: 'folder',
        title: 'Projects',
        number: 3
    }]
    return (
        <Page className="teams-page">
            <div className="content-container">
                <h1 className="underlined">Teams</h1>
                <DetailGrid details={teamDetails} />
                <ButtonLink href="/teams/uuid/edit" routing={true} className="expanded">
                     Edit
                </ButtonLink>
            </div>
        </Page>
    )
}