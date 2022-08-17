import moment from 'moment';

export const getDisplayDate = time => {
  const timeMoment = moment(time);
  const diff = moment().diff(timeMoment);
  if (diff > 86400000) {
    return moment(time).format('MMM D');
  } else {
    if (diff > 3600000) {
      return `${Math.round(diff / 3600000)}h`;
    } else if (diff > 60000) {
      return `${Math.round(diff / 60000)}m`;
    } else {
      return 'now';
    }
  }
};
