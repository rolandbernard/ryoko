import Comment, { CommentProps } from 'components/ui/Comment';
import { getCurrentUser, User } from 'adapters/user';
import Avatar from 'components/ui/Avatar';
import './comment-list.scss';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { createComment } from 'adapters/comment';
import { useHistory } from 'react-router';

interface Props {
    comments: CommentProps[]
    taskId: string;
}

export default function CommentList({ comments, taskId }: Props) {

    const [user, setUser] = useState<User>();
    const [comment, setComment] = useState<string>('');
    const history = useHistory();
    useEffect(() => {
        getCurrentUser().then((user) => setUser(user));
    }, []);

    const handleSubmit = useCallback((e: FormEvent) => {
        e.preventDefault();
        if(comment.length > 0) {
            if(createComment({task: taskId, text: comment})) {
                history.go(0);
            }
        }
    }, [comment, taskId, history])

    return (
        <div className="comment-list">
            {
                user && (
                    <div className="add-comment comment-container">
                        <div className="head">
                            <Avatar user={user} />
                            <div className="user-info">
                                <div className="name">
                                    {user.realname ?? user.username}
                                </div>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <textarea placeholder="Write a comment..." onChange={(e) => setComment(e.target.value)}></textarea>
                            <button type="submit">Send</button>
                        </form>
                    </div>
                )
            }

            {comments.map(comment => (
                <Comment key={comment.comment.id} {...comment} />
            ))}

        </div>
    )
}