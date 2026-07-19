import { useRef, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const MAX_BYTES = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// Single-photo upload/replace/remove widget backed by the "salon-media" bucket.
// `folder` is the storage path prefix, e.g. `services/damsky-strih` or `team/<uuid>`.
export default function PhotoUploadField({ folder, value, onChange, label }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file) {
    if (!file) return
    setError('')
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Nepodporovaný typ souboru. Použijte JPG, PNG, WEBP nebo GIF.')
      return
    }
    if (file.size > MAX_BYTES) {
      setError('Soubor je příliš velký (max. 5 MB).')
      return
    }

    setUploading(true)
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
      const path = `${folder}/${Date.now()}-${safeName}`
      const { error: uploadError } = await supabase.storage.from('salon-media').upload(path, file, { upsert: false })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('salon-media').getPublicUrl(path)
      onChange(data.publicUrl)
    } catch (err) {
      setError(err.message || 'Nahrání se nezdařilo.')
    } finally {
      setUploading(false)
    }
  }

  async function handleRemove() {
    if (value) {
      const prefix = supabase.storage.from('salon-media').getPublicUrl('').data.publicUrl
      const path = value.startsWith(prefix) ? value.slice(prefix.length) : null
      if (path) await supabase.storage.from('salon-media').remove([path]).catch(() => {})
    }
    onChange('')
  }

  return (
    <div>
      {label && <p className="font-body text-xs tracking-wide uppercase text-mauve mb-1.5">{label}</p>}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          handleFile(e.dataTransfer.files?.[0])
        }}
        className="flex items-center gap-4"
      >
        {value ? (
          <div className="relative w-24 h-24 flex-shrink-0 border border-stone overflow-hidden">
            <img src={value} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-ink/70 text-white text-xs leading-none flex items-center justify-center hover:bg-ink"
              aria-label="Odebrat fotku"
            >
              ×
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-24 h-24 flex-shrink-0 border border-dashed border-stone flex items-center justify-center font-body text-[10px] text-warm text-center px-2 hover:border-mauve/50 transition-colors disabled:opacity-50"
          >
            {uploading ? 'Nahrávání…' : 'Přetáhnout nebo vybrat'}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {!value && (
          <button type="button" onClick={() => inputRef.current?.click()} className="font-body text-xs text-mauve underline">
            Vybrat soubor
          </button>
        )}
      </div>
      {error && <p className="font-body text-xs text-red-600 mt-1.5">{error}</p>}
    </div>
  )
}
