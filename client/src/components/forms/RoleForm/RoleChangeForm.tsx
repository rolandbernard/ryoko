import { deleteTeamRole, Team, TeamMember, TeamRole, updateTeamMember } from 'adapters/team';
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
    const [allRoles, setRoles] = useState(roles);

    const onSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        await updateTeamMember(team.id, { user: member.id, role: currentRole });
        window.location.reload();
    }, [currentRole, member, team]);

    const onDelete = useCallback(async (id: string) => {
        await deleteTeamRole(team.id, id);
        setRoles(state => state.filter(role => role.id !== id));
    }, [team]);

    return (
        <form className="role-change-form" onSubmit={onSubmit}>
            <h2>Change the role of {member.username}</h2>
            {
                allRoles.map((role) => (
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
                        <div onClick={() => onDelete(role.id)}>delete</div>
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
