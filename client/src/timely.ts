
const UNITS = {
    'millisecond':  1,
    'second':       1000,
    'minute':       1000 * 60,
    'hour':         1000 * 60 * 60,
    'day':          1000 * 60 * 60 * 24,
    'week':         1000 * 60 * 60 * 24 * 7,
    'month':        1000 * 60 * 60 * 24 * 30,
    'year':         1000 * 60 * 60 * 24 * 365.25,
};

type Unit = (keyof typeof UNITS);

export function formatDuration(millis: number, precision: Unit = 'minute'): string {
    if (millis < UNITS[precision]) {
        return 'instant';
    } else {
        // TODO
        return '';
    }
}

export function formatTime(): string {
    // TODO
    return '';
}

export function formatRelativeTime(): string {
    // TODO
    return '';
}

export function addTime(date: Date, time: number, unit: Unit): Date {
    return new Date(date.getTime() + time * UNITS[unit]);
}

export function subtractTime(date: Date, time: number, unit: Unit): Date {
    return addTime(date, -time, unit);
}

