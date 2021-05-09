import Comment, { CommentProps } from 'components/ui/Comment';
import { User } from 'adapters/user';
import avatar from 'images/roland-bernard.jpg';
import './comment-list.scss';

interface Props {
    user: User;
    comments: CommentProps[]
}

export default function CommentList({ comments, user }: Props) {
    return (
        <div className="comment-list">
            <div className="add-comment comment-container">
                <div className="head">
                    <div className="avatar">
                        <img src={avatar} alt={user.realname} />
                    </div>
                    <div className="user-info">
                        <div className="name">
                            {user.realname}
                        </div>
                    </div>
                </div>
                <form action="">
                    <textarea placeholder="Write a comment..."></textarea>
                    <button type="submit">Send</button>
                </form>

            </div>

            {comments.map(comment => (
                <Comment key={comment.comment} {...comment} />
            ))}

        </div>
    )
}