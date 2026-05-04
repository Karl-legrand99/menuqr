import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { categoryId, name, description, price, image, allergens, isHighlighted } = body

  const item = await prisma.menuItem.create({
    data: {
      categoryId,
      name,
      description,
      price,
      image,
      allergens: allergens || [],
      isHighlighted: isHighlighted || false,
    },
  })

  return NextResponse.json(item)
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { id, name, description, price, image, allergens, isAvailable, isHighlighted, sortOrder } = body

  const item = await prisma.menuItem.update({
    where: { id },
    data: { name, description, price, image, allergens, isAvailable, isHighlighted, sortOrder },
  })

  return NextResponse.json(item)
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 })
  }

  await prisma.menuItem.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
