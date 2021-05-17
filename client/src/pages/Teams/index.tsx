import './teams.scss';
import DetailGrid from 'components/layout/DetailGrid';
import ButtonLink from 'components/navigation/ButtonLink';
import Tabs, { Tab } from 'components/navigation/Tabs';
import Dropdown, { DropDownItem } from 'components/navigation/Dropdown';
import TeamsMembers from './TeamsMembers';
import TeamsStats from './TeamsStats';
import { useEffect, useState } from 'react';
import { getTeamMembers, getTeamProjects, getTeams, Team } from 'adapters/team';
import { DetailProps } from 'components/ui/DetailBox';
import { useHistory, useParams } from 'react-router';

export interface Params {
    teamId: string;
}


export default function Teams() {
    const { teamId } = useParams<Params>();
    const history = useHistory();
    const [allTeams, setTeams] = useState<Team[]>();
    const [currentTeam, setCurrentTeam] = useState<Team>();
    const [details, setDetails] = useState<DetailProps[]>([]);
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [pageLinks, setPageLinks] = useState<DropDownItem[]>([]);


    useEffect(() => {
        getTeams().then((teams) => {
            //if no team is defined, take the first one
            if (!teamId && teams[0]) {
                history.push('/teams/' + teams[0].id);
            }
            setTeams(teams);
            setCurrentTeam(teams.find(team => team.id === teamId));
        }).catch(() => { });
    }, [teamId, history]);

    useEffect(() => {
        if (currentTeam && allTeams) {
            getTeamProjects(currentTeam.id).then((projects) => {
                setDetails((state) => state
                    .filter(detail => detail.title !== 'Projects')
                    .concat({
                        icon: 'folder',
                        title: 'Projects',
                        number: projects.length
                    }));
            });
            getTeamMembers(currentTeam.id).then((members) => {
                setDetails((state) => state
                    .filter(detail => detail.title !== 'Members')
                    .concat({
                        icon: 'group',
                        title: 'Members',
                        number: members.length
                    }));

                setTabs([{
                    route: '/teams/' + currentTeam.id,
                    label: 'Members',
                    component: (<TeamsMembers members={members} team={currentTeam} />)
                }, {
                    route: '/teams/' + currentTeam.id + '/stats',
                    label: 'Stats',
                    component: <TeamsStats />
                }]);

            });

            //update Tabs link
            setPageLinks(allTeams.filter(team => currentTeam.id !== team.id).map(team => {
                return {
                    route: '/teams/' + team.id,
                    label: team.name,
                }
            }));
        }
    }, [currentTeam, allTeams])

    return (
        <div className="teams-page">
            <div className="content-container">
                <h1 className="underlined">Teams</h1>
                {
                    allTeams && (
                        <Dropdown items={pageLinks}>
                            <h2>{currentTeam?.name}</h2>
                            <span className="material-icons icon">
                                expand_more
                            </span>
                        </Dropdown>
                    )
                }
                <DetailGrid details={details} />
                <ButtonLink href={'/teams/' + currentTeam?.id + '/edit'} className="expanded">
                    Edit
                </ButtonLink>
                <Tabs tabs={tabs} />
            </div>
        </div>
    )
}