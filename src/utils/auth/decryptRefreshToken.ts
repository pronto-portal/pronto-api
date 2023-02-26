import { AES } from "crypto-js";

export const decryptRefreshToken = (encryptedToken: string) =>
  AES.decrypt(encryptedToken, process.env.TOKEN_ENCRYPT_SECRET!).toString();
