// customer.subscription.created
import stripeClient from "../../datasource/stripe";
import Prisma from "../../datasource/datasource";
import { Subscription } from "../../types/stripe/subscription";
import { Event } from "../../types/stripe/event";
import moment from "moment";

export const onSubscriptionDelete = async (event: Event<Subscription>) => {
  try {
    const subscriptionResponse = event.data.object;
    const subscription = await stripeClient.subscriptions.retrieve(
      subscriptionResponse.id
    );
    const customer = subscription.customer.toString();
    const user = await Prisma.user.findUnique({
      where: {
        customerId: customer,
      },
      include: {
        role: true,
      },
    });

    const email = user?.email || "";

    const existingSubscriptionList = await stripeClient.subscriptions.list({
      customer,
    });

    const existingSubscription = existingSubscriptionList.data[0];

    const existingSubscriptionHasItems =
      existingSubscription &&
      existingSubscription.items &&
      existingSubscription.items.data &&
      existingSubscription.items.data.length;

    const productId = existingSubscriptionHasItems
      ? existingSubscription.items.data[0].price.product.toString()
      : "";
    const product = await stripeClient.products.retrieve(productId);

    const name = existingSubscriptionHasItems ? product.name : "Basic";

    const updatedUser = await Prisma.user.update({
      where: {
        email,
      },
      data: {
        role: {
          connect: {
            name,
          },
        },
        subscriptionId: existingSubscription.id,
        subscriptionEndDate: moment(
          existingSubscription.current_period_end * 1000
        ).toDate(),
      },
      include: {
        role: true,
      },
    });

    return updatedUser;
  } catch (e) {
    console.error(e);
  }
};
