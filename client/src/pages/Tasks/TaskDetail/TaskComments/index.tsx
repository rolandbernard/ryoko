import { useParams } from "react-router-dom";
import { Params } from '../../TaskDetail';
import CommentList from 'components/layout/CommentList';

export default function TaskComments() {
    const { uuid } = useParams<Params>();
    console.log(uuid);

    return (
        <div className="task-comment-list">
            <CommentList user={{id: 'testid', realname: 'Current user', username: 'testname'}} comments={[{user: {id: 'test', username: 'test', realname: 'testname'}, comment: 'Comment'}]}/>
        </div>
    );
}