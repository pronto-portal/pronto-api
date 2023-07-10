import moment from "moment";

export const dateToCron = (dateString: string) => {
  // todo: ensure all date string coming into the backend get converted into utc time
  const dateTime = moment.utc(dateString);

  const day = dateTime.day.toString();
  const month = dateTime.month.toString();
  const year = dateTime.year.toString();
  const hour = dateTime.hour.toString();
  const minute = dateTime.minute.toString();

  const cron = `${minute} ${hour} ${day} ${month} ? ${year}`;
  return cron;
};
