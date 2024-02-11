import { Address, Claimant, NonUserTranslator } from "@prisma/client";
import substituteWordsReminderMessage, {
  Word,
} from "./substituteWordsReminderMessage";
import formatAMPM from "./formatAMPM";
import { TranslateText } from "./translateText";
import moment from "moment-timezone";

const parseReminderMessages = async (
  translatorMessage: string,
  claimantMessage: string,
  localTimeZone: string = "UTC",
  claimant?: Claimant | null,
  translator?: NonUserTranslator | null,
  address?: Address | null,
  dateTime?: Date | null
) => {
  const formattedAddressText: string = address
    ? `${address.address1}${address.address2 ? `, ${address.address2}` : ""} ${
        address.city
      }, ${address.state} ${address.zipCode}`
    : "";
  const addressWords: Word[] = formattedAddressText
    ? [{ label: "Address", word: formattedAddressText }]
    : [];

  console.log("----------------------------");
  console.log("Date time ", dateTime);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log("localTimeZone", localTimeZone);

  console.log("moment utc", moment.utc(dateTime));
  console.log("typeof datetime", typeof dateTime);
  console.log(
    "moment.utc(dateTime).tz(localTimeZone)",
    moment.utc(dateTime).tz(localTimeZone)
  );

  const localDate = moment.utc(dateTime).tz(localTimeZone).toDate();

  console.log("Local date", localDate);
  console.log("Time zone ", timezone);
  const dateWords: Word[] = dateTime
    ? [
        { label: "Date", word: localDate.toLocaleDateString() },
        { label: "Time", word: formatAMPM(localDate) },
      ]
    : [];

  console.log("dateWords", dateWords);

  const sharedWords: Word[] = [...dateWords, ...addressWords];

  const claimantWords: Word[] = claimant
    ? [
        { label: "First Name", word: claimant.firstName },
        { label: "Last Name", word: claimant.lastName },
        { label: "Email", word: claimant.email },
        { label: "phone", word: claimant.phone },
        ...sharedWords,
      ]
    : [...sharedWords];

  const translatorWords: Word[] = translator
    ? [
        { label: "First Name", word: translator.firstName || "" },
        { label: "Last Name", word: translator.lastName || "" },
        { label: "Email", word: translator.email },
        { label: "phone", word: translator.phone || "" },
        ...sharedWords,
      ]
    : [...sharedWords];

  const subtitutedClaimantMessage = substituteWordsReminderMessage(
    claimantWords,
    claimantMessage
  );
  const primaryLanguage = claimant?.primaryLanguage || "";

  let translatedClaimantMessage = subtitutedClaimantMessage;

  if (primaryLanguage) {
    translatedClaimantMessage = await TranslateText(
      subtitutedClaimantMessage,
      primaryLanguage
    );
  }

  // profanity filter should go here

  return {
    translatorMessage: substituteWordsReminderMessage(
      translatorWords,
      translatorMessage
    ),
    claimantMessage: translatedClaimantMessage,
  };
};

export default parseReminderMessages;
