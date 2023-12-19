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
}

export const deleteRule = async ({
  reminderId,
  translatorPhoneNumber,
  claimantPhoneNumber,
  translatorMessage,
  claimantMessage,
  claimantLanguage,
  sendSMSUpdate = true,
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
        }).then(() => {
          return sendSMS({
            phoneNumber: claimantPhoneNumber,
            message: translatedClaimantMessage,
          })
            .then(() => true)
            .catch(() => false);
        });
      });

    console.log("deleteRule response", response);
    return {
      success: response,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
};
