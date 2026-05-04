import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  const isDemo = req.headers.get("x-demo-mode") === "true"

  if (!session?.user?.email && !isDemo) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Mode démo : utiliser Supabase
  if (isDemo) {
    try {
      const { data: restaurants, error } = await supabase
        .from("restaurants")
        .select("*, categories(*, items(*))")
        .eq("slug", "le-petit-bistro")
      
      if (error) throw error
      return NextResponse.json(restaurants || [])
    } catch (err) {
      console.error("Supabase error:", err)
      // Fallback mock si Supabase échoue
      const mockRestaurants = [{
        id: "demo-1", name: "Le Petit Bistro", slug: "le-petit-bistro",
        description: "Un charmant bistrot parisien avec une cuisine traditionnelle et des produits frais.",
        address: "12 Rue de la Paix, 75002 Paris", phone: "+33 1 23 45 67 89",
        primaryColor: "#FF6B35", secondaryColor: "#2C3E50", userId: "demo-user",
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), categories: []
      }]
      return NextResponse.json(mockRestaurants)
    }
  }

  const restaurants = await prisma.restaurant.findMany({
    where: { userId: session.user.id },
    include: {
      categories: { include: { items: true }, orderBy: { sortOrder: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(restaurants)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  
  // Mode démo : bypass auth, retourne un restaurant mock
  const isDemo = req.headers.get("x-demo-mode") === "true"
  
  if (!session?.user?.email && !isDemo) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { name, slug, description, address, phone, primaryColor, secondaryColor } = body

  // En mode démo, pas de DB — retourne un mock
  if (isDemo) {
    const mockRestaurant = {
      id: "demo-" + Date.now(),
      name,
      slug,
      description,
      address: address || "",
      phone: phone || "",
      primaryColor: primaryColor || "#FF6B35",
      secondaryColor: secondaryColor || "#2C3E50",
      userId: "demo-user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      categories: [],
    }
    return NextResponse.json(mockRestaurant)
  }

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
