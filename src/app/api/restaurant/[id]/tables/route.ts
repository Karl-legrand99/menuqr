import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const tables = await prisma.table.findMany({
      where: { restaurantId: id, isActive: true },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(tables)
  } catch (error) {
    console.error("[GET /api/restaurant/[id]/tables]", error)
    return NextResponse.json({ error: "Failed to fetch tables" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name, capacity, position } = body

    if (!name || !capacity) {
      return NextResponse.json({ error: "Name and capacity are required" }, { status: 400 })
    }

    const table = await prisma.table.create({
      data: {
        restaurantId: id,
        name,
        capacity: parseInt(capacity, 10),
        position: position || null,
        isActive: true,
      },
    })

    return NextResponse.json(table, { status: 201 })
  } catch (error) {
    console.error("[POST /api/restaurant/[id]/tables]", error)
    return NextResponse.json({ error: "Failed to create table" }, { status: 500 })
  }
}
