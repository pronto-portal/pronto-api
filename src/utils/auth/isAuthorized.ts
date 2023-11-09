import { Context } from "../../graphql/schema/context";
import { RoleNames } from "../../types";
import { isAuthorizedBase } from "./isAuthorizedBase";
import propertyHasExceededRoleLimits from "./propertyHasExceededRoleLimits";

export const isAuthorized = async (
  { res, req, user }: Context,
  roleName: RoleNames = "basic",
  enforceRoleLimits = false,
  roleLimitsProperty = ""
) => {
  const userIsWithinRoleLimits =
    enforceRoleLimits && roleLimitsProperty
      ? !(await propertyHasExceededRoleLimits(user, roleLimitsProperty))
      : true;

  return isAuthorizedBase({ res, req }, roleName).then((isAuth) => {
    return isAuth && userIsWithinRoleLimits;
  });
};
