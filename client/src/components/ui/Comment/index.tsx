import './comment.scss';
import { User } from 'adapters/user';
import avatar from 'images/roland-bernard.jpg';

export interface CommentProps {
    comment: string;
    user: User;
}

export default function Comment({ comment, user }: CommentProps) {
    return (
        <div className="comment-container">
            <div className="head">
                <div className="avatar">
                    <img src={avatar} alt={user.realname} />
                </div>
                <div className="user-info">
                    <div className="name">
                        {user.realname}
                    </div>
                    <div className="time">
                        10 years ago
                    </div>
                </div>
            </div>
            <div className="comment">
                {comment}
            </div>
        </div>
    )
}