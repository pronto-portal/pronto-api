// product.created
import stripeClient from "../datasource/stripe";
import Prisma from "../datasource/datasource";
import { Price } from "../types/stripe/price";
import { Event } from "../types/stripe/event";

export const onPriceCreate = async (event: Event<Price>) => {
  try {
    const price = event.data.object;
    const productId = price.product.toString();
    const product = await stripeClient.products.retrieve(productId, {
      expand: ["default_price"],
    });

    console.log("product", product);

    console.log("price", price);

    const priceCents = price.unit_amount;
    const features = product.features.map((feature) => feature.name);
    const description = product.description;
    const name = product.name;

    if (priceCents) {
      const createdRole = await Prisma.role.create({
        data: {
          name,
          description,
          priceCents,
          features,
        },
      });

      console.log("createdRole", createdRole);
      return createdRole;
    }
  } catch (e) {
    console.error(e);
  }
};
