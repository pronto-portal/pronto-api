import { eventBridge } from "../../aws/eventBridge";
import { phoneNumberIsValid } from "./phoneNumberIsValid";
import { TranslateText } from "./translateText";
import { dateToCron } from "./dateToCron";
import { getReminderRuleDescription } from "./getReminderRuleDescription";
import { getReminderRuleName } from "./getReminderRuleName";

interface CreateRuleArgs {
  reminderId: string;
  createdById: string;
  translatorPhoneNumber: string;
  claimantPhoneNumber: string;
  translatorMessage: string;
  claimantMessage: string;
  claimantLanguage: string;
  cronString: string;
}

export const createRule = async ({
  reminderId,
  createdById,
  translatorPhoneNumber,
  claimantPhoneNumber,
  translatorMessage,
  claimantMessage,
  claimantLanguage,
  cronString,
}: CreateRuleArgs): Promise<{
  success: boolean;
}> => {
  try {
    const translatorPhoneIsValid = phoneNumberIsValid(translatorPhoneNumber);
    const claimantPhoneIsValid = phoneNumberIsValid(claimantPhoneNumber);

    if (!translatorPhoneIsValid || !claimantPhoneIsValid) {
      throw new Error("Invalid phone number");
    }
    const translatedClaimantMessage = await TranslateText(
      claimantMessage,
      claimantLanguage
    );

    const ruleName = getReminderRuleName(reminderId);

    const response = await eventBridge
      .putRule({
        Name: ruleName,
        Description: getReminderRuleDescription(createdById, reminderId),
        ScheduleExpression: `cron(${cronString})`,
        State: "ENABLED",
        RoleArn: process.env.EVENT_RULE_ROLE_ARN,
      })
      .promise()
      .then(() => {
        return eventBridge
          .putTargets({
            Rule: ruleName,
            Targets: [
              {
                Id: reminderId,
                Arn: process.env.REMINDER_FUNCTION_ARN!,
                Input: JSON.stringify({
                  payload: {
                    translatorPhone: translatorPhoneNumber,
                    translatorMessage,
                    claimantPhone: claimantPhoneNumber,
                    claimantMessage: translatedClaimantMessage,
                  },
                }),
              },
            ],
          })
          .promise()
          .then(() => true)
          .catch(() => false);
      });

    console.log("createRule response", response);
    return {
      success: response,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
};
