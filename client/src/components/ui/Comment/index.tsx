
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';

import { getUser, User } from 'adapters/user';
import { getLoggedInUser } from 'adapters/auth';
import { currentTime, formatRelativeTime } from 'timely';
import { Comment as IComment, updateComment } from 'adapters/comment';

import Avatar from 'components/ui/Avatar';
import LongText from 'components/ui/LongText';

import './comment.scss';
import LoadingScreen from '../LoadingScreen';

export interface CommentProps {
    comment: IComment;
    onError?: () => any;
}

export default function Comment({ comment: initialComment, onError }: CommentProps) {
    const [comment, setComment] = useState(initialComment);
    const [user, setUser] = useState<User>();
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(comment.text);

    const userId = getLoggedInUser();

    const handleSubmit = useCallback((e: FormEvent) => {
        e.preventDefault();
        if (comment.text.length > 0) {
            setEditing(false);
            updateComment(comment.id, text).then(() => {
                setComment({
                    ...comment,
                    text: text,
                    edited: currentTime(),
                });
            })
            .catch(onError);
        }
    }, [comment, text, onError]);

    const handleReset = useCallback((e: FormEvent) => {
        e.preventDefault();
        setEditing(false);
    }, []);

    const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        setText(e.target.value);
    }, []);

    useEffect(() => {
        getUser(initialComment.user)
            .then((user) => setUser(user))
            .catch(() => onError?.());
    }, [initialComment, onError]);

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
                { editing
                    ? (
                        <form onSubmit={handleSubmit} onReset={handleReset}>
                            <textarea value={text} placeholder="Write a comment..." onChange={handleChange}></textarea>
                            <div className="buttons">
                                <button type="reset">Cancel</button>
                                <button type="submit" disabled={text.length <= 0}>Update</button>
                            </div>
                        </form>
                    )
                    : (
                        <div className="comment">
                            <LongText text={comment.text} />
                        </div>
                    )
                }
                { !editing && userId === comment.user &&
                    <div className="settings" onClick={() => setEditing(true)}>
                        <span className="material-icons icon">
                            edit
                        </span>
                    </div>
                }
            </div>
        )
    } else {
        return <LoadingScreen />
    }
}

