import moment from "moment";

export const dateToCron = (dateString: string) => {
  // todo: ensure all date string coming into the backend get converted into utc time
  const dateTime = moment.utc(dateString);

  const day = dateTime.day();
  const month = dateTime.month();
  const year = dateTime.year();
  const hour = dateTime.hour();
  const minute = dateTime.minute();

  console.log("DATE TO CRON FUNCTION");
  console.log("date string", dateString);
  console.log("dateTime", dateTime);
  console.log("day", day);
  console.log("month", month);
  console.log("year", year);
  console.log("hour", hour);
  console.log("minute", minute);

  const cron = `${minute} ${hour} ${day} ${month} ? ${year}`;
  return cron;
};
