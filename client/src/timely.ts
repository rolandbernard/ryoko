
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

/**
 * Format an amount of something. Base is the something that we have amount of. If short is true
 * only write the number followed by the first character of the base name.
 * 
 * @param amount The number of items
 * @param base The name of one element
 * @param short If formatting should use the short format
 * @returns The formatted string
 */
function formatAmount(amount: number, base: string, short: boolean): string {
    if (short) {
        return Math.floor(amount) + base[0];
    } else {
        amount = Math.floor(amount);
        if (amount === 0) {
            return 'zero ' + base + 's';
        } else if (amount === 1) {
            return 'one ' + base;
        } else {
            return amount.toString() + ' ' + base + 's';
        }
    }
}

/**
 * Format a duration in milliseconds, with a given maximum precision and up to count different
 * elements. If short is true, use the short version of the amount formatting. If the time is less
 * than the specified precision answer only with 'moments'.
 * 
 * @param millis The number of milliseconds to format
 * @param precision The maximum precision to format
 * @param count The maximum amount of different units to use
 * @param short Whether the short format should be used
 * @returns The formatted duration
 */
export function formatDuration(millis: number, precision: Unit = 'minute', count = 1, short = false): string {
    if (millis >= UNITS[precision]) {
        for (const key of (Object.keys(UNITS) as Unit[])) {
            if (millis >= UNITS[key]) {
                const rest = millis % UNITS[key];
                const significant = formatAmount(millis / UNITS[key], key, short);
                if (count <= 1 || rest < UNITS[precision]) {
                    return significant;
                } else {
                    return significant + ' ' + formatDuration(rest, precision, count - 1, short);
                }
            }
        }
    }
    return 'moments';
}

/**
 * Format a number, left-padding it to have a certain number of places with the given string.
 * 
 * @param value The number to format
 * @param places The number of places to format to
 * @param padding The string to use for padding
 * @returns The padded number
 */
function formatNumber(value: number, places = 2, padding = '0'): string {
    let result = Math.floor(value).toString();
    while (result.length < places) {
        result = padding + result;
    }
    return result;
}

/**
 * Format a simple duration using a HH:MM:ss.mmmm format. Depending on the configuration some of these
 * values can be excluded from the formatting.
 * 
 * @param millis The duration to format
 * @param hours If hours should be included
 * @param minutes If minutes should be included
 * @param seconds If secondes should be included
 * @param milliseconds If microseconds should be included
 * @returns The formatted duration
 */
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

/**
 * Format ordinals in english language format.
 * e.g. 1st 2nd 3rd 4th 5th ...
 * 
 * @param value The number ot format
 * @returns The number formatted as an ordinal
 */
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

/**
 * Format the time of the given date. Including information up to the given precision.
 * 
 * @param date The date to format the time from
 * @param precision The maximum precision to display
 * @returns The formatted time
 */
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

/**
 * Format the given date. Include information up to the given precision. If weekday is 'short'
 * or 'full' the weekday will be included. And if year is true the year will also be included.
 * 
 * @param date The date to format
 * @param precision The maximum precision to display
 * @param weekday The format of the weekday
 * @param year If the year should be included
 * @returns The formatted date
 */
export function formatDate(date: Date, precision: Unit = 'day', weekday?: 'short' | 'full', year = true): string {
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
    if (year && UNITS[precision] <= UNITS['year']) {
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

/**
 * Format relative time from the origin to the target in a format containing the duration and
 * one of the qualifiers 'in' or 'ago'.
 * 
 * @param target The target date
 * @param origin The origin date
 * @param precision The maximum precision to format before using moments
 * @returns The formatted time
 */
export function formatRelativeTime(target: Date, origin = new Date(), precision?: Unit): string {
    const delta = durationBetween(origin, target);
    if (delta > 0) {
        return 'in ' + formatDuration(delta, precision);
    } else {
        return formatDuration(-delta, precision) + ' ago';
    }
}

/**
 * Add time to the given date.
 * 
 * @param date The date to add to
 * @param time The number of units to add
 * @param unit The unit to add
 * @returns The result of the addition
 */
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

/**
 * Subtract time to the given date.
 * 
 * @param date The date to subtract to
 * @param time The number of units to subtract
 * @param unit The unit to subtract
 * @returns The result of the subtraction
 */
export function subtractTime(date: Date, time: number, unit: Unit): Date {
    return addTime(date, -time, unit);
}

/**
 * Get the number of milliseconds for the given number of the given unit.
 * 
 * @param time The number of units
 * @param unit The unit
 * @returns The milliseconds in time units
 */
export function durationFor(time: number, unit: Unit): number {
    return time * UNITS[unit];
}

/**
 * Calculate the time in milliseconds between the given dates. If from is before to, then
 * the result will be positive, otherwise it will be negative.
 * 
 * @param from The dates to start from
 * @param to The dates to end at
 * @returns The duration between the dates
 */
export function durationBetween(from: Date, to: Date): number {
    return to.getTime() - from.getTime();
}

/**
 * Get the current date.
 * 
 * @returns The current date
 */
export function currentTime(): Date {
    return new Date();
}

/**
 * Format the date in a simple format.
 * 
 * @param date The date to format
 * @returns The formatted date
 */
export function formatDateShort(date: Date): string {
    return date.getFullYear() + '-' + formatNumber(date.getMonth() + 1) + '-' + formatNumber(date.getDate());
}
