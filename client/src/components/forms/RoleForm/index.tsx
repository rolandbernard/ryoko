
import { useState } from 'react';

import { Team, TeamMember, TeamRole } from 'adapters/team';

import RoleChangeForm from 'components/forms/RoleForm/RoleChangeForm';
import RoleEditForm from 'components/forms/RoleForm/RoleEditForm';

import './role-form.scss';
import '../form.scss'

interface Props {
    roles: TeamRole[];
    team: Team;
    member?: TeamMember;
    setResult?: Function;
    setRoles: (state: any) => void
}

export default function RoleForm({ roles, team, member, setResult, setRoles }: Props) {
    const [edit, setEdit] = useState<TeamRole | null>(null);
    return (
        <>
            {
                edit === null ?
                    <RoleChangeForm roles={roles} setEdit={setEdit} team={team} member={member} setAllRoles={setRoles} setResult={setResult} />
                    : <RoleEditForm role={edit} team={team} setEdit={setEdit} setAllRoles={setRoles} />
            }
        </>
    )
}

