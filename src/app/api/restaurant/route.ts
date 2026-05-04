import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const restaurants = await prisma.restaurant.findMany({
    where: { userId: session.user.id },
    include: {
      categories: {
        include: { items: true },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(restaurants)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { name, slug, description, address, phone, primaryColor, secondaryColor } = body

  const existing = await prisma.restaurant.findUnique({ where: { slug } })
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
  }

  const restaurant = await prisma.restaurant.create({
    data: {
      userId: session.user.id,
      name,
      slug,
      description,
      address,
      phone,
      primaryColor: primaryColor || "#FF6B35",
      secondaryColor: secondaryColor || "#2C3E50",
    },
  })

  return NextResponse.json(restaurant)
}
