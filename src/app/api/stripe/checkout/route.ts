import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 })
  }

  const body = await req.json()
  const { priceId } = body

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { subscription: true },
  })

  let customerId = user?.subscription?.stripeCustomerId

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      name: user?.name || undefined,
    })
    customerId = customer.id

    await prisma.subscription.create({
      data: {
        userId: user!.id,
        stripeCustomerId: customerId,
        status: "incomplete",
        plan: "basic",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        stripePriceId: (priceId as string) || "",
      } as any,
    })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${process.env.NEXTAUTH_URL || "https://menuqr.vercel.app"}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL || "https://menuqr.vercel.app"}/pricing?canceled=true`,
    subscription_data: {
      trial_period_days: 14,
    },
  })

  return NextResponse.json({ url: checkoutSession.url || "" })
}
