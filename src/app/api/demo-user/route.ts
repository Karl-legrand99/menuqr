import { NextResponse } from "next/server"

export async function GET() {
  // Retourne un faux utilisateur pour la démo
  return NextResponse.json({
    id: "demo-user-123",
    email: "demo@menuqr.com",
    name: "Utilisateur Démo",
    image: null,
  })
}
