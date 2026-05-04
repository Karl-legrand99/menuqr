import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 })
  }

  const payload = await req.text()
  const signature = req.headers.get("stripe-signature")!

  let event: any

  try {
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET || "")
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

      await prisma.subscription.updateMany({
        where: { stripeCustomerId: session.customer as string },
        data: {
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          status: "active",
          plan: getPlanFromPriceId(subscription.items.data[0].price.id),
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      })
      break
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object
      await prisma.subscription.updateMany({
        where: { stripeCustomerId: invoice.customer as string },
        data: { status: "past_due" },
      })
      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: { status: "canceled" },
      })
      break
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object
      const priceId = subscription.items.data[0]?.price.id
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: subscription.status,
          stripePriceId: priceId,
          plan: getPlanFromPriceId(priceId),
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}

function getPlanFromPriceId(priceId: string): string {
  if (priceId === process.env.STRIPE_PRICE_PREMIUM) return "premium"
  if (priceId === process.env.STRIPE_PRICE_PRO) return "pro"
  return "basic"
}
