
import { executeApiGet, executeApiPost, executeApiPut } from './request';

export interface Comment {
    id: string;
    task: string;
    user: string;
    text: string;
    created: Date;
    edited: Date;
}

/**
 * Get the comment with the given id.
 * 
 * @param uuid The id of the comment
 * @returns A promise resolving to the comment data
 */
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

/**
 * Create a new comment.
 * 
 * @param comment The data to create the comment with
 * @returns A promise resolving to the id of the new comment
 */
export function createComment(comment: AddCommentBody): Promise<string> {
    return executeApiPost(`comment`, comment, ({ id }) => id, "Failed to create comment");
}

/**
 * Update an existing comment.
 * 
 * @param uuid The id of the comment to update
 * @param text The text to update the comment with
 */
export function updateComment(uuid: string, text: string) {
    return executeApiPut(`comment/${uuid}`, { text: text }, () => {}, "Failed to update comment");
}

