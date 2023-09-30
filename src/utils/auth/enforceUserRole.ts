import { User } from "@prisma/client";
import { RoleNames } from "../../types";

export const enforceUserRole = (user?: User, roleName: RoleNames = "basic") => {
  if (!user) return false;

  const userRole: RoleNames = (user.roleName || "basic") as RoleNames;
  const userHasRole = userRole === roleName;

  if (userHasRole) {
    if (
      userRole === "admin" &&
      (roleName === "basic" ||
        roleName === "premium" ||
        roleName === "unlimited")
    ) {
      return true;
    }
    if (
      userRole === "unlimited" &&
      (roleName === "basic" ||
        roleName === "premium" ||
        roleName === "unlimited")
    ) {
      return true;
    }
    if (
      userRole === "premium" &&
      (roleName === "basic" || roleName === "premium")
    ) {
      return true;
    }
    if (userRole === "basic" && roleName === "basic") {
      return true;
    }
  }

  return false;
};
