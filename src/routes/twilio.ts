import bodyParser from "body-parser";
import { Router } from "express";
import twilio from "twilio";
import prisma from "../datasource/base";
import { TranslateText } from "../utils/helper/translateText";

const router = Router();
const MessagingResponse = twilio.twiml.MessagingResponse;
const TWILIO_WEBHOOK_URL = process.env.TWILIO_WEBHOOK_URL!;

router.use(bodyParser.urlencoded({ extended: false }));

// This will not work unless you set the TWILIO_AUTH_TOKEN environment
router.post(
  "/",
  twilio.webhook({
    url: TWILIO_WEBHOOK_URL,
  }),
  async (req, res) => {
    const twiml = new MessagingResponse();
    const messageBody: string = req.body.Body.toLowerCase();
    const number = req.body.From;

    const translatedToEnglishMessageBody = (
      await TranslateText(messageBody, "en")
    ).toLowerCase();

    if (messageBody === "stop") {
      twiml.message("You have successfully unsubscribed from our service.");

      if (number) {
        // Todo, create phone number table to query for phone numbers
        prisma.phoneNumber.update({
          where: {
            number,
          },
          data: {
            optedOut: true,
            dateTimeOptedOut: new Date(),
          },
        });
      }
    }
    if (messageBody === "yes" || translatedToEnglishMessageBody === "yes") {
      twiml.message(
        "You have successfully subscribed to our service. You will now receive reminders for your upcoming appointments. Reply STOP to unsubscribe."
      );

      if (number) {
        prisma.phoneNumber.updateMany({
          where: {
            number,
          },
          data: {
            optedOut: false,
            dateTimeOptedIn: new Date(),
          },
        });
      }
    } else {
      twiml.message(
        "No Body param match, Twilio sends this in the request to your server."
      );
    }

    res.type("text/xml").send(twiml.toString());
  }
);

// Reply STOP to unsubscribe

export default router;
