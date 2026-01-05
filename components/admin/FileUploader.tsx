'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

interface FileUploaderProps {
  productId: string
  files: string[]
  onFilesChange: (files: string[]) => void
  accept?: string
  maxFiles?: number
  label?: string
  showPreview?: boolean
}

export function FileUploader({ 
  productId, 
  files, 
  onFilesChange,
  accept = 'image/*,video/*',
  maxFiles = 20,
  label = 'Upload Images & Videos',
  showPreview = true
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `products/${fileName}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        throw error
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-assets')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading file:', error)
      return null
    }
  }

  const handleFiles = async (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return

    const filesArray = Array.from(selectedFiles)
    const remainingSlots = maxFiles - files.length

    if (filesArray.length > remainingSlots) {
      alert(`You can only upload ${remainingSlots} more file(s)`)
      return
    }

    setUploading(true)

    try {
      const uploadPromises = filesArray.map(file => uploadFile(file))
      const urls = await Promise.all(uploadPromises)
      const successfulUrls = urls.filter((url): url is string => url !== null)
      
      onFilesChange([...files, ...successfulUrls])
    } catch (error) {
      alert('Error uploading files. Please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const deleteFile = async (url: string, index: number) => {
    try {
      // Extract file path from URL
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split('/')
      const bucketIndex = pathParts.indexOf('product-assets')
      
      if (bucketIndex === -1) {
        // If it's an external URL, just remove from UI
        onFilesChange(files.filter((_, i) => i !== index))
        return
      }

      const filePath = pathParts.slice(bucketIndex + 1).join('/')

      // Delete from storage
      const { error } = await supabase.storage
        .from('product-assets')
        .remove([filePath])

      if (error) {
        console.error('Delete error:', error)
        // Still remove from UI even if storage delete fails
      }

      // Remove from files array
      onFilesChange(files.filter((_, i) => i !== index))
    } catch (error) {
      console.error('Error deleting file:', error)
      // Still remove from UI
      onFilesChange(files.filter((_, i) => i !== index))
    }
  }

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
  }

  const isVideo = (url: string) => {
    return /\.(mp4|webm|ogg|mov)$/i.test(url)
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary-600 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={uploading || files.length >= maxFiles}
        />
        
        <div className="space-y-2">
          <p className="text-gray-600">
            Drag and drop files here, or{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-primary-600 hover:text-primary-700 underline"
              disabled={uploading || files.length >= maxFiles}
            >
              browse
            </button>
          </p>
          <p className="text-xs text-gray-500">
            Supports images (JPG, PNG, GIF, WebP) and videos (MP4, WebM)
            {maxFiles && ` • Max ${maxFiles} files`}
            {files.length > 0 && ` • ${files.length} uploaded`}
          </p>
          {uploading && (
            <p className="text-sm text-primary-600">Uploading...</p>
          )}
        </div>
      </div>

      {/* File Previews */}
      {showPreview && files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {files.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative">
                {isImage(url) ? (
                  // Use regular img tag for Supabase Storage URLs to avoid Next.js Image optimization issues
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : isVideo(url) ? (
                  <video
                    src={url}
                    className="w-full h-full object-cover"
                    controls={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400 text-xs">File</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => deleteFile(url, index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="mt-1 text-xs text-gray-500 truncate">
                {url.split('/').pop()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

