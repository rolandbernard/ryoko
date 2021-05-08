import MemberList from 'components/layout/MemberList';

export default function TaskAssignees() {
    const member = {
        uuid: 'asdf',
        name: 'Roland Bernard',
        role: 'Backend'
    }
    return (
        <section className="teams-assignees-section">
            <MemberList members={[member]} />
        </section>
    );
}