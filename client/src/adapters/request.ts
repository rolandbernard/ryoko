
import { apiRoot } from 'config';

import { getAuthHeader } from './auth';

/**
 * Execute an API request to the ryoko api. This method can handle JSON and FormData as a body.
 * 
 * @param path The path of the request
 * @param method The method of the request
 * @param body The body of the request
 * @param onSuccess How the returned JSON should be handled
 * @param errorMessage The error message to throw if an error occurs
 * @returns A promise resolving to the result of the onSuccess function
 */
async function executeApiRequest<T>(path: string, method: string, body: any, onSuccess: (data: any) => T, errorMessage: string): Promise<T> {
    try {
        const response = await fetch(`${apiRoot}/${path}`, {
            method: method,
            headers: {
                ...getAuthHeader(),
                ...(body && !(body instanceof FormData)
                        ? { 'Content-Type': 'application/json' }
                        : { }),
            },
            body: body
                    ? (body instanceof FormData
                            ? body
                            : JSON.stringify(body))
                    : undefined,
        });
        if (response.ok) {
            return onSuccess(await response.json());
        } else {
            throw new Error(errorMessage);
        }
    } catch (e) {
        throw new Error(errorMessage);
    }
}
/**
 * Execute an GET request to the ryoko api.
 * 
 * @param path The path of the request
 * @param onSuccess How the returned JSON should be handled
 * @param errorMessage The error message to throw if an error occurs
 * @returns A promise resolving to the result of the onSuccess function
 */
export function executeApiGet<T>(path: string, onSuccess: (data: any) => T, errorMessage: string): Promise<T> {
    return executeApiRequest(path, 'GET', undefined, onSuccess, errorMessage);
}

/**
 * Execute an DELETE request to the ryoko api.
 * 
 * @param path The path of the request
 * @param onSuccess How the returned JSON should be handled
 * @param errorMessage The error message to throw if an error occurs
 * @returns A promise resolving to the result of the onSuccess function
 */
export function executeApiDelete<T>(path: string, onSuccess: (data: any) => T, errorMessage: string): Promise<T> {
    return executeApiRequest(path, 'DELETE', undefined, onSuccess, errorMessage);
}

/**
 * Execute an POST request to the ryoko api.
 * 
 * @param path The path of the request
 * @param body The body of the request
 * @param onSuccess How the returned JSON should be handled
 * @param errorMessage The error message to throw if an error occurs
 * @returns A promise resolving to the result of the onSuccess function
 */
export function executeApiPost<T>(path: string, body: any, onSuccess: (data: any) => T, errorMessage: string): Promise<T> {
    return executeApiRequest(path, 'POST', body, onSuccess, errorMessage);
}

/**
 * Execute an PUT request to the ryoko api.
 * 
 * @param path The path of the request
 * @param body The body of the request
 * @param onSuccess How the returned JSON should be handled
 * @param errorMessage The error message to throw if an error occurs
 * @returns A promise resolving to the result of the onSuccess function
 */
export function executeApiPut<T>(path: string, body: any, onSuccess: (data: any) => T, errorMessage: string): Promise<T> {
    return executeApiRequest(path, 'PUT', body, onSuccess, errorMessage);
}

