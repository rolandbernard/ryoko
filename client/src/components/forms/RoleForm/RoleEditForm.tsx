
import { createTeamRole, Team, TeamRole } from 'adapters/team';
import TextInput from 'components/ui/TextInput';
import Button from 'components/ui/Button';
import { FormEvent, useCallback, useState } from 'react';

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

    const onSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (validateName(name) === null) {
            if (!role?.id) {
                const role = await createTeamRole(team.id, name);
                setAllRoles((state: any) => [...state, role]);
                setEdit(null);
            } else {
                //todo edit team role
                setEdit(null);
            }
        }
    }, [name, team, setEdit, role, setAllRoles]);

    return (
        <form className="role-edit-form" onSubmit={onSubmit}>
            <h2>{!role?.id ? 'Create a new role' : 'Edit role ' + role.name}</h2>
            <TextInput
                label="Role name"
                name="name"
                defaultText={name}
                onChange={setName}
                validation={validateName}
            />
            <Button >
                {!role?.id ? 'Create' : 'Update'}
            </Button>
        </form>
    )
}
