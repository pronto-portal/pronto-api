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
  assignmentDate: Date;
  claimantOptedOut: boolean;
  translatorOptedOut: boolean;
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
  assignmentDate,
  claimantOptedOut,
  translatorOptedOut,
}: CreateRuleArgs): Promise<{
  success: boolean;
}> => {
  try {
    const translatorPhoneIsValid = phoneNumberIsValid(translatorPhoneNumber);
    const claimantPhoneIsValid = phoneNumberIsValid(claimantPhoneNumber);

    if (!translatorPhoneIsValid || !claimantPhoneIsValid) {
      console.log("Invalid phone number");
      throw new Error("Invalid phone number");
    }
    const translatedClaimantMessage = await TranslateText(
      claimantMessage,
      claimantLanguage
    );

    const ruleName = getReminderRuleName(reminderId);

    console.log("attempting to put rule");
    console.log("schedule expression", `cron(${cronString})`);
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
        console.log("putting targets");
        return eventBridge
          .putTargets({
            Rule: ruleName,
            Targets: [
              {
                Id: reminderId,
                Arn: process.env.REMINDER_FUNCTION_ARN!,
                Input: JSON.stringify({
                  payload: {
                    translatorPhone: !translatorOptedOut
                      ? translatorPhoneNumber
                      : "",
                    translatorMessage,
                    claimantPhone: claimantPhoneNumber,
                    claimantMessage: !claimantOptedOut
                      ? translatedClaimantMessage
                      : "",
                    ruleName,
                    assignmentDate: assignmentDate.toISOString(),
                  },
                }),
              },
            ],
          })
          .promise()
          .then(() => true)
          .catch((err) => {
            console.log("put targets error", err);
            return false;
          });
      })
      .catch((err) => {
        console.log("put rule error", err);
        return false;
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
