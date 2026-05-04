import { supabase } from "@/lib/supabase"

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("restaurants").select("*").limit(1)
    if (error) {
      console.error("Supabase connection error:", error)
      return { success: false, error: error.message }
    }
    return { success: true, data }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

export async function getRestaurants() {
  const { data, error } = await supabase.from("restaurants").select("*, categories(*, items(*))")
  if (error) throw error
  return data
}

export async function createRestaurant(restaurant: any) {
  const { data, error } = await supabase.from("restaurants").insert(restaurant).select().single()
  if (error) throw error
  return data
}

export async function getCategories(restaurantId: string) {
  const { data, error } = await supabase.from("categories").select("*, items(*)").eq("restaurantId", restaurantId)
  if (error) throw error
  return data
}

export async function createCategory(category: any) {
  const { data, error } = await supabase.from("categories").insert(category).select().single()
  if (error) throw error
  return data
}

export async function createItem(item: any) {
  const { data, error } = await supabase.from("items").insert(item).select().single()
  if (error) throw error
  return data
}

export async function getOrders(restaurantId: string) {
  const { data, error } = await supabase.from("orders").select("*").eq("restaurantId", restaurantId).order("createdAt", { ascending: false })
  if (error) throw error
  return data
}

export async function createOrder(order: any) {
  const { data, error } = await supabase.from("orders").insert(order).select().single()
  if (error) throw error
  return data
}

export async function updateOrderStatus(orderId: string, status: string) {
  const { data, error } = await supabase.from("orders").update({ status }).eq("id", orderId).select().single()
  if (error) throw error
  return data
}

export async function getReservations(restaurantId: string) {
  const { data, error } = await supabase.from("reservations").select("*").eq("restaurantId", restaurantId).order("date", { ascending: true })
  if (error) throw error
  return data
}

export async function createReservation(reservation: any) {
  const { data, error } = await supabase.from("reservations").insert(reservation).select().single()
  if (error) throw error
  return data
}

export async function getTables(restaurantId: string) {
  const { data, error } = await supabase.from("tables").select("*").eq("restaurantId", restaurantId)
  if (error) throw error
  return data
}

export async function createTable(table: any) {
  const { data, error } = await supabase.from("tables").insert(table).select().single()
  if (error) throw error
  return data
}
