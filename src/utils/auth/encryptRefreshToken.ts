import { AES } from "crypto-js";

export const encryptRefreshToken = (token: string) =>
  AES.encrypt(token, process.env.TOKEN_ENCRYPTION_SECRET!).toString();
