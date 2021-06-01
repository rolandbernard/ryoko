
import { FormEvent, useCallback, useEffect, useState } from 'react';

import { getCurrentUser, User } from 'adapters/user';
import { createComment, getComment, Comment } from 'adapters/comment';

import Avatar from 'components/ui/Avatar';
import CommentComponent from 'components/ui/Comment';

import './comment-list.scss';
import ErrorScreen from 'components/ui/ErrorScreen';

interface Props {
    comments: Comment[]
    taskId: string;
}

export default function CommentList({ comments, taskId }: Props) {
    const [error, setError] = useState(false);
    const [user, setUser] = useState<User>();
    const [comment, setComment] = useState<string>('');
    const [allComments, setComments] = useState<Comment[]>([]);

    const handleSubmit = useCallback((e: FormEvent) => {
        setError(false);
        e.preventDefault();
        if (comment.length > 0) {
            createComment({ task: taskId, text: comment }).then(id => {
                setComment('');
                getComment(id).then(comment => {
                    setComments(state => [comment, ...state])
                })
                .catch(() => setError(true))
            })
            .catch(() => setError(true))
        }
    }, [comment, taskId]);
    
    useEffect(() => {
        getCurrentUser()
            .then(setUser)
            .catch(() => setError(true));
        setComments(comments);
    }, [comments]);

    const onError = useCallback(() => {
        setError(true)
    }, []);

    return (
        <div className="comment-list">
            <div className="add-comment comment-container">
                <div className="head">
                    <Avatar user={user} />
                    <div className="user-info">
                        <div className="name">
                            {user?.realname ?? user?.username}
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <textarea value={comment} placeholder="Write a comment..." onChange={(e) => setComment(e.target.value)}></textarea>
                    <button type="submit" disabled={comment.length <= 0 || error}>Send</button>
                </form>
            </div>
            {error
                ? <ErrorScreen onReload={() => setError(false)} />
                : (
                    allComments.map(comment => (
                        <CommentComponent
                            key={comment.id}
                            comment={comment}
                            onError={onError}
                        />
                    ))
                )
            }
        </div>
    );
}

