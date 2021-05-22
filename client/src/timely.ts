
const UNITS = {
    'year':         1000 * 60 * 60 * 24 * 365.2425,
    'month':        1000 * 60 * 60 * 24 * 30,
    'week':         1000 * 60 * 60 * 24 * 7,
    'day':          1000 * 60 * 60 * 24,
    'hour':         1000 * 60 * 60,
    'minute':       1000 * 60,
    'second':       1000,
    'millisecond':  1,
};

type Unit = (keyof typeof UNITS);

function formatAmount(amount: number, base: string): string {
    amount = Math.round(amount);
    if (amount === 0) {
        return 'zero ' + base + 's';
    } else if (amount === 1) {
        return 'one ' + base;
    } else {
        return amount.toString() + ' ' + base + 's';
    }
}

export function formatDuration(millis: number, precision: Unit = 'minute'): string {
    if (millis >= UNITS[precision]) {
        for (const key of (Object.keys(UNITS) as Unit[])) {
            if (millis >= UNITS[key]) {
                return formatAmount(millis / UNITS[key], key);
            }
        }
    }
    return 'moments';
}

function formatOrdinal(value: number): string {
    value = Math.round(value);
    if (value === 1 || (value % 10 === 1 && value > 20)) {
        return value.toString() + 'st';
    } else if (value === 2 || (value % 10 === 2 && value > 20)) {
        return value.toString() + 'nd';
    } else if (value === 3 || (value % 10 === 3 && value > 20)) {
        return value.toString() + 'rd';
    } else {
        return value.toString() + 'th';
    }
}

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export function formatTime(date: Date): string {
    return formatOrdinal(date.getDate()) + ' ' + MONTHS[date.getMonth()] + ' ' + date.getFullYear().toString();
}

export function formatRelativeTime(): string {
    // TODO
    return '';
}

export function addTime(date: Date, time: number, unit: Unit): Date {
    if (time === 0) {
        return new Date(date);
    } else if (unit === 'month') {
        const full = Math.floor(time);
        const result = new Date(date);
        result.setMonth(result.getMonth() + full);
        return addTime(result, 30 * (time - full), 'day');
    } else if (unit === 'year') {
        const full = Math.floor(time);
        const result = new Date(date);
        result.setFullYear(result.getFullYear() + full);
        return addTime(result, 12 * (time - full), 'month');
    } else {
        // All other durations are constant
        return new Date(date.getTime() + time * UNITS[unit]);
    }
}

export function subtractTime(date: Date, time: number, unit: Unit): Date {
    return addTime(date, -time, unit);
}

