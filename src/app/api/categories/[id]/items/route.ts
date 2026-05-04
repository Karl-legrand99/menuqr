import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const items = await prisma.menuItem.findMany({
    where: { categoryId: id },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(items);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { name, description, price, image, allergens, isAvailable, isHighlighted, sortOrder } = body;

  if (!name || price === undefined) {
    return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
  }

  const category = await prisma.category.findUnique({
    where: { id },
    include: { restaurant: true },
  });
  if (!category || category.restaurant.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const item = await prisma.menuItem.create({
    data: {
      categoryId: id,
      name,
      description,
      price,
      image,
      allergens: allergens ?? [],
      isAvailable: isAvailable ?? true,
      isHighlighted: isHighlighted ?? false,
      sortOrder: sortOrder ?? 0,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
