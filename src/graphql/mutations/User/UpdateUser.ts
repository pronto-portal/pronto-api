import { mutationField, nonNull } from "nexus";
import { Context } from "../../schema/context";
import { UserType } from "../../types";
import { UpdateUserInput } from "../../types/inputTypes/User/updateUser";

export const UpdateUser = mutationField("updateUser", {
  type: UserType,
  args: {
    data: nonNull(UpdateUserInput),
  },
  async resolve(
    _root,
    {
      data: { firstName, lastName, phone, profilePic, isManager, isTranslator },
    },
    ctx: Context
  ) {
    const user = await ctx.prisma.user.update({
      where: { id: ctx.userId },
      data: {
        phone: phone || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        profilePic: profilePic || undefined,
        isManager: isManager || undefined,
        isTranslator: isTranslator || undefined,
      },
    });

    return user;
  },
});
