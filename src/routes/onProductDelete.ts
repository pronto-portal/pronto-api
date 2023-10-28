// product.created
import stripeClient from "../datasource/stripe";
import Prisma from "../datasource/datasource";
import { Product } from "../types/stripe/product";
import { Event } from "../types/stripe/event";

export const onProductDelete = async (event: Event<Product>) => {
  try {
    const product = event.data.object;
    const name = product.name;

    const deletedRole = await Prisma.role.delete({
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
