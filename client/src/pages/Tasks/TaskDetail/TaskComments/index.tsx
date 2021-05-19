import { getTaskComments } from 'adapters/task';
import CommentList from 'components/layout/CommentList';
import { CommentProps } from 'components/ui/Comment';
import { useEffect, useState } from 'react';

interface Props {
    taskId: string;
}

export default function TaskComments({ taskId }: Props) {

    const [comments, setComments] = useState<CommentProps[]>([]);
    useEffect(() => {
        getTaskComments(taskId).then((comments) => {
            setComments(comments.map((comment) => { return { comment } }));
        })
    }, [taskId])
    return (
        <div className="task-comment-list">
            <CommentList comments={comments} taskId={taskId} />
        </div>
    );
}