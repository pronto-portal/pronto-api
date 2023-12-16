import client from "twilio";

interface SendSMSArgs {
  phoneNumber: string;
  message: string;
}

export const sendSMS = async ({ phoneNumber, message }: SendSMSArgs) => {
  const msg = client()
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
};
