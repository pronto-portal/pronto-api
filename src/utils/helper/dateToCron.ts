import moment from "moment";

export const dateToCron = (dateString: string) => {
  // todo: ensure all date string coming into the backend get converted into utc time

  console.log("Date String", dateString);
  const dateTime = moment.utc(dateString);

  const day = dateTime.date();
  const month = dateTime.month() + 1;
  const year = dateTime.year();
  const hour = dateTime.hour();
  const minute = dateTime.minute();

  // min hr day_of_month month day_of_week year
  const cron = `${minute} ${hour} ${day} ${month} ? ${year}`;
  return cron;
};
