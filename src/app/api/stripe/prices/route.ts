import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    prices: {
      basic: process.env.STRIPE_PRICE_BASIC,
      pro: process.env.STRIPE_PRICE_PRO,
      premium: process.env.STRIPE_PRICE_PREMIUM,
    }
  })
}
