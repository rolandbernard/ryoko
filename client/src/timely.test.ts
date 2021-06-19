
import {
    formatDate,
    formatTime,
    formatDuration,
    formatRelativeTime,
    formatSimpleDuration,
    addTime,
    subtractTime,
    durationFor,
} from 'timely';

test('simple duration format works as expected', () => {
    expect(formatSimpleDuration(1.5 * 60 * 1000)).toEqual('01:30');
});

test('simple duration format can include hours', () => {
    expect(formatSimpleDuration(5 * 60 * 60 * 1000 + 42.5 * 60 * 1000, true)).toEqual('05:42:30');
});

test('simple duration format can include milliseconds', () => {
    expect(formatSimpleDuration(12345, false, false, true, true)).toEqual('12.345');
});

test('small durations format as `moments`', () => {
    expect(formatDuration(10 * 1000)).toEqual('moments');
});

test('the smallest duration unit can be configured', () => {
    expect(formatDuration(10 * 60 * 1000, 'hour')).toEqual('moments');
});

test('one millisecond can be formatted as expected', () => {
    expect(formatDuration(1, 'millisecond')).toEqual('one millisecond');
});

test('ten milliseconds can be formatted as expected', () => {
    expect(formatDuration(10, 'millisecond')).toEqual('10 milliseconds');
});

test('one second can be formatted as expected', () => {
    expect(formatDuration(1000, 'second')).toEqual('one second');
});

test('one and a quarter second is rounded to one second', () => {
    expect(formatDuration(1250, 'second')).toEqual('one second');
});

test('one and a half second is rounded to one seconds', () => {
    expect(formatDuration(1500, 'second')).toEqual('one second');
});

test('ten seconds can be formatted as expected', () => {
    expect(formatDuration(10 * 1000, 'second')).toEqual('10 seconds');
});

test('one minute can be formatted as expected', () => {
    expect(formatDuration(60 * 1000)).toEqual('one minute');
});

test('ten minutes can be formatted as expected', () => {
    expect(formatDuration(10 * 60 * 1000)).toEqual('10 minutes');
});

test('one hour can be formatted as expected', () => {
    expect(formatDuration(60 * 60 * 1000)).toEqual('one hour');
});

test('ten hours can be formatted as expected', () => {
    expect(formatDuration(10 * 60 * 60 * 1000)).toEqual('10 hours');
});

test('one day can be formatted as expected', () => {
    expect(formatDuration(24 * 60 * 60 * 1000)).toEqual('one day');
});

test('five days can be formatted as expected', () => {
    expect(formatDuration(5 * 24 * 60 * 60 * 1000)).toEqual('5 days');
});

test('one week can be formatted as expected', () => {
    expect(formatDuration(7 * 24 * 60 * 60 * 1000)).toEqual('one week');
});

test('four weeks can be formatted as expected', () => {
    expect(formatDuration(4 * 7 * 24 * 60 * 60 * 1000)).toEqual('4 weeks');
});

test('one month can be formatted as expected', () => {
    expect(formatDuration(30 * 24 * 60 * 60 * 1000)).toEqual('one month');
});

test('ten months can be formatted as expected', () => {
    expect(formatDuration(10 * 30 * 24 * 60 * 60 * 1000)).toEqual('10 months');
});

test('one year can be formatted as expected', () => {
    expect(formatDuration(366 * 24 * 60 * 60 * 1000)).toEqual('one year');
});

test('ten years can be formatted as expected', () => {
    expect(formatDuration(10 * 366 * 24 * 60 * 60 * 1000)).toEqual('10 years');
});

test('1st December 2020 is formatted as expected', () => {
    expect(formatDate(new Date('2020-12-01'))).toEqual('1st December 2020');
});

test('2nd January 1900 is formatted as expected', () => {
    expect(formatDate(new Date('1900-01-02'))).toEqual('2nd January 1900');
});

