"use client"

import { useState, useCallback } from "react"

interface ImageUploadProps {
  onUpload: (url: string) => void
  existingImage?: string
}

export default function ImageUpload({ onUpload, existingImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(existingImage || "")

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // Preview
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)

      // Upload to Cloudinary
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "menuqr_default")

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        if (!cloudName) {
          throw new Error("Cloudinary cloud name not configured")
        }

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        )

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const data = await response.json()
        onUpload(data.secure_url)
        setPreview(data.secure_url)
      } catch (error) {
        console.error("Upload error:", error)
        alert("Erreur lors de l'upload. Vérifiez la configuration Cloudinary.")
      } finally {
        setUploading(false)
      }
    },
    [onUpload]
  )

  return (
    <div className="space-y-2">
      {preview && (
        <div className="relative w-32 h-32">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg border border-gray-200"
          />
        </div>
      )}
      <label className="block">
        <span className="sr-only">Choisir une image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-orange-50 file:text-orange-700
            hover:file:bg-orange-100
            disabled:opacity-50"
        />
      </label>
      {uploading && <p className="text-sm text-orange-600">Upload en cours...</p>}
    </div>
  )
}
