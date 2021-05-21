import './teams.scss';
import DetailGrid from 'components/layout/DetailGrid';
import ButtonLink from 'components/navigation/ButtonLink';
import Button from 'components/ui/Button';
import Tabs, { Tab } from 'components/navigation/Tabs';
import Dropdown, { DropDownItem } from 'components/navigation/Dropdown';
import TeamsMembers from './TeamsMembers';
import TeamsStats from './TeamsStats';
import { useCallback, useEffect, useState } from 'react';
import { getTeamMembers, getTeamProjects, getTeams, leaveTeam, Team } from 'adapters/team';
import { DetailProps } from 'components/ui/DetailBox';
import { useHistory, useParams } from 'react-router';
import LoadingScreen from 'components/ui/LoadingScreen';

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
            if ((!teamId && teams[0]) || !teams.find(team => team.id === teamId)) {
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
                    component: <TeamsStats teamId={currentTeam.id} />
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
    }, [currentTeam, allTeams]);

    const leaveCurrentTeam = useCallback(async () => {
        if (currentTeam) {
            await leaveTeam(currentTeam.id);
            history.go(0);
        }
    }, [currentTeam, history])

    if (currentTeam) {
        return (
            <div className="teams-page">
                <div className="content-container">
                    <h1 className="underlined">Teams</h1>
                    <div className="description-container">
                        <p>Here you can see information about your teams, as well as its stats and members.</p>
                    </div>
                    {
                        allTeams ? (
                            <Dropdown items={pageLinks}>
                                <h2>{currentTeam?.name}</h2>
                                <span className="material-icons icon">
                                    expand_more
                            </span>
                            </Dropdown>
                        ) : <LoadingScreen />
                    }
                    {
                        details ? (
                            <DetailGrid details={details} />
                        ) : (
                            <LoadingScreen />
                        )
                    }

                    <ButtonLink href={'/teams/' + currentTeam?.id + '/edit'} className="expanded">
                        Edit
                </ButtonLink>
                    {
                        allTeams && allTeams.length > 1 &&
                        <Button className="expanded dark" onClick={leaveCurrentTeam}>
                            Leave Team
                    </Button>
                    }
                    {
                        tabs ? (
                            <Tabs tabs={tabs} />
                        ) : (
                            <LoadingScreen />
                        )
                    }
                </div>
            </div>
        )
    }

    return (
        <LoadingScreen />
    )
}