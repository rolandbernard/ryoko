import './teams-members.scss';
import TeamMember from 'components/ui/TeamMember';

export default function TeamsMembers() {
    const member = {
        name: 'Roland Bernard',
        role: 'Backend'
    }
    return (
        <section className="teams-members-section">
            <div className="content-container">
                <TeamMember member={member} />
            </div>
        </section>
    )
}