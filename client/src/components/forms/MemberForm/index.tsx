
import { useEffect, useState } from 'react';

import { reload } from 'index';
import { addTeamMember, Team, TeamRole } from 'adapters/team';

import UsernameForm from 'components/forms/MemberForm/UsernameForm';
import RoleForm from 'components/forms/RoleForm';

import './member-form.scss';

interface Props {
    roles: TeamRole[];
    team: Team;
    setRoles: (state: any) => void
}

export default function MemberForm({ roles, team, setRoles }: Props) {
    const [role, setRole] = useState<string>();
    const [user, setUser] = useState('');

    useEffect(() => {
        if (role && user) {
            addTeamMember(team.id, { user: user, role: role }).then(() => {
                reload()
            });
        }
    }, [role, user, team])

    return (
        <div className="member-form">
            {
                !user
                    ? <UsernameForm setResult={setUser} />
                    : <RoleForm roles={roles} team={team} setResult={setRole} setRoles={setRoles} />
            }
        </div>
    )
}
