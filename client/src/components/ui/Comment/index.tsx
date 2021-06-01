
import { useEffect, useState } from 'react';

import { formatRelativeTime } from 'timely';
import { getUser, User } from 'adapters/user';
import { Comment as IComment } from 'adapters/comment';

import Avatar from 'components/ui/Avatar';
import LongText from 'components/ui/LongText';

import './comment.scss';
import LoadingScreen from '../LoadingScreen';

export interface CommentProps {
    comment: IComment;
    onError?: () => any;
}

export default function Comment({ comment, onError }: CommentProps) {
    const [user, setUser] = useState<User>();

    useEffect(() => {
        getUser(comment.user)
            .then((user) => setUser(user))
            .catch(() => onError?.());
    }, [comment, onError]);

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
                            {
                                (comment.edited.getTime() !== comment.created.getTime())
                                    ? 'edited ' + formatRelativeTime(comment.edited)
                                    : formatRelativeTime(comment.created)
                            }
                        </div>
                    </div>
                </div>
                <div className="comment">
                    <LongText text={comment.text} />
                </div>
            </div>
        )
    } else {
        return <LoadingScreen />
    }
}

