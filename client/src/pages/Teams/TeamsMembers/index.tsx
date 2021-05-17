import './teams-members.scss';
import MemberList from 'components/layout/MemberList';
import { getTeamRoles, Team, TeamMember, TeamRole } from 'adapters/team';
import RoleForm from 'components/forms/RoleForm';
import MemberForm from 'components/forms/MemberForm';
import { useEffect, useState } from 'react';

interface Props {
    members: TeamMember[];
    team: Team;
}

export default function TeamsMembers({ members, team }: Props) {
    const [roles, setRoles] = useState<TeamRole[]>([]);
    useEffect(() => {
        getTeamRoles(team.id).then((roles) => {
            setRoles(roles);
        })
    }, []);

    const teamMembers = members.map(member => {
        return {
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
        }
    });

    return (
        <section className="teams-members-section">
            <MemberList members={teamMembers} addContent={<MemberForm setRoles={setRoles} roles={roles} team={team} />} />
        </section>
    )
}