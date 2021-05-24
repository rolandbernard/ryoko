import './comment.scss';
import { getUser, User } from 'adapters/user';
import { Comment as IComment } from 'adapters/comment';
import { useEffect, useState } from 'react';
import Avatar from 'components/ui/Avatar';
import { formatRelativeTime } from 'timely';


export interface CommentProps {
    comment: IComment;
}

export default function Comment({ comment }: CommentProps) {

    const [user, setUser] = useState<User>();
    useEffect(() => {
        getUser(comment.user).then((user) => setUser(user));
    }, [comment]);

    if (user) {
        return (
            <div className="comment-container">
                <div className="head">
                    <Avatar user={user} />
                    <div className="user-info">
                        <div className="name">
                            {user.realname ?? user.username}
                        </div>
                        <div className="time">
                            {formatRelativeTime(comment.created)}    
                        </div>
                    </div>
                </div>
                <div className="comment">
                    {comment.text}
                </div>
            </div>
        )
    } else {
        return <>Loading</>
    }
}