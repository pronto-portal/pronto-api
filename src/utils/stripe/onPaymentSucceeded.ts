import stripeClient from "../../datasource/stripe";
import prisma from "../../datasource/base";
import { Event } from "../../types/stripe/event";
import Invoice from "../../types/stripe/invoice";

const onPaymentSucceeded = async (event: Event<Invoice>) => {
  try {
    const invoice = event.data.object;
    const customer = invoice.customer.toString();
    const user = await prisma.user.findUnique({
      where: {
        customerId: customer,
      },
      include: {
        role: true,
      },
    });

    if (user) {
    }
  } catch (err) {
    console.log("onPaymentSucceeded err", err);
  }
};

export default onPaymentSucceeded;
