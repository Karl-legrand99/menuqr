import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // For Supabase: use DIRECT_URL for direct connections (migrations, dev)
  // Use DATABASE_URL (PgBouncer pooler) for serverless/edge runtime
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
  if (!connectionString) {
    console.warn("[Prisma] No DATABASE_URL or DIRECT_URL found. Prisma will not work.")
    return new PrismaClient()
  }

  try {
    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  } catch (err) {
    console.warn("[Prisma] Failed to create pg adapter, falling back to default:", err)
    return new PrismaClient()
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
