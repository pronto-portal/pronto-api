// product.created
import stripeClient from "../datasource/stripe";
import Prisma from "../datasource/datasource";
import { Product } from "../types/stripe/product";
import { Event } from "../types/stripe/event";

export const onProductCreate = async (event: Event<Product>) => {
  const product = event.data.object;
  const priceId = product.default_price;

  const priceObj = await stripeClient.prices.retrieve(priceId);

  const priceCents = priceObj.unit_amount;
  const features = product.features.map((feature) => feature.name);
  const description = product.description;
  const name = product.name;

  if (priceCents) {
    await Prisma.role.create({
      data: {
        name,
        description,
        priceCents,
        features,
      },
    });
  }
};
