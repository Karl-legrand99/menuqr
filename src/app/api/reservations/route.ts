import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      restaurantId,
      tableId,
      customerName,
      customerPhone,
      customerEmail,
      date,
      time,
      partySize,
      notes,
    } = body

    if (!restaurantId || !customerName || !customerPhone || !date || !time || !partySize) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    })

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    const reservation = await prisma.reservation.create({
      data: {
        restaurantId,
        tableId: tableId || null,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        date,
        time,
        partySize: parseInt(partySize, 10),
        notes: notes || null,
        status: "pending",
      },
    })

    return NextResponse.json(reservation, { status: 201 })
  } catch (error) {
    console.error("[POST /api/reservations]", error)
    return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const restaurantId = searchParams.get("restaurantId")

    if (!restaurantId) {
      return NextResponse.json({ error: "restaurantId is required" }, { status: 400 })
    }

    const reservations = await prisma.reservation.findMany({
      where: { restaurantId },
      include: { table: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(reservations)
  } catch (error) {
    console.error("[GET /api/reservations]", error)
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 })
  }
}
