import './team-member.scss';
import avatar from 'images/roland-bernard.jpg';

interface TeamMemberInterface {
    name: string;
    role: string;
}

interface Props {
    member: TeamMemberInterface
}

export default function TeamMember({ member }: Props) {
    return (

        <div className="team-member-item">
            <div className="avatar-container">
                <img src={avatar} alt={member.name} />
            </div>
            <div className="details">
                <div className="name">{member.name}</div>
                <div className="role">{member.role}</div>
            </div>
            <div className="settings">
                
            </div>
        </div>
    );
}