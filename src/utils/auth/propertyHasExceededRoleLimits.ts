import { Role, User } from "@prisma/client";
import prisma from "../../datasource/base";
import EnforceLimitOnProperties from "../../types/enforceLimitOnProperties";

const propertyHasExceededRoleLimits = async (
  user: User,
  property: EnforceLimitOnProperties
) => {
  console.log("propertyHasExceededRoleLimits", user, property);
  let dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      remindersCreatedThisMonth: true,
      role: true,
      roleName: true,
      _count: {
        select: {
          [property]: true,
        },
      },
    },
  });

  if (!dbUser) return true;

  if (dbUser.role || !dbUser.roleName) {
    // if user does not have a role, give them basic access
    dbUser = await prisma.user.update({
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
      select: {
        remindersCreatedThisMonth: true,
        role: true,
        roleName: true,
        _count: {
          select: {
            [property]: true,
          },
        },
      },
    });
  }

  const propertyCount =
    property === "reminders"
      ? dbUser.remindersCreatedThisMonth
      : dbUser._count[property] || 0;
  const rolePropertyKey = `${property}Limit` as keyof Role;
  const rolePropertyLimit = dbUser.role![rolePropertyKey] as number;

  if (
    dbUser.roleName?.toLocaleLowerCase() === "unlimited" ||
    dbUser.roleName?.toLocaleLowerCase() === "admin"
  )
    return false;

  if (propertyCount >= rolePropertyLimit) return true;

  return false;
};

export default propertyHasExceededRoleLimits;
