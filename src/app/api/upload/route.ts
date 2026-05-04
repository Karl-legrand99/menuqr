import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { writeFile } from "fs/promises"
import { join } from "path"
import { existsSync, mkdirSync } from "fs"

// Configuration Cloudinary
const isCloudinaryConfigured =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

// Rate limiting simple (en mémoire — suffisant pour un MVP)
const uploadAttempts = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 10 // uploads par fenêtre
const RATE_WINDOW_MS = 60_000 // 1 minute

function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const record = uploadAttempts.get(identifier)

  if (!record || now > record.resetAt) {
    uploadAttempts.set(identifier, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }

  if (record.count >= RATE_LIMIT) {
    return false
  }

  record.count++
  return true
}

// Types MIME autorisés
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export async function POST(req: Request) {
  try {
    // Rate limiting par IP (fallback sur "unknown")
    const forwarded = req.headers.get("x-forwarded-for")
    const ip = forwarded?.split(",")[0]?.trim() || "unknown"

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Trop de uploads. Réessayez dans une minute." },
        { status: 429 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      )
    }

    // Validation type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé. Utilisez JPG, PNG, WebP, GIF ou SVG." },
        { status: 400 }
      )
    }

    // Validation taille
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Fichier trop volumineux. Maximum 5 Mo." },
        { status: 413 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // If Cloudinary is configured, use it
    if (isCloudinaryConfigured) {
      const base64 = buffer.toString("base64")
      const dataURI = `data:${file.type};base64,${base64}`

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "menuqr",
        upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      })

      return NextResponse.json({
        url: result.secure_url,
        publicId: result.public_id,
      })
    }

    // Fallback: save locally to public/uploads
    const uploadsDir = join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true })
    }

    const ext = file.name.split(".").pop() || "png"
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const filepath = join(uploadsDir, filename)

    await writeFile(filepath, buffer)

    return NextResponse.json({
      url: `/uploads/${filename}`,
      publicId: filename,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Échec de l'upload. Veuillez réessayer." },
      { status: 500 }
    )
  }
}
