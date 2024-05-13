import { ExString } from "server/src/shared/String";
import locale from 'date-fns/locale/en-US';

const formatDistanceLocale = {
  lessThanXSeconds: '{{count}}s',
  xSeconds: '{{count}}s',
  halfAMinute: '30s',
  lessThanXMinutes: '{{count}}m',
  xMinutes: '{{count}}m',
  aboutXHours: '{{count}}h',
  xHours: '{{count}}h',
  xDays: '{{count}}d',
  aboutXWeeks: '{{count}}w',
  xWeeks: '{{count}}w',
  aboutXMonths: '{{count}}m',
  xMonths: '{{count}}m',
  aboutXYears: '{{count}}y',
  xYears: '{{count}}y',
  overXYears: '{{count}}y',
  almostXYears: '{{count}}y'
};

export const timeStringFromTimestamp = (timestamp) => {
  const date = new Date(timestamp);

  let mins = date.getMinutes();
  let minString = ExString.zeroPrefixed(mins);
  let hours = date.getHours();
  return hours + ":" + minString;
};

export const dateStringFromTimestamp = (timestamp, skipTime) => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = String(date.getFullYear());

  const dateString = day + " / " + month + " / " + year.slice(year.length - 2);
  if (skipTime) return dateString;

  const timeString = timeStringFromTimestamp(timestamp);
  return timeString + " on " + dateString;
};

export const customLocale = {
  ...locale,
  formatDistance: (token, count, options) => {
    options = options || {};

    const result = formatDistanceLocale[token].replace('{{count}}', count);

    if (options.addSuffix) {
      if (options.comparison > 0) {
        return 'in ' + result;
      } else {
        return result + ' ago';
      }
    }

    return result;
  }
};
