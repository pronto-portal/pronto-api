import { AES } from "crypto-js";

export const encryptRefreshToken = (token: string) => {
  const encrypted = AES.encrypt(
    token,
    process.env.TOKEN_ENCRYPT_SECRET!
  ).toString();

  return encrypted;
};
