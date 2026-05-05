import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { supabase } from "@/lib/supabase"

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const isDemo = req.headers.get("x-demo-mode") === "true"

  // Mode démo : fetch from Supabase
  if (isDemo) {
    try {
      const { data: restaurantData, error: restError } = await supabase
        .from("restaurants")
        .select("*")
        .eq("slug", slug)
        .single()

      if (restError || !restaurantData) {
        // Fallback to mock
        return NextResponse.json({
          id: "demo-1",
          name: "Le Petit Bistro",
          slug: "le-petit-bistro",
          description: "Un charmant bistrot parisien avec une cuisine traditionnelle et des produits frais.",
          address: "12 Rue de la Paix, 75002 Paris",
          phone: "+33 1 23 45 67 89",
          primaryColor: "#FF6B35",
          secondaryColor: "#2C3E50",
          isActive: true,
          orderEnabled: true,
          categories: [],
          tables: [],
        })
      }

      // Fetch categories
      const { data: categoriesData, error: catError } = await supabase
        .from("categories")
        .select("*")
        .eq("restaurant_id", restaurantData.id)
        .order("sort_order", { ascending: true })

      // Fetch items for these categories
      const categoryIds = categoriesData?.map((c: any) => c.id) || []
      const { data: itemsData, error: itemError } = await supabase
        .from("items")
        .select("*")
        .in("category_id", categoryIds)
        .eq("is_available", true)
        .order("sort_order", { ascending: true })

      // Fetch tables
      const { data: tablesData, error: tableError } = await supabase
        .from("tables")
        .select("*")
        .eq("restaurant_id", restaurantData.id)
        .eq("is_active", true)
        .order("created_at", { ascending: true })

      const categories = (categoriesData || []).map((cat: any) => ({
        ...cat,
        items: (itemsData || []).filter((item: any) => item.category_id === cat.id),
      }))

      return NextResponse.json({
        ...restaurantData,
        primaryColor: restaurantData.primary_color || "#FF6B35",
        secondaryColor: restaurantData.secondary_color || "#2C3E50",
        orderEnabled: restaurantData.order_enabled ?? true,
        categories,
        tables: tablesData || [],
      })
    } catch (err) {
      console.error("Supabase menu error:", err)
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug, isActive: true },
    include: {
      categories: {
        include: {
          items: {
            where: { isAvailable: true },
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
      tables: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
  }

  return NextResponse.json(restaurant)
}
