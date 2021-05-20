
import { formatTime, formatDuration, formatRelativeTime } from 'moment';

test('small durations format as `instant`', () => {
    expect(formatDuration(10000)).toEqual('instant');
});

// TODO

