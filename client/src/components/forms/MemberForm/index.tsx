import './member-form.scss';
import RoleForm from 'components/forms/RoleForm';
import { addTeamMember, Team, TeamRole } from 'adapters/team';
import { useEffect, useState } from 'react';
import UsernameForm from 'components/forms/MemberForm/UsernameForm';
import { useHistory } from 'react-router';

interface Props {
    roles: TeamRole[];
    team: Team;
    setRoles: (state: any) => void
}

export default function MemberForm({ roles, team, setRoles }: Props) {
    const [role, setRole] = useState<string>();
    const [user, setUser] = useState<string>('');
    const history = useHistory();
    useEffect(() => {
        if (role && user && addTeamMember(team.id, { user: user, role: role })) {
            history.go(0);
        }
    }, [role, user, team, history])
    return (
        <div className="member-form">
            {
                !user ? <UsernameForm setResult={setUser} /> :
                    <RoleForm roles={roles} team={team} setResult={setRole} setRoles={setRoles} />
            }
        </div>
    )
}