export const getReminderRuleDescription = (
  createdById: string,
  reminderId: string
): string => {
  return `reminder: ${reminderId} created by user: ${createdById}`;
};
