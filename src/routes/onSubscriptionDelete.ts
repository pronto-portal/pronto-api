// customer.subscription.created
import stripeClient from "../datasource/stripe";
import Prisma from "../datasource/datasource";
import { Subscription } from "../types/stripe/subscription";
import { Event } from "../types/stripe/event";

export const onSubscriptionDelete = async (event: Event<Subscription>) => {
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

    const updatedUser = await Prisma.user.update({
      where: {
        email,
      },
      data: {
        role: {
          disconnect: {
            name,
          },
        },
      },
      include: {
        role: true,
      },
    });

    console.log("updatedUser", updatedUser);

    return updatedUser;
  } catch (e) {
    console.error(e);
  }
};
