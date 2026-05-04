import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"

interface Props {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug, isActive: true },
      select: { name: true, description: true },
    })

    if (restaurant) {
      return {
        title: `${restaurant.name} — Menu digital | MenuQR`,
        description: restaurant.description || `Découvrez le menu digital de ${restaurant.name} sur MenuQR. Scannez le QR code pour commander.`,
        openGraph: {
          title: `${restaurant.name} — Menu digital`,
          description: restaurant.description || `Menu digital interactif de ${restaurant.name}`,
          type: "website",
        },
      }
    }
  } catch {
    // Fallback if DB is not available
  }

  return {
    title: "Menu digital | MenuQR",
    description: "Découvrez ce menu digital interactif sur MenuQR",
  }
}

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
