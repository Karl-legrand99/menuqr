import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { restaurantId, items, total, customerName, customerPhone, tableNumber, notes, stripePaymentLink } = body

    if (!restaurantId || !items || !total || !customerName || !customerPhone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    })

    if (!restaurant || !restaurant.orderEnabled) {
      return NextResponse.json({ error: "Restaurant not found or ordering disabled" }, { status: 404 })
    }

    const order = await prisma.order.create({
      data: {
        restaurantId,
        items: items as any,
        total,
        customerName,
        customerPhone,
        tableNumber: tableNumber || null,
        notes: notes || null,
        stripePaymentLink: stripePaymentLink || null,
        status: "pending",
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("[POST /api/orders]", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const restaurantId = searchParams.get("restaurantId")

    if (!restaurantId) {
      return NextResponse.json({ error: "restaurantId is required" }, { status: 400 })
    }

    const orders = await prisma.order.findMany({
      where: { restaurantId },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("[GET /api/orders]", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
