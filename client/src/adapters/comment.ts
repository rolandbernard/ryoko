
import { executeApiGet, executeApiPost, executeApiPut } from './util';

export interface Comment {
    id: string;
    task: string;
    user: string;
    text: string;
    created: Date;
    edited: Date;
}

export function getComment(uuid: string): Promise<Comment> {
    return executeApiGet(`comment/${uuid}`, ({ comment }) => ({
        ...comment,
        edited: new Date(comment.edited),
        created: new Date(comment.created),
    }), "Failed to get comment");
}

interface AddCommentBody {
    task: string;
    text: string;
}

export function createComment(comment: AddCommentBody): Promise<string> {
    return executeApiPost(`comment`, comment, ({ id }) => id, "Failed to create comment");
}

export function updateComment(uuid: string, text: string) {
    return executeApiPut(`comment/${uuid}`, { text: text }, () => {}, "Failed to update comment");
}

