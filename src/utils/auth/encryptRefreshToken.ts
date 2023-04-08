import { AES } from "crypto-js";

export const encryptRefreshToken = (token: string) => {
  console.log(`Encrypting this token: ${token}`);
  console.log(`with: ${process.env.TOKEN_ENCRYPT_SECRET}`);
  const encrypted = AES.encrypt(
    token,
    process.env.TOKEN_ENCRYPT_SECRET!
  ).toString();
  console.log("ENCRYPTED TOKEN: ", encrypted);

  return encrypted;
};
