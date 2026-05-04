import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import QRCode from "qrcode"

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
  })

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
  }

  const menuUrl = `${process.env.NEXTAUTH_URL}/r/${restaurant.slug}`

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(menuUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: restaurant.primaryColor,
        light: "#FFFFFF",
      },
    })

    return NextResponse.json({ qrCode: qrCodeDataUrl, url: menuUrl })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}
