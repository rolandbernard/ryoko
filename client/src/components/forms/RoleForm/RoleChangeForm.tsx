import { deleteTeamRole, Team, TeamMember, TeamRole, updateTeamMember } from 'adapters/team';
import { FormEvent, useCallback, useState } from 'react';
import Button from 'components/ui/Button';

interface Props {
    roles: TeamRole[];
    setEdit: Function;
    member?: TeamMember;
    setResult?: Function
    team: Team;
    setAllRoles: (state: any) => void
}

export default function RoleForm({ roles, setEdit, member, team, setResult, setAllRoles }: Props) {
    const [currentRole, setRole] = useState(member?.role.id);

    const onSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (currentRole) {
            if (setResult) {
                setResult(currentRole);
            }
            if (member) {
                await updateTeamMember(team.id, { user: member.id, role: currentRole });
                window.location.reload();
            }
        }
    }, [currentRole, member, team, setResult]);

    const onDelete = useCallback(async (id: string) => {
        await deleteTeamRole(team.id, id);
        setAllRoles((state: any) => state.filter((role: any) => role.id !== id));
    }, [team, setAllRoles]);

    return (
        <form className="role-change-form" onSubmit={onSubmit}>
            <h2>Update the role</h2>
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
