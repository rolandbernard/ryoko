
import { useEffect, useState } from 'react';

import { getTaskComments } from 'adapters/task';
import { Comment } from 'adapters/comment';

import LoadingScreen from 'components/ui/LoadingScreen';
import CommentList from 'components/layout/CommentList';

interface Props {
    taskId: string;
}

export default function TaskComments({ taskId }: Props) {
    const [comments, setComments] = useState<Comment[]>();

    useEffect(() => {
        getTaskComments(taskId).then(comments => {
            setComments(comments.sort((a, b) => b.created.getTime() - a.created.getTime()));
        });
    }, [taskId])

    return (
        <div className="task-comment-list">
            {
                comments
                    ? <CommentList comments={comments} taskId={taskId} />
                    : <LoadingScreen />
            }
        </div>
    );
}

