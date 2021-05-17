import './member-form.scss';
import RoleForm from 'components/forms/RoleForm';
import { Team, TeamMember, TeamRole } from 'adapters/team';

interface Props {
    roles: TeamRole[];
    team: Team;
}

export default function MemberForm({ roles, team }: Props) {
    return (
        <div className="member-form">
            asdf
            
            {/*<RoleForm roles={roles} team={team} />*/}
        </div>
    )
}