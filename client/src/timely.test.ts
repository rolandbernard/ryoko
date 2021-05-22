
import { formatTime, formatDuration, formatRelativeTime } from 'timely';

test('small durations format as `moments`', () => {
    expect(formatDuration(10 * 1000)).toEqual('moments');
});

test('the smallest duration unit can be configured', () => {
    expect(formatDuration(10 * 60 * 1000, 'hour')).toEqual('moments');
});

test('one millisecond can be formated as expected', () => {
    expect(formatDuration(1, 'millisecond')).toEqual('one millisecond');
});

test('ten milliseconds can be formated as expected', () => {
    expect(formatDuration(10, 'millisecond')).toEqual('10 milliseconds');
});

test('one second can be formated as expected', () => {
    expect(formatDuration(1000, 'second')).toEqual('one second');
});

test('ten seconds can be formated as expected', () => {
    expect(formatDuration(10 * 1000, 'second')).toEqual('10 seconds');
});

test('one minute can be formated as expected', () => {
    expect(formatDuration(60 * 1000)).toEqual('one minute');
});

test('ten minutes can be formated as expected', () => {
    expect(formatDuration(10 * 60 * 1000)).toEqual('10 minutes');
});

test('one hour can be formated as expected', () => {
    expect(formatDuration(60 * 60 * 1000)).toEqual('one hour');
});

test('ten hours can be formated as expected', () => {
    expect(formatDuration(10 * 60 * 60 * 1000)).toEqual('10 hours');
});

test('one day can be formated as expected', () => {
    expect(formatDuration(24 * 60 * 60 * 1000)).toEqual('one day');
});

test('five days can be formated as expected', () => {
    expect(formatDuration(5 * 24 * 60 * 60 * 1000)).toEqual('5 days');
});

test('one week can be formated as expected', () => {
    expect(formatDuration(7 * 24 * 60 * 60 * 1000)).toEqual('one week');
});

test('four weeks can be formated as expected', () => {
    expect(formatDuration(4 * 7 * 24 * 60 * 60 * 1000)).toEqual('4 weeks');
});

test('one month can be formated as expected', () => {
    expect(formatDuration(30 * 24 * 60 * 60 * 1000)).toEqual('one month');
});

test('ten months can be formated as expected', () => {
    expect(formatDuration(10 * 30 * 24 * 60 * 60 * 1000)).toEqual('10 months');
});

test('one month can be formated as expected', () => {
    expect(formatDuration(366 * 24 * 60 * 60 * 1000)).toEqual('one year');
});

test('ten months can be formated as expected', () => {
    expect(formatDuration(10 * 366 * 24 * 60 * 60 * 1000)).toEqual('10 years');
});

test('1st December 2020 is formated as expected', () => {
    expect(formatTime(new Date('2020-12-01'))).toEqual('1st December 2020');
});

test('2nd January 1900 is formated as expected', () => {
    expect(formatTime(new Date('1900-01-02'))).toEqual('2nd January 1900');
});

test('3rd April 2001 is formated as expected', () => {
    expect(formatTime(new Date('2001-04-03'))).toEqual('3rd April 2001');
});

test('12th May 2021 is formated as expected', () => {
    expect(formatTime(new Date('2021-05-12'))).toEqual('12th May 2021');
});

test('21st September 2015 is formated as expected', () => {
    expect(formatTime(new Date('2015-09-21'))).toEqual('21st September 2015');
});

test('22nd October 1800 is formated as expected', () => {
    expect(formatTime(new Date('1800-10-22'))).toEqual('22nd October 1800');
});

test('23rd February 2000 is formated as expected', () => {
    expect(formatTime(new Date('2000-02-23'))).toEqual('23rd February 2000');
});

test('31st July 1500 is formated as expected', () => {
    expect(formatTime(new Date('1500-07-31'))).toEqual('31st July 1500');
});

// TODO

