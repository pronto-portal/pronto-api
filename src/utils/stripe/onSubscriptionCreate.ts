// customer.subscription.created
import stripeClient from "../../datasource/stripe";
import Prisma from "../../datasource/datasource";
import { Subscription } from "../../types/stripe/subscription";
import { Event } from "../../types/stripe/event";
import moment from "moment";

export const onSubscriptionCreate = async (event: Event<Subscription>) => {
  try {
    const subscriptionResponse = event.data.object;
    const subscription = await stripeClient.subscriptions.retrieve(
      subscriptionResponse.id
    );
    const invoiceId = (subscription.latest_invoice || "")?.toString();
    const invoice = await stripeClient.invoices.retrieve(invoiceId);
    const email = invoice.customer_email || "";
    const productId = subscription.items.data[0].price.product.toString();
    const product = await stripeClient.products.retrieve(productId);
    const name = product.name;

    const existingUser = await Prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        role: true,
      },
    });

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
        subscriptionId: subscription.id,
        subscriptionEndDate: moment(
          subscription.current_period_end * 1000
        ).toDate(),
      },
      include: {
        role: true,
      },
    });

    if (existingUser) {
      // Cancel current subscription if user already has one
      if (existingUser.subscriptionId) {
        stripeClient.subscriptions.cancel(existingUser.subscriptionId);
      }
    }

    return updatedUser;
  } catch (e) {
    console.error(e);
  }
};
