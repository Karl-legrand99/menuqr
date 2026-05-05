"use client"

const STORAGE_KEYS = {
  categories: "menuqr-demo-categories",
  orders: "menuqr-demo-orders",
  reservations: "menuqr-demo-reservations",
  restaurants: "menuqr-demo-restaurants",
}

const defaultCategories = [
  {
    id: "demo-cat-1",
    name: "Entrées",
    sortOrder: 1,
    restaurantId: "demo-1",
    items: [
      { id: "demo-item-1", name: "Soupe à l'oignon", description: "Soupe gratinée au fromage", price: 8.50, image: null, categoryId: "demo-cat-1" },
      { id: "demo-item-2", name: "Salade de chèvre chaud", description: "Salade verte, toast de chèvre, miel", price: 10.00, image: null, categoryId: "demo-cat-1" },
      { id: "demo-item-3", name: "Escargots de Bourgogne", description: "6 escargots au beurre persillé", price: 12.00, image: null, categoryId: "demo-cat-1" },
    ],
  },
  {
    id: "demo-cat-2",
    name: "Plats",
    sortOrder: 2,
    restaurantId: "demo-1",
    items: [
      { id: "demo-item-4", name: "Steak frites", description: "Entrecôte grillée, sauce au poivre", price: 18.50, image: null, categoryId: "demo-cat-2" },
      { id: "demo-item-5", name: "Coq au vin", description: "Poulet mijoté au vin rouge", price: 16.00, image: null, categoryId: "demo-cat-2" },
      { id: "demo-item-6", name: "Magret de canard", description: "Magret sauce figue, purée maison", price: 19.00, image: null, categoryId: "demo-cat-2" },
    ],
  },
  {
    id: "demo-cat-3",
    name: "Desserts",
    sortOrder: 3,
    restaurantId: "demo-1",
    items: [
      { id: "demo-item-7", name: "Crème brûlée", description: "Vanille de Madagascar", price: 7.50, image: null, categoryId: "demo-cat-3" },
      { id: "demo-item-8", name: "Tarte tatin", description: "Pommes caramélisées, glace vanille", price: 8.00, image: null, categoryId: "demo-cat-3" },
    ],
  },
]

const defaultOrders = [
  {
    id: "demo-order-1",
    restaurantId: "demo-1",
    customerName: "Jean Dupont",
    customerPhone: "+33 6 12 34 56 78",
    tableNumber: 5,
    notes: "Allergie aux noix",
    status: "pending",
    total: 34.50,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    items: [
      { name: "Soupe à l'oignon", quantity: 1, price: 8.50 },
      { name: "Steak frites", quantity: 1, price: 18.50 },
      { name: "Crème brûlée", quantity: 1, price: 7.50 },
    ],
    stripePaymentLink: null,
  },
  {
    id: "demo-order-2",
    restaurantId: "demo-1",
    customerName: "Marie Martin",
    customerPhone: "+33 6 98 76 54 32",
    tableNumber: null,
    notes: "À emporter",
    status: "confirmed",
    total: 26.00,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    items: [
      { name: "Salade de chèvre chaud", quantity: 1, price: 10.00 },
      { name: "Coq au vin", quantity: 1, price: 16.00 },
    ],
    stripePaymentLink: null,
  },
  {
    id: "demo-order-3",
    restaurantId: "demo-1",
    customerName: "Pierre Bernard",
    customerPhone: "+33 6 11 22 33 44",
    tableNumber: 3,
    notes: "",
    status: "completed",
    total: 19.00,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    items: [
      { name: "Magret de canard", quantity: 1, price: 19.00 },
    ],
    stripePaymentLink: null,
  },
]

