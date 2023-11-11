// customer.created
import { Event } from "../../types/stripe/event";
import prisma from "../../datasource/datasource";
import Customer from "../../types/stripe/customer";

const onCustomerCreate = async (event: Event<Customer>) => {
  try {
    const customerId = event.data.object.id;
    const customerEmail = event.data.object.email;

    if (customerId && customerEmail) {
      await prisma.user
        .update({
          where: {
            email: customerEmail,
          },
          data: {
            customerId,
          },
        })
        .then((user) => {
          console.log(
            `Updated user ${user.email}'s customer id to ${customerId}`
          );
        });
    }
  } catch (err) {
    console.log("onCustomerCreate err", err);
  }
};

export default onCustomerCreate;
