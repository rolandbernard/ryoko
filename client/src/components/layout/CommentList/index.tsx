
import { FormEvent, useCallback, useEffect, useState } from 'react';

import { getCurrentUser, User } from 'adapters/user';
import { createComment, getComment } from 'adapters/comment';

import Avatar from 'components/ui/Avatar';
import Comment, { CommentProps } from 'components/ui/Comment';

import './comment-list.scss';

interface Props {
    comments: CommentProps[]
    taskId: string;
}

export default function CommentList({ comments, taskId }: Props) {
    const [user, setUser] = useState<User>();
    const [comment, setComment] = useState<string>('');
    const [allComments, setComments] = useState<CommentProps[]>([]);
    
    useEffect(() => {
        getCurrentUser().then((user) => setUser(user));
        setComments(comments);
    }, [comments]);

    const handleSubmit = useCallback((e: FormEvent) => {
        e.preventDefault();
        if (comment.length > 0) {
            createComment({ task: taskId, text: comment }).then(id => {
                getComment(id).then(comment => {
                    setComments(state => [...state, {
                        comment: comment
                    }])
                })
            });
            setComment('');
        }
    }, [comment, taskId]);

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
                            <textarea value={comment} placeholder="Write a comment..." onChange={(e) => setComment(e.target.value)}></textarea>
                            <button type="submit">Send</button>
                        </form>
                    </div>
                )
            }
            {allComments.map(comment => (
                <Comment key={comment.comment.id} {...comment} />
            ))}
        </div>
    )
}

