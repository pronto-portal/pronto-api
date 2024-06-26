import { eventBridge } from "../../aws/eventBridge";
import { sendSMS } from "../sendSMS";
import { getReminderRuleName } from "./getReminderRuleName";
import { phoneNumberIsValid } from "./phoneNumberIsValid";
import { TranslateText } from "./translateText";

interface DeleteRuleArgs {
  reminderId: string;
  translatorPhoneNumber: string;
  claimantPhoneNumber: string;
  translatorMessage: string;
  claimantMessage: string;
  claimantLanguage: string;
  sendSMSUpdate?: boolean;
  claimantOptedOut: boolean;
  translatorOptedOut: boolean;
}

export const deleteRule = async ({
  reminderId,
  translatorPhoneNumber,
  claimantPhoneNumber,
  translatorMessage,
  claimantMessage,
  claimantLanguage,
  sendSMSUpdate = true,
  claimantOptedOut,
  translatorOptedOut,
}: DeleteRuleArgs): Promise<{
  success: boolean;
}> => {
  try {
    const translatorPhoneIsValid = phoneNumberIsValid(translatorPhoneNumber);
    const claimantPhoneIsValid = phoneNumberIsValid(claimantPhoneNumber);

    if (sendSMSUpdate && (!translatorPhoneIsValid || !claimantPhoneIsValid)) {
      throw new Error("Invalid phone number");
    }
    const translatedClaimantMessage = sendSMSUpdate
      ? await TranslateText(claimantMessage, claimantLanguage)
      : "";

    const ruleName = getReminderRuleName(reminderId);

    const response = await eventBridge
      .removeTargets({
        Rule: ruleName,
        Ids: [reminderId],
      })
      .promise()
      .then(() =>
        eventBridge
          .deleteRule({
            Name: ruleName,
          })
          .promise()
          .then(() => {
            if (!sendSMSUpdate) {
              return true;
            }

            return sendSMS({
              phoneNumber: translatorPhoneNumber,
              message: translatorMessage,
              recepientIsOptedOut: translatorOptedOut,
            }).then(() => {
              return sendSMS({
                phoneNumber: claimantPhoneNumber,
                message: translatedClaimantMessage,
                recepientIsOptedOut: claimantOptedOut,
              })
                .then(() => true)
                .catch(() => false);
            });
          })
      )
      .catch((err) => {
        console.log("deleteRule error", err);
        return err;
      });

    console.log("deleteRule response", response);
    return {
      success: response,
    };
  } catch (error) {
    console.log("deleteRule error", error);
    return {
      success: false,
    };
  }
};
