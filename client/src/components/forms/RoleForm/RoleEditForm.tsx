
import { FormEvent, useCallback, useState } from 'react';

import { createTeamRole, Team, TeamRole, updateTeamRole } from 'adapters/team';

import Button from 'components/ui/Button';
import Callout from 'components/ui/Callout';
import TextInput from 'components/ui/TextInput';

interface Props {
    role?: TeamRole;
    team: Team;
    setEdit: Function;
    setAllRoles: (state: any) => void
}

export function validateName(name: string): string | null {
    if (name && name.length > 0) {
        return null;
    }
    return 'The name is required';
}

export default function RoleEditForm({ role, team, setEdit, setAllRoles }: Props) {
    const [name, setName] = useState(role?.name ?? '');
    const [error, setError] = useState('');

    const onSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (validateName(name) === null) {
            if (!role?.id) {
                try {
                    const newRole = await createTeamRole(team.id, name);
                    setAllRoles((state: any) => [...state, newRole]);
                    setEdit(null);
                } catch(e) {
                    setError('Failed to create role.');
                }
            } else {
                try {
                    await updateTeamRole(team.id, role.id, name);
                    setAllRoles((state: any) => {
                        return [
                            ...state.filter((r: any) => r.id !== role.id),
                            { ...role, name: name }
                        ];
                    });
                    setEdit(null);
                } catch(e) {
                    setError('Failed to update role.');
                }
            }
        }
    }, [name, team, setEdit, role, setAllRoles]);

    return (
        <form className="role-edit-form" onSubmit={onSubmit}>
            <h2>{!role?.id ? 'Create a new role' : 'Edit role ' + role.name}</h2>
            {
                error && <Callout message={error} />
            }
            <TextInput
                label="Role name"
                name="name"
                defaultText={name}
                onChange={setName}
                validation={validateName}
            />
            <Button className="expanded">
                {!role?.id ? 'Create' : 'Update'}
            </Button>
            <Button className="expanded dark" onClick={() => setEdit(null)}>
                Back
            </Button>
        </form>
    )
}
