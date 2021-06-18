
import { useCallback, useState } from 'react';

import { durationFor, formatDuration } from 'timely';

import './time-input.scss';

interface Props {
    onChange: (state: number) => void;
    initialTime?: number;
}

function getFormatted(hours: number) {
    if (hours > 0) {
        return formatDuration(durationFor(hours, 'hour'), 'second', 2, true);
    } else {
        return 'none';
    }
}

export default function TimeInput({ onChange: userOnChange, initialTime }: Props) {
    const [formatted, setFormatted] = useState(initialTime ? getFormatted(initialTime) : '');

    const onChange = useCallback(event => {
        const value = parseFloat(event.target.value);
        userOnChange(value);
        if (!Number.isNaN(value)) {
            setFormatted(getFormatted(value));
        } else {
            setFormatted('');
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

