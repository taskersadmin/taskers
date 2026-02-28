'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Camera, Check } from 'lucide-react'

interface PhotoUploaderProps {
  jobId: string
  type: 'BEFORE' | 'AFTER'
  onUploadComplete: () => void
}

export function PhotoUploader({ jobId, type, onUploadComplete }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setUploading(true)

    try {
      // Get signed URL
      const signRes = await fetch('/api/uploads/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          jobId, 
          type, 
          fileType: file.type,
          fileSize: file.size 
        }),
      })
      
      const { signedUrl, path } = await signRes.json()

      // Upload to Supabase
      await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })

      // Commit metadata
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      await fetch('/api/uploads/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          type,
          path,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          deviceInfo: navigator.userAgent,
        }),
      })

      onUploadComplete()
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload photo. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={inputRef}
        onChange={handleCapture}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative">
          <img src={preview} alt="Preview" className="w-full rounded-lg" />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <div className="text-white text-xl">Uploading...</div>
            </div>
          )}
          {!uploading && <Check className="absolute top-2 right-2 h-8 w-8 text-green-500" />}
        </div>
      ) : (
        <Button 
          onClick={() => inputRef.current?.click()}
          className="w-full h-32 text-xl"
          disabled={uploading}
        >
          <Camera className="mr-2 h-6 w-6" />
          Take {type} Photo
        </Button>
      )}
      
      <p className="text-sm text-muted-foreground text-center">
        Photo must show the work area clearly
      </p>
    </div>
  )
}
