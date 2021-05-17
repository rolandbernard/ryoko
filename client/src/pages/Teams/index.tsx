import './teams.scss';
import DetailGrid from 'components/layout/DetailGrid';
import ButtonLink from 'components/navigation/ButtonLink';
import Tabs from 'components/navigation/Tabs';
import Dropdown from 'components/navigation/Dropdown';
import TeamsMembers from './TeamsMembers';
import TeamsStats from './TeamsStats';
import { useEffect, useState } from 'react';
import { getTeamMembers, getTeamProjects, getTeams, Team } from 'adapters/team';
import { DetailProps } from 'components/ui/DetailBox';


export default function Teams() {
    const [allTeams, setTeams] = useState<Team[]>();
    const [currentTeam, setCurrentTeam] = useState<Team>();
    const [details, setDetails] = useState<DetailProps[]>([]);

    useEffect(() => {
        getTeams().then((teams) => {
            setTeams(teams);
            setCurrentTeam(teams[0]);
            if (teams[0]) {
                getTeamProjects(teams[0].id).then((projects) => {
                    console.log(projects);
                    setDetails((state) => [...state, {
                        icon: 'folder',
                        title: 'Projects',
                        number: projects.length
                    }]);
                });
                getTeamMembers(teams[0].id).then((members) => {
                    setDetails((state) => [...state, {
                        icon: 'group',
                        title: 'Members',
                        number: members.length
                    }]);
                })
            }
        }).catch(() => { });
    }, []);

    const tabs = [{
        path: '/teams',
        label: 'Members',
        component: TeamsMembers
    }, {
        path: '/teams/stats',
        label: 'Stats',
        component: TeamsStats
    }];

    //TODO dynamic
    const teams = [{
        route: '/teams/members?team=someOther',
        label: 'Some other Team',
    }];
    return (
        <div className="teams-page">
            <div className="content-container">
                <h1 className="underlined">Teams</h1>
                {
                    allTeams && allTeams?.length > 1 && (
                        <Dropdown items={teams}>
                            <h2>{currentTeam?.name}</h2>
                            <span className="material-icons icon">
                                expand_more
                            </span>
                        </Dropdown>
                    )
                }
                {
                    allTeams && allTeams?.length === 1 && (
                        <h2>{currentTeam?.name}</h2>
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