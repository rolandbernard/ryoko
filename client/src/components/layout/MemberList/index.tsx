import './member-list.scss';
import TeamMember, { TeamMemberProps } from 'components/ui/TeamMember';
import { ReactNode, useState } from 'react';
import Popup from 'components/ui/Popup';

interface Props {
    members: TeamMemberProps[];
    addContent?: ReactNode
}

export default function MemberList({ members, addContent }: Props) {
    const [showAdd, setShowAdd] = useState(false);
    return (
        <>
            {
                addContent && showAdd &&
                <Popup onClose={() => setShowAdd(false)}>
                    {addContent}
                </Popup>
            }
            <div className="team-member-list">
                {
                    addContent &&
                    <div className="add-btn" onClick={() => setShowAdd(true)}>
                        +
                    </div>
                }

                {members.length > 0 ? members.map((member) => (
                    <TeamMember key={member.user.id} {...member} />
                )) : (
                    <div>No user found.</div>
                )}
            </div>
        </>
    );
}