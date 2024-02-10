import { User } from "@prisma/client";
import { RoleNames } from "../../types";
import prisma from "../../datasource/base";

export const enforceUserRole = async (
  user?: User,
  roleName: RoleNames = "basic"
) => {
  if (!user) return false;

  if (!user.roleName) {
    // if user does not have a role, give them basic access
    await prisma.user
      .update({
        where: {
          id: user.id,
        },
        data: {
          role: {
            connect: {
              name: "Basic",
            },
          },
        },
      })
      .then(() => console.log("Updated user role to basic"))
      .catch((err) => console.error(err));
  }

  const userRole: RoleNames = (
    user.roleName || "basic"
  ).toLocaleLowerCase() as RoleNames;

  // console.log("----------------------------");
  // console.log("USER ROLE", userRole);
  // console.log("ROLE NAME", roleName);

  if (
    userRole === "admin" &&
    (roleName === "basic" || roleName === "premium" || roleName === "unlimited")
  ) {
    return true;
  }
  if (
    userRole === "unlimited" &&
    (roleName === "basic" || roleName === "premium" || roleName === "unlimited")
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

  return false;
};
