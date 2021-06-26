
import { StatusColors, Completion as ApiCompletion } from 'adapters/common';

import CircularProgress from 'components/graphs/CircularProgress';

import './completion.scss';

export interface CompletionProps {
    label: string;
    percent: number;
    color: string;
}

/**
 * Parse the given API completion data into the properties required for use with this component. This
 * means getting the correct color for the status and calculating the percentage.
 *
 * @param completion The API completion result
 * @returns The properties to give to the component
 */
export function parseCompletion(completion: ApiCompletion): CompletionProps[] {
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

/**
 * This element is a completion item display for use in the CompletionGrid component. The component
 * will display a completion with the given number of percent in the given color and show the given
 * label property.
 */
export default function Completion({ label, percent, color }: CompletionProps) {
    return (
        <div className="completion">
            <div className="inner">
                <CircularProgress percent={Math.floor(percent)} color={color} />
                <div className="label">{label}</div>
            </div>
        </div>
    )
}
