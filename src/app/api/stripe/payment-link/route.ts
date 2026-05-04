import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 })
    }

    const body = await req.json()
    const { amount, description, restaurantName, orderId } = body

    if (!amount || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: description,
              description: `Commande chez ${restaurantName || "Restaurant"}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: orderId || "",
      },
      after_completion: {
        type: "redirect",
        redirect: {
          url: `${process.env.NEXTAUTH_URL || "https://menuqr.vercel.app"}/order/success`,
        },
      },
    })

    return NextResponse.json({ url: paymentLink.url })
  } catch (error) {
    console.error("[POST /api/stripe/payment-link]", error)
    return NextResponse.json({ error: "Failed to create payment link" }, { status: 500 })
  }
}
