import { useRef, useState } from 'react'
import { deleteListingMedia, uploadListingMedia } from '../api'
import { imgUrl } from '../format'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const MAX_IMAGE = 10 * 1024 * 1024
const MAX_VIDEO = 100 * 1024 * 1024

/**
 * Uploads straight to Bunny CDN (through the backend) as soon as files are picked.
 * `value` is an array of { url, path, name } — the first image is the cover photo.
 */
export default function MediaUploader({ kind = 'image', value = [], onChange, max = kind === 'image' ? 30 : 5 }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const allowed = kind === 'image' ? IMAGE_TYPES : VIDEO_TYPES
  const maxSize = kind === 'image' ? MAX_IMAGE : MAX_VIDEO

  const handleFiles = async (fileList) => {
    setError('')
    const files = Array.from(fileList || [])
    if (!files.length) return

    const bad = files.find((f) => !allowed.includes(f.type))
    if (bad) return setError(`"${bad.name}" is not a supported ${kind} file.`)
    const big = files.find((f) => f.size > maxSize)
    if (big) return setError(`"${big.name}" is larger than ${kind === 'image' ? '10' : '100'} MB.`)
    if (value.length + files.length > max) return setError(`You can upload up to ${max} ${kind}s.`)

    setUploading(true)
    setProgress(0)
    try {
      const uploaded = await uploadListingMedia(files, setProgress)
      onChange([...value, ...uploaded.map((u) => ({ url: u.url, path: u.path, name: u.originalName }))])
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const remove = (item) => {
    onChange(value.filter((v) => v !== item))
    // Tidy the CDN in the background; the listing no longer references it either way.
    if (item.path) deleteListingMedia(item.path).catch(() => {})
  }

  const makeCover = (item) => onChange([item, ...value.filter((v) => v !== item)])

  return (
    <div>
      <button
        type="button"
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
        className={`flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-9 text-center transition-colors ${
          dragOver ? 'border-gold-500 bg-gold-500/5' : 'border-line hover:border-gold-500/60'
        }`}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/15 text-xl">
          {kind === 'image' ? '🖼️' : '🎬'}
        </span>
        <span className="text-sm font-medium text-ink">
          {uploading ? `Uploading to CDN… ${progress}%` : `Drag & drop or click to upload ${kind === 'image' ? 'photos' : 'a video'}`}
        </span>
        <span className="text-xs text-faded">
          {kind === 'image'
            ? 'JPG, PNG, WEBP · up to 10 MB each · 5+ photos get more enquiries'
            : 'MP4, WEBM, MOV · up to 100 MB · listings with video convert 35% more'}
        </span>
        {uploading && (
          <span className="mt-2 h-1 w-48 overflow-hidden rounded-full bg-chip">
            <span className="block h-full bg-gold-500 transition-all" style={{ width: `${progress}%` }} />
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={allowed.join(',')}
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}

      {value.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {value.map((item, i) => (
            <div key={imgUrl(item)} className="group relative aspect-[4/3] overflow-hidden rounded-md border border-line bg-chip">
              {kind === 'image' ? (
                <img src={imgUrl(item)} alt={item.name || `Photo ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <video src={imgUrl(item)} className="h-full w-full object-cover" muted />
              )}
              {kind === 'image' && i === 0 && (
                <span className="absolute left-2 top-2 rounded bg-gold-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-night">
                  Cover
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-gradient-to-t from-black/85 to-transparent p-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                {kind === 'image' && i !== 0 ? (
                  <button type="button" onClick={() => makeCover(item)} className="rounded bg-white/15 px-2 py-1 text-[11px] text-white hover:bg-white/25">
                    Set cover
                  </button>
                ) : <span />}
                <button type="button" onClick={() => remove(item)} className="rounded bg-red-500/80 px-2 py-1 text-[11px] text-white hover:bg-red-500">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
