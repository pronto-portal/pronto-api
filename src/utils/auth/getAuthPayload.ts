import { User } from "@prisma/client";
import { parseAuthHeader } from "./parseAuthHeader";
import { decode } from "jsonwebtoken";

const getAuthPayload = (header?: string): User | undefined => {
  const token = parseAuthHeader(header);

  if (!token) return undefined;

  const decodedToken = decode(token) as User;

  return decodedToken;
};

export default getAuthPayload;
