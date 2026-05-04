import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { writeFile } from "fs/promises"
import { join } from "path"
import { existsSync, mkdirSync } from "fs"

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

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
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
      { error: "Upload failed" },
      { status: 500 }
    )
  }
}
