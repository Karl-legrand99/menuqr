import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { status, tableId } = body

    if (status && !["pending", "confirmed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const data: any = {}
    if (status) data.status = status
    if (tableId !== undefined) data.tableId = tableId || null

    const reservation = await prisma.reservation.update({
      where: { id },
      data,
      include: { table: true },
    })

    return NextResponse.json(reservation)
  } catch (error) {
    console.error("[PATCH /api/reservations/[id]]", error)
    return NextResponse.json({ error: "Failed to update reservation" }, { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { table: true },
    })

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    return NextResponse.json(reservation)
  } catch (error) {
    console.error("[GET /api/reservations/[id]]", error)
    return NextResponse.json({ error: "Failed to fetch reservation" }, { status: 500 })
  }
}
