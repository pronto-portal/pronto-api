// product.created
import stripeClient from "../../datasource/stripe";
import prisma from "../../datasource/base";
import { Product } from "../../types/stripe/product";
import { Event } from "../../types/stripe/event";

export const onProductDelete = async (event: Event<Product>) => {
  try {
    const product = event.data.object;
    const name = product.name;

    const deletedRole = await prisma.role.delete({
      where: {
        name,
      },
    });

    console.log("deletedRole", deletedRole);

    return deletedRole;
  } catch (e) {
    console.error(e);
  }
};
