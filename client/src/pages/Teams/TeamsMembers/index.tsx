
import { useEffect, useState } from 'react';

import { getTeamRoles, Team, TeamMember, TeamRole } from 'adapters/team';

import RoleForm from 'components/forms/RoleForm';
import MemberForm from 'components/forms/MemberForm';
import UserList from 'components/layout/UserList';
import LoadingScreen from 'components/ui/LoadingScreen';

import './teams-members.scss';

interface Props {
    members: TeamMember[];
    team: Team;
}

export default function TeamsMembers({ members, team }: Props) {
    const [roles, setRoles] = useState<TeamRole[]>();

    useEffect(() => {
        getTeamRoles(team.id).then(setRoles);
    }, [team]);
    
    return (
        <section className="teams-members-section">
            {
                roles
                    ? (
                        <UserList
                            users={members}
                            info={member => member.role.name}
                            addContent={
                                <MemberForm
                                    setRoles={setRoles}
                                    roles={roles}
                                    team={team}
                                />
                            }
                            settings={member => [{
                                label: 'Edit role',
                                popupContent: (
                                    <RoleForm
                                        setRoles={setRoles}
                                        roles={roles}
                                        team={team}
                                        member={member}
                                    />
                                )
                            }]}
                        />
                    )
                    : <LoadingScreen />
            }
        </section>
    )
}

