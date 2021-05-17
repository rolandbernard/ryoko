import { Team, TeamMember, TeamRole, updateTeamMember } from 'adapters/team';
import { FormEvent, useCallback, useState } from 'react';
import Button from 'components/ui/Button';

interface Props {
    roles: TeamRole[];
    setEdit: Function;
    member: TeamMember;
    team: Team;
}

export default function RoleForm({ roles, setEdit, member, team }: Props) {
    const [currentRole, setRole] = useState(member.role.id);
    const onSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        await updateTeamMember(team.id, { user: member.id, role: currentRole });
        window.location.reload();
    }, [currentRole, member, team]);
    return (
        <form className="role-change-form" onSubmit={onSubmit}>
            {
                roles.map((role) => (
                    <div className="role-item" key={role.id}>
                        <input
                            type="radio"
                            name={role.id}
                            id={role.id}
                            onChange={() => setRole(role.id)} 
                            checked={currentRole === role.id}
                        />
                        <label htmlFor={role.id}>{role.name}</label>
                        <div onClick={() => setEdit(role)}>edit</div>
                    </div>
                ))}
            <div className="add-btn role-item" onClick={() => setEdit({})}>
                +
            </div>
            <Button type="submit">
                Change
            </Button>
        </form >
    )
}
