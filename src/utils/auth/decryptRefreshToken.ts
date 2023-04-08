import { AES, enc } from "crypto-js";

export const decryptRefreshToken = (encryptedToken: string) => {
  const bytes = AES.decrypt(encryptedToken, process.env.TOKEN_ENCRYPT_SECRET!);
  const decryptedToken = bytes.toString(enc.Utf8);
  return decryptedToken;
};
