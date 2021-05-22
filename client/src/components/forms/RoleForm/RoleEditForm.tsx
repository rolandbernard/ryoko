
import { createTeamRole, Team, TeamRole, updateTeamRole } from 'adapters/team';
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
                const newRole = await createTeamRole(team.id, name);
                setAllRoles((state: any) => [...state, newRole]);
                setEdit(null);
            } else {
                if(updateTeamRole(team.id, role.id, name)) {
                    setAllRoles((state: any) => {
                        state = state.filter((r: any) => r.id !== role.id);
                        return [
                            ...state,
                            {
                                ...role,
                                name: name
                            }
                        ]
                    });
                }
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
            <Button className="expanded">
                {!role?.id ? 'Create' : 'Update'}
            </Button>
            <Button className="expanded dark" onClick={() => setEdit(null)}>
                Back
            </Button>
        </form>
    )
}
