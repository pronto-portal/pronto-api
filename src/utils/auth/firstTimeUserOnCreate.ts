import { User } from "@prisma/client";
import prisma from "../../datasource/datasource";
import StripeClient from "../../datasource/stripe";
import { NexusGenInputs } from "../../graphql/schema/nexus-typegen";

const firstTimeUserOnCreate = (
  userInput: NexusGenInputs["CreateUserInput"],
  googleId: string
): Promise<User> => {
  return StripeClient.customers
    .create({
      email: userInput.email,
      name: userInput.firstName + " " + userInput.lastName,
      phone: userInput.phone || "",
    })
    .then((stripeCustomer) => {
      console.log("stripe customer created");
      return prisma.role
        .findUnique({
          where: {
            name: "Basic",
          },
        })
        .then((role) => {
          if (!role) {
            throw new Error("Role not found");
          }

          return StripeClient.subscriptions
            .create({
              customer: stripeCustomer.id,
              items: [
                {
                  price: role.stripePriceId!,
                },
              ],
            })
            .then((subscription) => {
              console.log("stripe subscription created");
              return prisma.user
                .create({
                  data: {
                    id: googleId,
                    ...userInput,
                    customerId: stripeCustomer.id,
                    subscriptionId: subscription.id,
                    role: {
                      connect: {
                        name: role?.name,
                      },
                    },
                  },
                })
                .then((usr) => {
                  console.log("user created");
                  return usr;
                })
                .catch((err) => {
                  // delete stripe customer
                  StripeClient.customers.del(stripeCustomer.id);
                  throw err;
                });
            });
        });
    })
    .catch((err) => {
      console.log("stripe customer creation error", err);
      throw err;
    });
};

export default firstTimeUserOnCreate;
