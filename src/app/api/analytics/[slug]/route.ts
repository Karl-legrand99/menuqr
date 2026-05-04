import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const body = await req.json().catch(() => ({}))
  const { itemId } = body

  const restaurant = await prisma.restaurant.findUnique({ where: { slug } })
  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
  }

  const headers = req.headers
  const ip = headers.get("x-forwarded-for") || "unknown"
  const userAgent = headers.get("user-agent") || "unknown"

  await prisma.menuView.create({
    data: {
      restaurantId: restaurant.id,
      itemId: itemId || null,
      ip,
      userAgent,
    },
  })

  return NextResponse.json({ success: true })
}

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const restaurant = await prisma.restaurant.findUnique({ where: { slug } })
  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
  }

  // Total views
  const totalViews = await prisma.menuView.count({
    where: { restaurantId: restaurant.id },
  })

  // Views today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const viewsToday = await prisma.menuView.count({
    where: {
      restaurantId: restaurant.id,
      createdAt: { gte: today },
    },
  })

  // Views this week
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const viewsThisWeek = await prisma.menuView.count({
    where: {
      restaurantId: restaurant.id,
      createdAt: { gte: weekAgo },
    },
  })

  // Popular items
  const popularItems = await prisma.menuView.groupBy({
    by: ["itemId"],
    where: {
      restaurantId: restaurant.id,
      itemId: { not: null },
    },
    _count: { itemId: true },
    orderBy: { _count: { itemId: "desc" } },
    take: 5,
  })

  const itemIds = popularItems.map((p) => p.itemId).filter(Boolean) as string[]
  const items = itemIds.length > 0
    ? await prisma.menuItem.findMany({
        where: { id: { in: itemIds } },
        select: { id: true, name: true },
      })
    : []

  const popularItemsWithNames = popularItems.map((p) => ({
    itemId: p.itemId,
    views: p._count.itemId,
    name: items.find((i) => i.id === p.itemId)?.name || "Inconnu",
  }))

  // Views per day (last 7 days)
  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)
    const count = await prisma.menuView.count({
      where: {
        restaurantId: restaurant.id,
        createdAt: { gte: date, lt: nextDate },
      },
    })
    days.push({
      date: date.toISOString().split("T")[0],
      views: count,
    })
  }

  return NextResponse.json({
    totalViews,
    viewsToday,
    viewsThisWeek,
    popularItems: popularItemsWithNames,
    dailyViews: days,
  })
}
