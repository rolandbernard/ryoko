import { CompletionProps } from './../components/ui/Completion/index';

import { ChartItem } from 'components/graphs/BarChart';
import { apiRoot } from 'config';

import { getAuthHeader } from './auth';
import { StatusColors } from './task';
import { formatDate } from 'timely';

export interface Activity {
    day: string;
    time: number;
}

export interface Completion {
    open: number,
    closed: number,
    suspended: number,
    overdue: number,
    sum?: number
}

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

export function executeApiGet<T>(path: string, onSuccess: (data: any) => T, errorMessage: string): Promise<T> {
    return executeApiRequest(path, 'GET', undefined, onSuccess, errorMessage);
}

export function executeApiDelete<T>(path: string, onSuccess: (data: any) => T, errorMessage: string): Promise<T> {
    return executeApiRequest(path, 'DELETE', undefined, onSuccess, errorMessage);
}

export function executeApiPost<T>(path: string, body: any, onSuccess: (data: any) => T, errorMessage: string): Promise<T> {
    return executeApiRequest(path, 'POST', body, onSuccess, errorMessage);
}

export function executeApiPut<T>(path: string, body: any, onSuccess: (data: any) => T, errorMessage: string): Promise<T> {
    return executeApiRequest(path, 'PUT', body, onSuccess, errorMessage);
}

export function parseCompletion(completion: Completion): CompletionProps[] {
    const allAmount = completion.sum ?? 1;
    return [
        {
            label: 'Closed',
            percent: completion.closed / allAmount * 100,
            color: StatusColors.get('closed') ?? ''
        },
        {
            label: 'Open',
            percent: completion.open / allAmount * 100,
            color: StatusColors.get('open') ?? ''
        },
        {
            label: 'Suspended',
            percent: completion.suspended / allAmount * 100,
            color: StatusColors.get('suspended') ?? ''
        },
        {
            label: 'Overdue',
            percent: completion.overdue / allAmount * 100,
            color: StatusColors.get('overdue') ?? ''
        },
    ] 
}

export function parseActivity(activity: Activity[]): ChartItem[] {
    return activity.map(item => ({
        label: formatDate(new Date(item.day), 'none', 'short'),
        value: item.time
    }));
}
