import prisma from "../../datasource/base";

const cancelSubscription = async (email: string) => {
  return await prisma.user.update({
    where: {
      email,
    },
    data: {
      subscriptionId: null,
      role: {
        connect: {
          name: "Basic",
        },
      },
    },
  });
};

export default cancelSubscription;
