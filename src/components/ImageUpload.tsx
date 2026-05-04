"use client"

import { useState, useCallback } from "react"

interface ImageUploadProps {
  onUpload?: (url: string) => void
  existingImage?: string
  value?: string | null
  onChange?: (url: string | null) => void
  onRemove?: () => void
  maxSizeMB?: number
  acceptedTypes?: string[]
}

const DEFAULT_MAX_SIZE_MB = 5
const DEFAULT_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]

export default function ImageUpload({
  onUpload,
  existingImage,
  value,
  onChange,
  onRemove,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || existingImage || "")
  const [error, setError] = useState<string | null>(null)

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Type non supporté. Formats acceptés : ${acceptedTypes.map((t) => t.replace("image/", "")).join(", ")}`
    }
    if (file.size > maxSizeBytes) {
      return `Fichier trop volumineux. Maximum ${maxSizeMB} Mo.`
    }
    return null
  }

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      setError(null)

      // Validation client
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

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
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || `Upload failed (${response.status})`)
        }

        const data = await response.json()
        onUpload?.(data.url)
        onChange?.(data.url)
        setPreview(data.url)
      } catch (err: any) {
        console.error("Upload error:", err)
        setError(err.message || "Erreur lors de l'upload. Vérifiez la configuration.")
      } finally {
        setUploading(false)
      }
    },
    [onUpload, onChange, maxSizeBytes, acceptedTypes, maxSizeMB]
  )

  const handleRemove = () => {
    setPreview("")
    setError(null)
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
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 flex items-center justify-center"
            aria-label="Supprimer l'image"
          >
            ×
          </button>
        </div>
      )}
      <label className="block">
        <span className="sr-only">Choisir une image</span>
        <input
          type="file"
          accept={acceptedTypes.join(",")}
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
      {error && <p className="text-sm text-red-600">{error}</p>}
      <p className="text-xs text-gray-400">
        Max {maxSizeMB} Mo · {acceptedTypes.map((t) => t.replace("image/", "").toUpperCase()).join(", ")}
      </p>
    </div>
  )
}