test('3rd April 2001 is formatted as expected', () => {
    expect(formatDate(new Date('2001-04-03'))).toEqual('3rd April 2001');
});

test('12th May 2021 is formatted as expected', () => {
    expect(formatDate(new Date('2021-05-12'))).toEqual('12th May 2021');
});

test('21st September 2015 is formatted as expected', () => {
    expect(formatDate(new Date('2015-09-21'))).toEqual('21st September 2015');
});

test('22nd October 1800 is formatted as expected', () => {
    expect(formatDate(new Date('1800-10-22'))).toEqual('22nd October 1800');
});

test('23rd February 2000 is formatted as expected', () => {
    expect(formatDate(new Date('2000-02-23'))).toEqual('23rd February 2000');
});

test('31st July 1500 is formatted as expected', () => {
    expect(formatDate(new Date('1500-07-31'))).toEqual('31st July 1500');
});

test('date format precision can be month', () => {
    expect(formatDate(new Date('2000-07-31'), 'month')).toEqual('July 2000');
});

test('date format precision can be year', () => {
    expect(formatDate(new Date('2000-07-31'), 'year')).toEqual('2000');
});

test('date format precision can be hour', () => {
    expect(formatDate(new Date('2000-07-31T12:42:02.121'), 'hour')).toEqual('31st July 2000 12:00');
});

test('date format precision can be minute', () => {
    expect(formatDate(new Date('2000-07-31T12:42:02.121'), 'minute')).toEqual('31st July 2000 12:42');
});

test('date format precision can be second', () => {
    expect(formatDate(new Date('2000-07-31T12:42:02.121'), 'second')).toEqual('31st July 2000 12:42:02');
});

test('date format precision can be millisecond', () => {
    expect(formatDate(new Date('2000-07-31T12:42:02.121'), 'millisecond')).toEqual('31st July 2000 12:42:02.121');
});

test('date format can include full weekday', () => {
    expect(formatDate(new Date('2000-07-30'), 'day', 'full')).toEqual('Sunday, 30th July 2000');
});

test('date format can include short weekday', () => {
    expect(formatDate(new Date('2000-07-22'), 'day', 'short')).toEqual('Sat, 22nd July 2000');
});

test('date format can include only the weekday', () => {
    expect(formatDate(new Date('2000-07-26'), 'none', 'full')).toEqual('Wednesday');
});

test('time format includes only the time', () => {
    expect(formatTime(new Date('2000-07-31T12:42:02.121'))).toEqual('12:42');
});

test('time format precision can be hour', () => {
    expect(formatTime(new Date('2000-07-31T12:42:02.121'), 'hour')).toEqual('12:00');
});

test('time format precision can be minute', () => {
    expect(formatTime(new Date('2000-07-31T12:42:02.121'), 'minute')).toEqual('12:42');
});

test('time format precision can be second', () => {
    expect(formatTime(new Date('2000-07-31T12:42:02.121'), 'second')).toEqual('12:42:02');
});

test('time format precision can be millisecond', () => {
    expect(formatTime(new Date('2000-07-31T12:42:02.121'), 'millisecond')).toEqual('12:42:02.121');
});

test('adding one minute works as expected', () => {
    expect(addTime(new Date('2021-05-22T00:00:00'), 1, 'minute'))
        .toEqual(new Date('2021-05-22T00:01:00'));
});

test('adding 15 minute works as expected', () => {
    expect(addTime(new Date('2021-05-22T00:00:00'), 15, 'minute'))
        .toEqual(new Date('2021-05-22T00:15:00'));
});

test('adding 45 minute works as expected', () => {
    expect(addTime(new Date('2021-05-22T00:00:00'), 45, 'minute'))
        .toEqual(new Date('2021-05-22T00:45:00'));
});

test('adding 4 hours works as expected', () => {
    expect(addTime(new Date('2021-05-22T00:00:00'), 4, 'hour'))
        .toEqual(new Date('2021-05-22T04:00:00'));
});

