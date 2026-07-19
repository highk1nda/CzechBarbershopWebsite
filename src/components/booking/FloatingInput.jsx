import { useId } from 'react'

const labelClass =
  'absolute left-4 top-3.5 font-body text-sm text-frost transition-all duration-200 pointer-events-none ' +
  'peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:tracking-wide peer-focus:uppercase peer-focus:text-mauve ' +
  'peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:tracking-wide peer-[&:not(:placeholder-shown)]:uppercase peer-[&:not(:placeholder-shown)]:text-mauve'

export function FloatingInput({ label, type = 'text', value, onChange, required, error }) {
  const id = useId()
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        required={required}
        className={`peer w-full border rounded-xl bg-white font-body text-sm text-ink px-4 pt-5 pb-2 focus:outline-none transition-colors ${
          error ? 'border-red-300' : 'border-stone focus:border-mauve'
        }`}
      />
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
    </div>
  )
}

export function FloatingTextarea({ label, value, onChange, rows = 4 }) {
  const id = useId()
  return (
    <div className="relative">
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        rows={rows}
        className="peer w-full border border-stone rounded-xl bg-white font-body text-sm text-ink px-4 pt-5 pb-2 focus:outline-none focus:border-mauve transition-colors resize-none"
      />
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
    </div>
  )
}
