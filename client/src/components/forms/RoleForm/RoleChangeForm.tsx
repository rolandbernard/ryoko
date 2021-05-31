
import { FormEvent, useCallback, useState } from 'react';

import { reload } from 'index';
import { deleteTeamRole, Team, TeamMember, TeamRole, updateTeamMember } from 'adapters/team';

import Button from 'components/ui/Button';
import Callout from 'components/ui/Callout';

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
    const [error, setError] = useState('');

    const onSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (currentRole) {
            if (setResult) {
                setResult(currentRole);
            }
            if (member) {
                await updateTeamMember(team.id, { user: member.id, role: currentRole });
                reload();
            }
        }
    }, [currentRole, member, team, setResult]);

    const onDelete = useCallback(async (id: string) => {
        try {
            await deleteTeamRole(team.id, id);
            setAllRoles((state: any) => state.filter((role: any) => role.id !== id));
        } catch {
            setError('There are still users assigned to this role.')
        }

    }, [team, setAllRoles]);

    return (
        <form className="role-change-form" onSubmit={onSubmit}>
            <h2>Set the role</h2>
            {
                error && <Callout message={error} />
            }
            {
                roles.map((role) => (
                    <label className="role-item" key={role.id} htmlFor={role.id}>{role.name}
                        <input
                            type="radio"
                            name={role.id}
                            id={role.id}
                            onChange={() => setRole(role.id)}
                            checked={currentRole === role.id}
                        />
                        <div className="radio-btn"></div>
                        <div className="actions">
                            <div className="action" onClick={() => setEdit(role)}>
                                <span className="material-icons">
                                    edit
                            </span>
                            </div>
                            <div className="action delete" onClick={() => onDelete(role.id)}>
                                <span className="material-icons">
                                    clear
                            </span>
                            </div>
                        </div>
                    </label>
                ))}
            <div className="add-btn role-item" onClick={() => setEdit({})}>
                +
            </div>
            <Button type="submit" className="expanded">
                Save
            </Button>
        </form >
    )
}
