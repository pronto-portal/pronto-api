import client from "twilio";

interface SendSMSArgs {
  phoneNumber: string;
  message: string;
  recepientIsOptedOut: boolean;
}

export const sendSMS = async ({
  phoneNumber,
  message,
  recepientIsOptedOut,
}: SendSMSArgs) => {
  console.log(
    "TWILIO ENV VARS",
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH_TOKEN,
    process.env.TWILIO_PHONE
  );
  if (recepientIsOptedOut) {
    console.log("Recipient has opted out of SMS notifications");
    return "";
  } else {
    const msg = client(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!)
      .messages.create({
        from: process.env.TWILIO_PHONE!,
        to: phoneNumber,
        body: message,
      })
      .then((res) => {
        console.log("TWILIO MESSAGE SENT");
        console.log(res);
        return res;
      })
      .catch((err) => {
        console.log("TWILIO MESSAGE FAILED TO SEND");
        console.log(err);
        return err;
      });

    return msg;
  }
};
