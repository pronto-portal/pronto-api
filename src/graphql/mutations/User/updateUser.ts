import { mutationField, nonNull } from "nexus";
import { Context } from "../../schema/context";
import { UserType } from "../../types";
import { UpdateUserInput } from "../../types/inputTypes/User/updateUser";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const UpdateUser = mutationField("updateUser", {
  type: UserType,
  args: {
    input: nonNull(UpdateUserInput),
  },
  authorize: async (root, args, ctx) => await isAuthorized(ctx),
  async resolve(
    _root,
    {
      input: {
        id,
        firstName,
        lastName,
        phone,
        profilePic,
        isManager,
        isTranslator,
        isProfileComplete,
        city,
        state,
        languages,
      },
    },
    { prisma }: Context
  ) {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        phone: phone || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        profilePic: profilePic || undefined,
        isManager: isManager || undefined,
        isTranslator: isTranslator || undefined,
        isProfileComplete: isProfileComplete || undefined,
        languages: languages || undefined,
        city: city || undefined,
        state: state || undefined,
      },
    });

    return updatedUser;
  },
});
