
import { useEffect, useState } from 'react';

import { getTaskComments } from 'adapters/task';

import { CommentProps } from 'components/ui/Comment';
import LoadingScreen from 'components/ui/LoadingScreen';
import CommentList from 'components/layout/CommentList';

interface Props {
    taskId: string;
}

export default function TaskComments({ taskId }: Props) {
    const [comments, setComments] = useState<CommentProps[]>();

    useEffect(() => {
        getTaskComments(taskId).then((comments) => {
            setComments(comments.map((comment) => ({ comment })));
        })
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

