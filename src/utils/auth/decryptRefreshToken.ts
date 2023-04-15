import { AES } from "crypto-js";
import ENC from "crypto-js/enc-utf8";

export const decryptRefreshToken = (encryptedToken: string) => {
  const decrypted = AES.decrypt(
    decodeURIComponent(encryptedToken),
    process.env.TOKEN_ENCRYPT_SECRET!
  ).toString(ENC);
  return decrypted;
};
