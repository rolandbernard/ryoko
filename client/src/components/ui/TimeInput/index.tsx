
import { useCallback, useState } from 'react';

import { durationFor, formatDuration } from 'timely';

import './time-input.scss';

interface Props {
    onChange: (state: number) => void;
    initialTime?: number;
}

/**
 * Format the given number of hours in the format used for printing in the time input component.
 * The time is formatted using up to two different units up to second precision.
 * 
 * @param hours The number of hours to format
 * @returns A string of the formatted time
 */
function getFormatted(hours: number) {
    if (hours > 0) {
        return formatDuration(durationFor(hours, 'hour'), 'second', 2, true);
    } else {
        return 'none';
    }
}

/**
 * This component implements a input element for inputing time. The time is inputted by the user in
 * hours and is then shown formatted for easier understanding.
 */
export default function TimeInput({ onChange: userOnChange, initialTime }: Props) {
    const [formatted, setFormatted] = useState(initialTime ? getFormatted(initialTime) : 'none');

    const onChange = useCallback(event => {
        const value = parseFloat(event.target.value);
        userOnChange(value);
        if (!Number.isNaN(value)) {
            setFormatted(getFormatted(value));
        } else {
            setFormatted('none');
        }
    }, [userOnChange]);

    return (
        <div className="time-field">
            <label htmlFor="time">Time in hours</label>
            <input autoComplete="off" name="time" min={0} onChange={onChange} defaultValue={initialTime} />
            <span className="formatted">{formatted}</span>
        </div>
    );
}

