// This is your test secret API key.
import { Router, raw } from "express";
import { BaseError } from "../types/errors";
import { isAuthorizedExpress } from "../utils/auth/isAuthorizedExpress";
import stripe from "../datasource/stripe";
import { onProductDelete } from "./onProductDelete";
import { onSubscriptionCreate } from "./onSubscriptionCreate";
import { onSubscriptionDelete } from "./onSubscriptionDelete";
import { onProductUpdated } from "./onProductUpdated";

const router = Router();

const YOUR_DOMAIN = "http://localhost:4000";

router.post(
  "/create-checkout-session",
  isAuthorizedExpress,
  async (req, res) => {
    const prices = await stripe.prices.list({
      lookup_keys: [req.body.lookup_key],
      expand: ["data.product"],
    });
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      line_items: [
        {
          price: prices.data[0].id,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${YOUR_DOMAIN}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });

    const sessionUrl = session.url!;
    res.redirect(303, sessionUrl);
  }
);

router.post("/create-portal-session", isAuthorizedExpress, async (req, res) => {
  // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
  // Typically this is stored alongside the authenticated user in your database.
  const { session_id } = req.body;
  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = YOUR_DOMAIN;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer!.toString(),
    return_url: returnUrl,
  });

  res.redirect(303, portalSession.url);
});

router.post(
  "/webhook",
  raw({ type: "application/json" }),
  async (request, response) => {
    console.log("Webhook received!");
    let event = request.body;
    // Replace this endpoint secret with your endpoint's unique secret
    // If you are testing with the CLI, find the secret by running 'stripe listen'
    // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
    // at https://dashboard.stripe.com/webhooks
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"];
      try {
        console.log("endpointSecret exists!");
        event = stripe.webhooks.constructEvent(
          request.body,
          signature!,
          endpointSecret
        );
      } catch (err) {
        console.log(
          `⚠️  Webhook signature verification failed.`,
          (err as BaseError).message
        );
        return response.sendStatus(400);
      }
    }
    let subscription;
    let status;

    console.log("Event Type", event.type);
    // console.log("Event Data", event);
    // Handle the event
    switch (event.type) {
      case "customer.subscription.trial_will_end":
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription trial ending.
        // handleSubscriptionTrialEnding(subscription);
        break;
      case "customer.subscription.deleted":
        onSubscriptionDelete(event);
        break;
      case "customer.subscription.created":
        onSubscriptionCreate(event);
        break;
      case "customer.subscription.updated":
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription update.
        // handleSubscriptionUpdated(subscription);
        break;

      case "product.updated":
        onProductUpdated(event);
        break;
      case "product.deleted":
        onProductDelete(event);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

export default router;
