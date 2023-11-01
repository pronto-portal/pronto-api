// product.updated
import stripeClient from "../datasource/stripe";
import Prisma from "../datasource/datasource";
import { Product } from "../types/stripe/product";
import { Event } from "../types/stripe/event";

export const onProductUpdated = async (event: Event<Product>) => {
  try {
    const product = event.data.object;

    console.log("product", product);

    const priceId = product.default_price;
    const priceObj = await stripeClient.prices.retrieve(priceId);
    const priceCents = priceObj.unit_amount;

    const features = product.features.map((feature) => feature.name);
    const description = product.description;
    const name = product.name;

    if (priceCents) {
      const data = {
        name,
        description,
        priceCents,
        features,
        stripePriceId: priceId,
      };

      const role = await Prisma.role.upsert({
        where: {
          name: data.name,
        },
        create: data,
        update: data,
      });

      console.log("upsertedRole", role);
      return role;
    }
  } catch (e) {
    console.error(e);
  }
};
