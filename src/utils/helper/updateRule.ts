import { eventBridge } from "../../aws/eventBridge";
import { phoneNumberIsValid } from "./phoneNumberIsValid";
import { TranslateText } from "./translateText";
import { dateToCron } from "./dateToCron";
import { getReminderRuleName } from "./getReminderRuleName";

interface UpdateRuleArgs {
  reminderId: string;
  translatorPhoneNumber?: string;
  claimantPhoneNumber?: string;
  translatorMessage?: string;
  claimantMessage?: string;
  claimantLanguage?: string;
  dateTime?: Date;
}

export const updateRule = async ({
  reminderId,
  translatorPhoneNumber,
  claimantPhoneNumber,
  translatorMessage,
  claimantMessage,
  claimantLanguage,
  dateTime,
}: UpdateRuleArgs): Promise<{
  success: boolean;
}> => {
  console.log("Attempting to update rule...");
  try {
    if (translatorPhoneNumber && claimantPhoneNumber) {
      console.log("Checking phone numbers...");
      const translatorPhoneIsValid = phoneNumberIsValid(translatorPhoneNumber);
      const claimantPhoneIsValid = phoneNumberIsValid(claimantPhoneNumber);

      if (!translatorPhoneIsValid || !claimantPhoneIsValid) {
        throw new Error("Invalid phone number");
      }
    }

    console.log("Checking reminderId...", reminderId);
    const ruleName = getReminderRuleName(reminderId);

    console.log("ruleName", ruleName);

    const currentRule = await eventBridge
      .describeRule({ Name: ruleName })
      .promise()
      .catch((err) => {
        console.log("updateRule eventbridge describeRule error", err);
        return undefined;
      });

    const currentRuleTargets = await eventBridge
      .listTargetsByRule({ Rule: ruleName })
      .promise()
      .catch((err) => {
        console.log("updateRule eventbridge listTargetsByRule error", err);
        return {
          Targets: [],
        };
      });

    const currentRuleTarget = currentRuleTargets.Targets?.find(
      (target) => target.Id === reminderId
    );

    const currentRuleTargetInput =
      currentRuleTarget && currentRuleTarget.Input
        ? JSON.parse(currentRuleTarget.Input)
        : undefined;

    console.log("currentRule", currentRule);
    console.log("currentRuleTargetInput", currentRuleTargetInput);
    // We can only update the target payload if it exists and if the rule exists
    if (currentRule && currentRuleTargetInput) {
      console.log("Updating rule...");
      const currentDateTimeCron = currentRule.ScheduleExpression;

      console.log("currentDateTimeCron", currentDateTimeCron);

      const dateTimeCronScheduledExpression = dateTime
        ? `cron(${dateToCron(dateTime.toString())})`
        : currentDateTimeCron;

      console.log(
        "dateTimeCronScheduledExpression",
        dateTimeCronScheduledExpression
      );
      const updatedRule = await eventBridge
        .putRule({
          Name: ruleName,
          Description: currentRule.Description,
          ScheduleExpression: dateTimeCronScheduledExpression,
          State: "ENABLED",
          RoleArn: process.env.EVENT_RULE_ROLE_ARN!,
        })
        .promise()
        .then(() => true)
        .catch((err) => {
          console.log("updateRule eventbridge putRule error", err);
          return false;
        });

      if (!updatedRule) {
        return {
          success: false,
        };
      }

      if (translatorPhoneNumber) {
        currentRuleTargetInput.payload.translatorPhone = translatorPhoneNumber;
      }
      if (claimantPhoneNumber) {
        currentRuleTargetInput.payload.claimantPhone = claimantPhoneNumber;
      }
      if (translatorMessage) {
        currentRuleTargetInput.payload.translatorMessage = translatorMessage;
      }
      if (claimantMessage && claimantLanguage) {
        const translatedClaimantMessage = await TranslateText(
          claimantMessage,
          claimantLanguage
        );
        currentRuleTargetInput.payload.claimantMessage =
          translatedClaimantMessage;
      }

      const updatedRuleTarget = await eventBridge
        .putTargets({
          Rule: ruleName,
          Targets: [
            {
              Id: reminderId,
              Arn: process.env.REMINDER_FUNCTION_ARN!,
              Input: JSON.stringify(currentRuleTargetInput),
            },
          ],
        })
        .promise()
        .then(() => true)
        .catch((err) => {
          console.log("updateRule eventbridge putTargets error", err);
          return false;
        });

      if (!updatedRuleTarget) {
        return {
          success: false,
        };
      }
    } else {
      return {
        success: false,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
};
