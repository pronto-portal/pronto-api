// customer.subscription.updated
import stripeClient from "../../datasource/stripe";
import { Subscription } from "../../types/stripe/subscription";
import { Event } from "../../types/stripe/event";
import cancelSubscription from "./cancelSubscription";

export const onSubscriptionUpdate = async (event: Event<Subscription>) => {
  const subscriptionResponse = event.data.object;
  const subscription = await stripeClient.subscriptions.retrieve(
    subscriptionResponse.id
  );
  const invoiceId = (subscription.latest_invoice || "")?.toString();
  const invoice = await stripeClient.invoices.retrieve(invoiceId);
  const email = invoice.customer_email || "";

  const subscriptionPeriodEnd = subscription.current_period_end * 1000;
  const status = subscription.status;

  const isSubscriptionCanceled = status === "canceled" || status === "unpaid";

  if (Date.now() >= subscriptionPeriodEnd || isSubscriptionCanceled) {
    console.log("Subscription period has ended");

    const updatedUser = cancelSubscription(email);

    return updatedUser;
  }
};
