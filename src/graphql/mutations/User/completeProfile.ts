import { mutationField, nonNull } from "nexus";
import { Context } from "../../schema/context";
import { CompleteProfileInput, UserType } from "../../types";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { isProfileComplete } from "../../../utils/helper/isProfileComplete";

export const CompleteProfile = mutationField("completeProfile", {
  type: UserType,
  args: {
    input: nonNull(CompleteProfileInput),
  },
  authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
  async resolve(
    _root,
    {
      input: {
        firstName,
        lastName,
        phone,
        isManager,
        isTranslator,
        languages,
        city,
        state,
      },
    },
    { user, prisma }: Context
  ) {
    const isComplete = isProfileComplete(firstName, lastName, phone);

    const updatedUser = await prisma.user.update({
      where: { id: user!.id },
      data: {
        phone: phone || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        isManager: isManager || undefined,
        isTranslator: isTranslator || undefined,
        isProfileComplete: isComplete || undefined,
        languages: languages || undefined,
        city: city || undefined,
        state: state || undefined,
      },
    });

    return updatedUser;
  },
});
