import './member-form.scss';
import RoleForm from 'components/forms/RoleForm';
import { addTeamMember, Team, TeamRole } from 'adapters/team';
import { useEffect, useState } from 'react';
import UsernameForm from 'components/forms/MemberForm/UsernameForm';

interface Props {
    roles: TeamRole[];
    team: Team;
    setRoles: (state: any) => void
}

export default function MemberForm({ roles, team, setRoles }: Props) {
    const [role, setRole] = useState<string>();
    const [user, setUser] = useState<string>('');
    useEffect(() => {
        if (role && user) {
            if (addTeamMember(team.id, { user: user, role: role })) {
                window.location.reload();
            }
        }
    }, [role])
    return (
        <div className="member-form">
            {
                !user ? <UsernameForm setResult={setUser} /> :
                    <RoleForm roles={roles} team={team} setResult={setRole} setRoles={setRoles} />
            }
        </div>
    )
}