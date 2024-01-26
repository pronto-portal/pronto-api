export interface Word {
  label: string;
  word: string;
}

// should be executued before claimant message gets translated
const substituteWordsReminderMessage = (words: Word[], message: string) => {
  const newMessage = words.reduce(
    (acc, { label, word }) => acc.replaceAll(`{{${label}}}`, word),
    message
  );

  return newMessage;
};

export default substituteWordsReminderMessage;
