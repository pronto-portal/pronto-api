import phone from "phone";

export const phoneNumberIsValid = (phoneNumber: string): boolean => {
  const phoneInfo = phone(phoneNumber);
  return phoneInfo.isValid;
};
