import './teams-members.scss';
import MemberList from 'components/layout/MemberList';
import { TeamMember } from 'adapters/team';

interface Props {
    members: TeamMember[];
}

export default function TeamsMembers({ members }: Props) {
    const teamMembers = members.map(member => {
        return {
            user: member,
            info: member.role.name,
            settings: [{
                label: 'Edit role',
                popupContent: (
                    <>
                        <h2>Change the role of {member.username}</h2>
                        <select name="" id=""></select>
                    </>
                )
            }]
        }
    })
    return (
        <section className="teams-members-section">
            <MemberList members={teamMembers} />
        </section>
    )
}