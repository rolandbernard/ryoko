
import { useHistory, useParams } from 'react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { getTeamMembers, getTeamProjects, getTeams, leaveTeam, Team, TeamMember } from 'adapters/team';
import { Project } from 'adapters/project';

import Button from 'components/ui/Button';
import DetailGrid from 'components/layout/DetailGrid';
import Tabs from 'components/navigation/Tabs';
import LoadingScreen from 'components/ui/LoadingScreen';
import ButtonLink from 'components/navigation/ButtonLink';
import Dropdown from 'components/navigation/Dropdown';

import TeamsMembers from './TeamsMembers';
import TeamsStats from './TeamsStats';

import './teams.scss';
import ErrorScreen from 'components/ui/ErrorScreen';

export interface Params {
    teamId: string;
}

export default function Teams() {
    const [error, setError] = useState<Boolean>(false);
    const [teams, setTeams] = useState<Team[]>();
    const [projects, setProjects] = useState<Project[]>([]);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const history = useHistory();

    const { teamId: teamParamId } = useParams<Params>();
    const lastTeam = sessionStorage.getItem('last-selected-team');
    const teamId = teamParamId ?? lastTeam ?? teams?.[0]?.id
    if (teamId) {
        sessionStorage.setItem('last-selected-team', teamId);
    }

    let currentTeam = teams?.find(team => team.id === teamId);

    useEffect(() => {
        if (teamId && !teamParamId) {
            history.replace('/teams/' + teamId);
        } else if (teams && teams.length === 0) {
            history.push('/introduction');
        }
    }, [teamId, teamParamId, teams, history]);

    useEffect(() => {
        getTeams().then(setTeams).catch(setError);
    }, []);

    useEffect(() => {
        if (teamId) {
            getTeamProjects(teamId).then(setProjects).catch(setError);
        }
    }, [teamId]);

    useEffect(() => {
        if (teamId) {
            getTeamMembers(teamId).then(setMembers).catch(setError);
        }
    }, [teamId]);

    const leaveCurrentTeam = useCallback(async () => {
        if (teamId && teams) {
            await leaveTeam(teamId);
            setTeams(teams.filter(team => team.id !== teamId));
        }
    }, [teams, teamId])

    const tabs = useMemo(() => currentTeam && members && [
        {
            route: '/teams/' + currentTeam.id,
            label: 'Members',
            component: (<TeamsMembers members={members} team={currentTeam} />)
        }, {
            route: '/teams/' + currentTeam.id + '/stats/:time',
            link: '/teams/' + currentTeam.id + '/stats/week',
            label: 'Stats',
            component: <TeamsStats teamId={currentTeam.id} />
        }
    ], [currentTeam, members]);

    const dropdownList = useMemo(() => teamId && teams && (
        teams.filter(team => team.id !== teamId).map(team => ({
            route: '/teams/' + team.id,
            label: team.name,
        }))
    ), [teams, teamId]);

    const details = useMemo(() => members && projects && [
        {
            icon: 'folder',
            title: 'Projects',
            number: projects.length
        },
        {
            icon: 'group',
            title: 'Members',
            number: members.length
        }
    ], [members, projects]);

    if (teamId) {
        if (!error) {

            return (
                <div className="teams-page">
                    <div className="content-container">
                        <h1 className="underlined">Teams</h1>
                        <div className="description-container">
                            <p>Here you can see information about your teams, as well as its stats and members.</p>
                        </div>
                        {
                            dropdownList
                                ? (
                                    <Dropdown items={dropdownList}>
                                        <h2>{currentTeam?.name}</h2>
                                        <span className="material-icons icon">
                                            expand_more
                                        </span>
                                    </Dropdown>
                                )
                                : <LoadingScreen />
                        }
                        {
                            details
                                ? <DetailGrid details={details} />
                                : (<LoadingScreen />)
                        }
                        <div className="buttons">
                            <div className="button-row">
                                <ButtonLink href={'/teams/' + currentTeam?.id + '/edit'} className="expanded">
                                    Edit
                                </ButtonLink>
                                <ButtonLink href={'/teams/create'} className="expanded">
                                    Create a new team
                                </ButtonLink>
                            </div>
                            {
                                teams && teams.length > 1 && (
                                    <Button className="expanded dark" onClick={leaveCurrentTeam}>
                                        Leave Team
                                    </Button>
                                )
                            }
                        </div>
                        {
                            tabs
                                ? <Tabs tabs={tabs} />
                                : <LoadingScreen />
                        }
                    </div>
                </div>
            )
        } else {
            return (<ErrorScreen />)
        }

    } else {
        return (
            <LoadingScreen />
        )
    }
}

