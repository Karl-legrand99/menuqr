"use client"

import { useState, useCallback } from "react"

interface ImageUploadProps {
  onUpload?: (url: string) => void
  existingImage?: string
  value?: string | null
  onChange?: (url: string | null) => void
  onRemove?: () => void
}

export default function ImageUpload({ onUpload, existingImage, value, onChange, onRemove }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || existingImage || "")

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // Preview
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)

      // Upload via API route locale (supporte Cloudinary + fallback local)
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const data = await response.json()
        onUpload?.(data.url)
        onChange?.(data.url)
        setPreview(data.url)
      } catch (error) {
        console.error("Upload error:", error)
        alert("Erreur lors de l'upload. Vérifiez la configuration.")
      } finally {
        setUploading(false)
      }
    },
    [onUpload, onChange]
  )

  const handleRemove = () => {
    setPreview("")
    onChange?.(null)
    onRemove?.()
  }

  return (
    <div className="space-y-2">
      {preview && (
        <div className="relative w-32 h-32">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
          >
            ×
          </button>
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
