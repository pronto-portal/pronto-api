// invoice.created
import prisma from "../../datasource/base";
import { Event } from "../../types/stripe/event";
import Invoice from "../../types/stripe/invoice";

export const onInvoiceCreated = async (event: Event<Invoice>) => {
  try {
    const invoice = event.data.object;
    const email = invoice.customer_email;

    if (email)
      return await prisma.user.update({
        where: { email },
        data: {
          remindersCreatedThisMonth: 0,
        },
      });
  } catch (e) {
    console.error(e);
    return e;
  }
};