test('adding 24 hours adds one day', () => {
    expect(addTime(new Date('2021-05-22T00:00:00'), 24, 'hour'))
        .toEqual(new Date('2021-05-23T00:00:00'));
});

test('adding one day works as expected', () => {
    expect(addTime(new Date('2021-05-22T00:00:00'), 1, 'day'))
        .toEqual(new Date('2021-05-23T00:00:00'));
});

test('adding three day works as expected', () => {
    expect(addTime(new Date('2021-05-22T00:00:00'), 3, 'day'))
        .toEqual(new Date('2021-05-25T00:00:00'));
});

test('adding one and a half day works as expected', () => {
    expect(addTime(new Date('2021-05-22T00:00:00'), 1.5, 'day'))
        .toEqual(new Date('2021-05-23T12:00:00'));
});

test('adding negative one day subtracts one day', () => {
    expect(addTime(new Date('2021-05-22T00:00:00'), -1, 'day'))
        .toEqual(new Date('2021-05-21T00:00:00'));
});

test('subtracting one day works as expected', () => {
    expect(subtractTime(new Date('2021-05-22T00:00:00'), 1, 'day'))
        .toEqual(new Date('2021-05-21T00:00:00'));
});

test('adding one month works on months with 31 days', () => {
    expect(addTime(new Date('2021-05-22T00:00:00'), 1, 'month'))
        .toEqual(new Date('2021-06-22T00:00:00'));
});

test('adding one month works on months with 30 days', () => {
    expect(addTime(new Date('2021-04-22T00:00:00'), 1, 'month'))
        .toEqual(new Date('2021-05-22T00:00:00'));
});

test('adding one month works on months with 28 days', () => {
    expect(addTime(new Date('2021-02-22T00:00:00'), 1, 'month'))
        .toEqual(new Date('2021-03-22T00:00:00'));
});

test('adding one month works on months with 29 days', () => {
    expect(addTime(new Date('2020-02-22T00:00:00'), 1, 'month'))
        .toEqual(new Date('2020-03-22T00:00:00'));
});

test('adding one and half month adds one month and 15 days', () => {
    expect(addTime(new Date('2020-02-01T00:00:00'), 1.5, 'month'))
        .toEqual(new Date('2020-03-16T00:00:00'));
});

test('adding one year works on leap years', () => {
    expect(addTime(new Date('2020-02-22T00:00:00'), 1, 'year'))
        .toEqual(new Date('2021-02-22T00:00:00'));
});

test('adding one year works on non-leap years', () => {
    expect(addTime(new Date('2021-02-22T00:00:00'), 1, 'year'))
        .toEqual(new Date('2022-02-22T00:00:00'));
});

test('relative time for small time in the past formats as `moments ago`', () => {
    expect(formatRelativeTime(new Date('2021-04-22T00:00:00'), new Date('2021-04-22T00:00:50')))
        .toEqual('moments ago');
});

test('lowest time precision in the past can be configuring', () => {
    expect(formatRelativeTime(new Date('2021-04-22T00:00:00'), new Date('2021-04-22T00:00:50'), 'second'))
        .toEqual('50 seconds ago');
});

test('one minute ago formats as expected', () => {
    expect(formatRelativeTime(new Date('2021-04-22T00:00:00'), new Date('2021-04-22T00:01:00')))
        .toEqual('one minute ago');
});

test('one and a quarter minutes ago gets rounded to one minute', () => {
    expect(formatRelativeTime(new Date('2021-04-22T00:00:00'), new Date('2021-04-22T00:01:15')))
        .toEqual('one minute ago');
});

test('one and a half minutes ago gets rounded to one minute', () => {
    expect(formatRelativeTime(new Date('2021-04-22T00:00:00'), new Date('2021-04-22T00:01:30')))
        .toEqual('one minute ago');
});

test('one day ago formats as expected', () => {
    expect(formatRelativeTime(new Date('2021-04-22T00:00:00'), new Date('2021-04-23T00:00:00')))
        .toEqual('one day ago');
});

