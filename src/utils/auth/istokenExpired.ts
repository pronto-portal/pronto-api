import { JwtPayload } from "jsonwebtoken";

export const isTokenExpired = ({ exp }: JwtPayload) => {
  if (exp !== undefined && exp < Date.now() / 1000) return true;

  return false;
};
