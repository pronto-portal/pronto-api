import * as Phone from "phone";

export const isProfileComplete = (
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  phone: string | null | undefined
): boolean => {
  const isPhoneValid = phone ? Phone.phone(phone).isValid : false;
  if (!firstName) throw new Error("First Name required");

  if (!lastName) throw new Error("Last Name required");

  if (!isPhoneValid) throw new Error("Phone is invalid");

  return true;
};
