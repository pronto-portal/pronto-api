export interface Word {
  label: string;
  word: string;
}

// should be executued before claimant message gets translated
const substituteWordsReminderMessage = (words: Word[], message: string) => {
  console.log("substituteWordsReminderMessage");
  console.log("words", words);
  console.log("message", message);
  console.log("------");
  const newMessage = words.reduce(
    (acc, { label, word }) => acc.replaceAll(`{{${label}}}`, word),
    message
  );

  return newMessage;
};

export default substituteWordsReminderMessage;
