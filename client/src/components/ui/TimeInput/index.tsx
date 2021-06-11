
import { useCallback, useState } from 'react';

import { durationFor, formatDuration } from 'timely';

import './time-input.scss';

interface Props {
    onChange: (state: number) => void;
}

export default function TimeInput({ onChange: userOnChange }: Props) {
    const [formatted, setFormatted] = useState('');

    const onChange = useCallback(event => {
        const value = parseFloat(event.target.value);
        userOnChange(value);
        if (!Number.isNaN(value)) {
            setFormatted(
                formatDuration(durationFor(value, 'hour'), 'second', 2, true)
            );
        } else {
            setFormatted('');
        }
    }, [userOnChange]);

    return (
        <div className="time-field">
            <label htmlFor="time">Time in hours</label>
            <input type="number" name="time" min={0} onChange={onChange} />
            <span className="formatted">{formatted}</span>
        </div>
    );
}

