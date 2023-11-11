import Prisma from "../../datasource/datasource";

const cancelSubscription = async (email: string) => {
  return await Prisma.user.update({
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
