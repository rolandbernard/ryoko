import './member-form.scss';
import RoleForm from 'components/forms/RoleForm';
import { Team, TeamMember, TeamRole } from 'adapters/team';
import { useState } from 'react';

interface Props {
    roles: TeamRole[];
    team: Team;
}

export default function MemberForm({ roles, team }: Props) {
    const [role, setRole] = useState<TeamRole>();
    const [username, setUsername] = useState<string>();
    return (
        <div className="member-form">
            {
                
            }
            <RoleForm roles={roles} team={team} setResult={setRole} />
        </div>
    )
}