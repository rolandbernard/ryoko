
const UNITS = {
    'none':         Infinity,
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
    amount = Math.floor(amount);
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

function formatNumber(value: number, places = 2, padding = '0'): string {
    let result = Math.floor(value).toString();
    while (result.length < places) {
        result = padding + result;
    }
    return result;
}

export function formatSimpleDuration(millis: number, hours = false, minutes = true, seconds = true, milliseconds = false): string {
    let result = '';
    if (hours) {
        const hour = Math.floor(millis / UNITS['hour']);
        millis -= hour * UNITS['hour'];
        result += formatNumber(hour);
    }
    if (minutes) {
        if (result.length !== 0) {
            result += ':';
        }
        const min = Math.floor(millis / UNITS['minute']);
        millis -= min * UNITS['minute'];
        result += formatNumber(min);
    }
    if (seconds) {
        if (result.length !== 0) {
            result += ':';
        }
        const sec = Math.floor(millis / UNITS['second']);
        millis -= sec * UNITS['second'];
        result += formatNumber(sec);
    }
    if (milliseconds) {
        if (result.length !== 0) {
            result += '.';
        }
        result += formatNumber(millis, 3);
    }
    return result;
}

function formatOrdinal(value: number): string {
    value = Math.floor(value);
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

const WEEKDAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

export function formatTime(date: Date, precision: Unit = 'minute'): string {
    let result = '';
    if (UNITS[precision] <= UNITS['hour']) {
        result += formatNumber(date.getHours());
        if (UNITS[precision] <= UNITS['minute']) {
            result += ':' + formatNumber(date.getMinutes());
        } else {
            result += ':00';
        }
        if (UNITS[precision] <= UNITS['second']) {
            result += ':' + formatNumber(date.getSeconds())
        }
        if (UNITS[precision] <= UNITS['millisecond']) {
            result += '.' + formatNumber(date.getMilliseconds(), 3);
        }
    }
    return result;
}

export function formatDate(date: Date, precision: Unit = 'day', weekday?: 'short' | 'full'): string {
    let result = '';
    if (weekday === 'short') {
        result += WEEKDAYS[date.getDay()].substr(0, 3);
    } else if (weekday === 'full') {
        result += WEEKDAYS[date.getDay()];
    }
    if (UNITS[precision] <= UNITS['day']) {
        if (result.length !== 0) {
            result += ', ';
        }
        result += formatOrdinal(date.getDate());
    }
    if (UNITS[precision] <= UNITS['month']) {
        if (result.length !== 0) {
            result += ' ';
        }
        result += MONTHS[date.getMonth()];
    }
    if (UNITS[precision] <= UNITS['year']) {
        if (result.length !== 0) {
            result += ' ';
        }
        result += date.getFullYear().toString();
    }
    if (UNITS[precision] <= UNITS['hour']) {
        result += ' ' + formatTime(date, precision);
    }
    return result;
}

export function formatRelativeTime(target: Date, origin = new Date(), precision?: Unit): string {
    const delta = target.getTime() - origin.getTime();
    if (delta > 0) {
        return 'in ' + formatDuration(delta, precision);
    } else {
        return formatDuration(-delta, precision) + ' ago';
    }
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

