const stripeModule = require("stripe");

const secretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = secretKey && !secretKey.includes("placeholder")
  ? stripeModule(secretKey, { apiVersion: "2026-04-22.dahlia" })
  : null;
