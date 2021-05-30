
import { useEffect, useState } from 'react';

import { getTeamRoles, Team, TeamMember, TeamRole } from 'adapters/team';

import RoleForm from 'components/forms/RoleForm';
import MemberForm from 'components/forms/MemberForm';
import MemberList from 'components/layout/MemberList';
import LoadingScreen from 'components/ui/LoadingScreen';

import './teams-members.scss';

interface Props {
    members: TeamMember[];
    team: Team;
}

export default function TeamsMembers({ members, team }: Props) {
    const [roles, setRoles] = useState<TeamRole[]>();

    useEffect(() => {
        getTeamRoles(team.id).then((roles) => {
            setRoles(roles);
        })
    }, [team]);
    
    let teamMembers;
    if (roles) {
        teamMembers = members.map(member => ({
            user: member,
            info: member.role.name,
            settings: [{
                label: 'Edit role',
                popupContent: (
                    <>
                        <RoleForm setRoles={setRoles} roles={roles} team={team} member={member} />
                    </>
                )
            }]
        }));
    }

    return (
        <section className="teams-members-section">
            {
                (roles && teamMembers)
                    ? <MemberList members={teamMembers} addContent={<MemberForm setRoles={setRoles} roles={roles} team={team} />} />
                    : <LoadingScreen />
            }
        </section>
    )
}

