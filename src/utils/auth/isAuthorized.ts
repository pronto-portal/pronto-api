import { Context } from "../../graphql/schema/context";
import { RoleNames } from "../../types";
import { isAuthorizedBase } from "./isAuthorizedBase";

export const isAuthorized = async (
  { res, req }: Context,
  roleName: RoleNames = "basic"
) => {
  return isAuthorizedBase({ res, req }, roleName);
};
