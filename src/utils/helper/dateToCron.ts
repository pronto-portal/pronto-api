import moment from "moment";

export const dateToCron = (dateString: string) => {
  // todo: ensure all date string coming into the backend get converted into utc time
  const dateTime = moment.utc(dateString);

  const day = dateTime.day;
  const month = dateTime.month;
  const year = dateTime.year;
  const hour = dateTime.hour;
  const minute = dateTime.minute;

  const cron = `${minute} ${hour} ${day} ${month} ? ${year}`;
  return cron;
};
