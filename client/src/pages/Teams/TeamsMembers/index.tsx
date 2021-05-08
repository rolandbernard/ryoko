import './teams-members.scss';
import MemberList from 'components/layout/MemberList';

export default function TeamsMembers() {
    const member = {
        uuid: 'asdf',
        name: 'Roland Bernard',
        role: 'Backend'
    }
    return (
        <section className="teams-members-section">
            <MemberList members={[member]} />
        </section>
    )
}