test('five day ago formats as expected', () => {
    expect(formatRelativeTime(new Date('2021-04-22T00:00:00'), new Date('2021-04-27T00:00:00')))
        .toEqual('5 days ago');
});

test('one week ago formats as expected', () => {
    expect(formatRelativeTime(new Date('2021-04-22T00:00:00'), new Date('2021-04-29T00:00:00')))
        .toEqual('one week ago');
});

test('four weeks ago formats as expected', () => {
    expect(formatRelativeTime(new Date('2021-04-01T00:00:00'), new Date('2021-04-29T00:00:00')))
        .toEqual('4 weeks ago');
});

test('four months ago formats as expected', () => {
    expect(formatRelativeTime(new Date('2021-04-01T00:00:00'), new Date('2021-08-01T00:00:00')))
        .toEqual('4 months ago');
});

test('four years ago formats as expected', () => {
    expect(formatRelativeTime(new Date('2021-04-01T00:00:00'), new Date('2025-04-10T00:00:00')))
        .toEqual('4 years ago');
});

test('relative time for small time in the future formats as `in moments`', () => {
    expect(formatRelativeTime(new Date('2021-04-22T00:00:50'), new Date('2021-04-22T00:00:00')))
        .toEqual('in moments');
});

test('lowest time precision in the future can be configuring', () => {
    expect(formatRelativeTime(new Date('2021-04-22T00:00:50'), new Date('2021-04-22T00:00:00'), 'second'))
        .toEqual('in 50 seconds');
});

test('in one minute formats as expected', () => {
    expect(formatRelativeTime(new Date('2021-04-22T00:01:00'), new Date('2021-04-22T00:00:00')))
        .toEqual('in one minute');
});

test('in one and a quarter minutes gets rounded to one minute', () => {
    expect(formatRelativeTime(new Date('2021-04-22T00:01:15'), new Date('2021-04-22T00:00:00')))
        .toEqual('in one minute');
});

test('in one and a half minutes gets rounded to one minute', () => {
    expect(formatRelativeTime(new Date('2021-04-22T00:01:30'), new Date('2021-04-22T00:00:00')))
        .toEqual('in one minute');
});

test('in one day formats as expected', () => {
    expect(formatRelativeTime(new Date('2021-04-23T00:00:00'), new Date('2021-04-22T00:00:00')))
        .toEqual('in one day');
});

test('in five day formats as expected', () => {
    expect(formatRelativeTime(new Date('2021-04-27T00:00:00'), new Date('2021-04-22T00:00:00')))
        .toEqual('in 5 days');
});

test('in one week formats as expected', () => {
    expect(formatRelativeTime(new Date('2021-04-29T00:00:00'), new Date('2021-04-22T00:00:00')))
        .toEqual('in one week');
});

test('in four weeks formats as expected', () => {
    expect(formatRelativeTime(new Date('2021-04-29T00:00:00'), new Date('2021-04-01T00:00:00')))
        .toEqual('in 4 weeks');
});

test('in four months formats as expected', () => {
    expect(formatRelativeTime(new Date('2021-08-01T00:00:00'), new Date('2021-04-01T00:00:00')))
        .toEqual('in 4 months');
});

test('in four years formats as expected', () => {
    expect(formatRelativeTime(new Date('2025-04-10T00:00:00'), new Date('2021-04-01T00:00:00')))
        .toEqual('in 4 years');
});

test('duration formatting can contain multiple units', () => {
    expect(formatDuration(1.5 * 60 * 60 * 1000, 'minute', 2)).toEqual('one hour 30 minutes');
});

test('duration formatting can be short', () => {
    expect(formatDuration(1.5 * 60 * 60 * 1000, 'minute', 2, true)).toEqual('1h 30m');
});

test('get duration from amount and unit', () => {
    expect(durationFor(10, 'hour')).toEqual(10 * 60 * 60 * 1000);
});

