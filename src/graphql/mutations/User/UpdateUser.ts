import { mutationField, nonNull } from "nexus";
import { Context } from "../../schema/context";
import { UserType } from "../../types";
import { UpdateUserInput } from "../../types/inputTypes/User/updateUser";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const UpdateUser = mutationField("updateUser", {
  type: UserType,
  args: {
    data: nonNull(UpdateUserInput),
  },
  authorize: async (root, args, ctx) => await isAuthorized(ctx),
  async resolve(
    _root,
    {
      data: {
        firstName,
        lastName,
        phone,
        profilePic,
        isManager,
        isTranslator,
        isProfileComplete,
      },
    },
    { user, prisma }: Context
  ) {
    const updatedUser = await prisma.user.update({
      where: { id: user!.id },
      data: {
        phone: phone || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        profilePic: profilePic || undefined,
        isManager: isManager || undefined,
        isTranslator: isTranslator || undefined,
        isProfileComplete: isProfileComplete || undefined,
      },
    });

    return updatedUser;
  },
});
