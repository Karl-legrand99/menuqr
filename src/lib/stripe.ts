const stripeModule = require("stripe");

export const stripe = stripeModule(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});