const defaultReservations = [
  {
    id: "demo-res-1",
    restaurantId: "demo-1",
    customerName: "Sophie Lemoine",
    customerPhone: "+33 6 55 44 33 22",
    customerEmail: "sophie@example.com",
    date: new Date().toISOString().slice(0, 10),
    time: "19:30",
    partySize: 4,
    notes: "Anniversaire",
    status: "confirmed",
    tableId: "demo-table-1",
    table: { id: "demo-table-1", name: "Terrasse 1", capacity: 4 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "demo-res-2",
    restaurantId: "demo-1",
    customerName: "Lucas Moreau",
    customerPhone: "+33 6 77 88 99 00",
    customerEmail: null,
    date: new Date().toISOString().slice(0, 10),
    time: "20:00",
    partySize: 2,
    notes: "",
    status: "pending",
    tableId: null,
    table: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "demo-res-3",
    restaurantId: "demo-1",
    customerName: "Emma Petit",
    customerPhone: "+33 6 33 22 11 00",
    customerEmail: "emma@example.com",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().slice(0, 10),
    time: "12:30",
    partySize: 6,
    notes: "Chaise haute bébé",
    status: "confirmed",
    tableId: "demo-table-2",
    table: { id: "demo-table-2", name: "Salle 2", capacity: 6 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
]

// --- localStorage helpers ---
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore parse errors
  }
  return fallback
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore storage errors (e.g. quota exceeded)
  }
}

export function getDemoCategories() {
  return loadFromStorage(STORAGE_KEYS.categories, defaultCategories)
}

export function setDemoCategories(categories: any[]) {
  saveToStorage(STORAGE_KEYS.categories, categories)
}

export function getDemoOrders() {
  return loadFromStorage(STORAGE_KEYS.orders, defaultOrders)
}

export function setDemoOrders(orders: any[]) {
  saveToStorage(STORAGE_KEYS.orders, orders)
}

export function getDemoReservations() {
  return loadFromStorage(STORAGE_KEYS.reservations, defaultReservations)
}

export function setDemoReservations(reservations: any[]) {
  saveToStorage(STORAGE_KEYS.reservations, reservations)
}

// --- Restaurants localStorage ---
export function getDemoRestaurants() {
  return loadFromStorage(STORAGE_KEYS.restaurants, [demoRestaurant])
}

export function setDemoRestaurants(restaurants: any[]) {
  saveToStorage(STORAGE_KEYS.restaurants, restaurants)
}

export function addDemoRestaurant(restaurant: any) {
  const current = getDemoRestaurants()
  setDemoRestaurants([...current, restaurant])
}

// --- Backward-compatible exports (used by non-persisted pages) ---
export const demoRestaurant = {
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
  userId: "demo-user",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const demoCategories = defaultCategories
export const demoOrders = defaultOrders
export const demoReservations = defaultReservations
export const demoTables = [
  { id: "demo-table-1", name: "Terrasse 1", capacity: 4, position: "Terrasse", restaurantId: "demo-1" },
  { id: "demo-table-2", name: "Salle 2", capacity: 6, position: "Salle principale", restaurantId: "demo-1" },
  { id: "demo-table-3", name: "Salle 1", capacity: 2, position: "Salle principale", restaurantId: "demo-1" },
]

export const demoAnalytics = {
  totalViews: 1247,
  viewsToday: 42,
  viewsThisWeek: 312,
  dailyViews: [
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString().slice(0, 10), views: 35 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString().slice(0, 10), views: 42 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString().slice(0, 10), views: 38 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString().slice(0, 10), views: 55 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString().slice(0, 10), views: 48 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString().slice(0, 10), views: 52 },
    { date: new Date().toISOString().slice(0, 10), views: 42 },
  ],
  popularItems: [
    { itemId: "demo-item-4", name: "Steak frites", views: 312 },
    { itemId: "demo-item-6", name: "Magret de canard", views: 287 },
    { itemId: "demo-item-5", name: "Coq au vin", views: 198 },
    { itemId: "demo-item-7", name: "Crème brûlée", views: 156 },
    { itemId: "demo-item-2", name: "Salade de chèvre chaud", views: 134 },
  ],
}

export const demoSubscription = {
  plan: "pro",
  status: "active",
  currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(),
}
