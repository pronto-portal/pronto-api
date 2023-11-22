// This is your test secret API key.
import { Router, raw } from "express";
import { BaseError } from "../types/errors";
import { isAuthorizedExpress } from "../utils/auth/isAuthorizedExpress";
import stripe from "../datasource/stripe";
import prisma from "../datasource/datasource";
import { onProductDelete } from "../utils/stripe/onProductDelete";
import { onSubscriptionCreate } from "../utils/stripe/onSubscriptionCreate";
import { onSubscriptionDelete } from "../utils/stripe/onSubscriptionDelete";
import { onProductUpdated } from "../utils/stripe/onProductUpdated";
import { json } from "body-parser";
import getAuthPayload from "../utils/auth/getAuthPayload";
import moment from "moment-timezone";
import { onInvoiceCreated } from "../utils/stripe/onInvoiceCreated";

const router = Router();

const YOUR_DOMAIN = "http://localhost:4000";

router.post(
  "/create-checkout-session",
  json(),
  isAuthorizedExpress,
  async (req, res) => {
    try {
      const decodedToken = getAuthPayload(req.headers.authorization)!;
      const user = await prisma.user.findUnique({
        where: {
          id: decodedToken.id,
        },
      });

      if (!user)
        return res.status(500).json({
          message: "Error creating checkout session",
        });

      const stripeUserIdenfitier = user.customerId
        ? {
            customer: user.customerId,
          }
        : { customer_email: user.email };

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: `${req.body.priceId}`,
            quantity: 1,
          },
        ],
        mode: "subscription",
        ...stripeUserIdenfitier,
        success_url: `${process.env.FRONTEND_ORIGIN}/subscribe/manage`,
        cancel_url: `${process.env.FRONTEND_ORIGIN}/subscribe/manage`,
        automatic_tax: { enabled: true },
      });

      if (session && session.url)
        res.status(200).json({ checkoutUrl: session.url });
      else
        res.status(500).json({
          message: "Error creating checkout session",
        });
    } catch (err) {
      console.log("Error", err);
      res.status(500).json({
        message: "Error creating checkout session",
      });
    }
  }
);

router.post(
  "/create-portal-session",
  json(),
  isAuthorizedExpress,
  async (req, res) => {
    // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
    // Typically this is stored alongside the authenticated user in your database.
    console.log("Attempting to create checkout session");
    const { session_id } = req.body;
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    // This is the url to which the customer will be redirected when they are done
    // managing their billing with the portal.
    const returnUrl = YOUR_DOMAIN;

    const portalSession = await stripe.billingPortal.sessions
      .create({
        customer: checkoutSession.customer!.toString(),
        return_url: returnUrl,
      })
      .then((portalSession) => {
        console.log("Portal Session", portalSession);

        res.redirect(303, portalSession.url);

        return portalSession;
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }
);

router.post(
  "/toggle-autorenewal",
  json(),
  isAuthorizedExpress,
  async (req, res) => {
    console.log("Getting user from token");
    const decodedToken = getAuthPayload(req.headers.authorization)!;

    console.log("Attempting to cancel subscription");
    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });

    if (!user) {
      return res.status(500).json({
        message: "Error toggling subscription auto renewal",
      });
    }

    const subscriptionToUpdate = await stripe.subscriptions
      .update(user.subscriptionId!, {
        cancel_at_period_end: !user.autoRenewSubscription,
      })
      .then((sub) => {
        console.log(
          "Subscription cancel_at_period_end set to ",
          !user.autoRenewSubscription
        );
        return sub;
      })
      .catch((err) => {
        console.log("Error toggling subscription auto renewal", err);
        return null;
      });

    if (subscriptionToUpdate) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          autoRenewSubscription: !user.autoRenewSubscription,
        },
      });

      return res.status(200).json({
        message: `Subscription auto renewal set to ${!user.autoRenewSubscription}.`,
      });
    }

    return res.status(500).json({
      message: "Error toggling subscription auto renewal",
    });
  }
);

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
      case "invoice.payment_succeeded":
        console.log("Invoice payment succeeded");
        break;
      case "invoice.created":
        onInvoiceCreated(event);
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
