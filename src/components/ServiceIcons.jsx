const base = 'w-6 h-6 flex-shrink-0'
const svg = (children) => (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    className={`${base} ${p.className ?? ''}`}>
    {children}
  </svg>
)

export const Scissors = svg(<>
  <circle cx="6" cy="6" r="2.5"/>
  <circle cx="6" cy="18" r="2.5"/>
  <path d="M8.35 7.65 20 12 8.35 16.35"/>
</>)

export const Crown = svg(<>
  <path d="M3 20h18M5 20V10l4 4 3-6 3 6 4-4v10"/>
</>)

export const Waves = svg(<>
  <path d="M2 10c1.5-2.5 3-2.5 4.5 0s3 2.5 4.5 0 3-2.5 4.5 0 3 2.5 4.5 0"/>
  <path d="M2 16c1.5-2.5 3-2.5 4.5 0s3 2.5 4.5 0 3-2.5 4.5 0 3 2.5 4.5 0"/>
</>)

export const PaintBrush = svg(<>
  <path d="M3 21c3 0 7-1 7-8V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8c0 7 4 8 7 8"/>
  <path d="M9 21H3M15 21h6"/>
  <path d="M10 9h4"/>
</>)

export const Sparkle = svg(<>
  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
</>)

export const Dots = svg(<>
  <circle cx="6" cy="8" r="1.2" fill="currentColor" stroke="none"/>
  <circle cx="12" cy="8" r="1.2" fill="currentColor" stroke="none"/>
  <circle cx="18" cy="8" r="1.2" fill="currentColor" stroke="none"/>
  <circle cx="6" cy="13" r="1.2" fill="currentColor" stroke="none"/>
  <circle cx="12" cy="13" r="1.2" fill="currentColor" stroke="none"/>
  <circle cx="18" cy="13" r="1.2" fill="currentColor" stroke="none"/>
  <circle cx="6" cy="18" r="1.2" fill="currentColor" stroke="none"/>
  <circle cx="12" cy="18" r="1.2" fill="currentColor" stroke="none"/>
  <circle cx="18" cy="18" r="1.2" fill="currentColor" stroke="none"/>
</>)

export const Drop = svg(<>
  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
</>)

export const CurlTong = svg(<>
  <path d="M8 3a6 6 0 0 1 6 6c0 3-2 5-2 8"/>
  <path d="M12 17h4"/>
  <path d="M4 6l4-3M4 6l4 3"/>
  <path d="M18 14v7M21 17h-6"/>
</>)

export const Leaf = svg(<>
  <path d="M2 20c4-4 8-6 14-6-1-6-5-10-14-10 0 9 2 14 6 18"/>
  <path d="M2 20 12 9"/>
</>)

export const Flask = svg(<>
  <path d="M6 3v10l-2 6h16l-2-6V3"/>
  <path d="M6 3h12M6 14h12"/>
  <circle cx="10" cy="17" r="0.8" fill="currentColor" stroke="none"/>
  <circle cx="14" cy="18.5" r="0.8" fill="currentColor" stroke="none"/>
</>)

export const HeadMale = svg(<>
  <circle cx="12" cy="8" r="4"/>
  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  <path d="M8.5 8.5c.5-1.5 2-2.5 3.5-2.5"/>
</>)

export const HeadCurl = svg(<>
  <circle cx="12" cy="9" r="4"/>
  <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>
  <path d="M9 6c0-1 .5-2.5 2-3"/>
  <path d="M11 5.5c.5-1 1.5-1 2-.5"/>
</>)

export const Beard = svg(<>
  <circle cx="12" cy="7" r="4"/>
  <path d="M8 11c-1.5 2-2 4-2 6"/>
  <path d="M16 11c1.5 2 2 4 2 6"/>
  <path d="M6 17c1 2 3 3 6 3s5-1 6-3"/>
  <path d="M9 14c0 1.5.5 3 3 3s3-1.5 3-3"/>
</>)

export const Child = svg(<>
  <circle cx="12" cy="7" r="3.5"/>
  <path d="M5 21c0-3.5 3-6 7-6s7 2.5 7 6"/>
  <path d="M9 7c0-1.5 1-2 3-2s3 .5 3 2"/>
</>)

export const Flower = svg(<>
  <circle cx="12" cy="12" r="3"/>
  <path d="M12 2a4 4 0 0 1 0 8 4 4 0 0 1 0-8zM12 14a4 4 0 0 1 0 8 4 4 0 0 1 0-8zM2 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0zM14 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0z"/>
</>)

export const Nail = svg(<>
  <path d="M9 3h6l2 7H7L9 3z"/>
  <rect x="7" y="10" width="10" height="11" rx="1"/>
  <path d="M12 10v11"/>
  <path d="M9 14h6"/>
</>)

export const Wand = svg(<>
  <path d="M15 4l5 5-11 11-5-5z"/>
  <path d="m3 21 3-3"/>
  <path d="M19 3l2 2M17 5l2-2M21 7l-2 2M21 1l-2 2"/>
</>)

export const Clock = svg(<>
  <circle cx="12" cy="12" r="9"/>
  <path d="M12 7v5l3 3"/>
</>)

const ICON_MAP = {
  scissors:  Scissors,
  crown:     Crown,
  waves:     Waves,
  brush:     PaintBrush,
  sparkle:   Sparkle,
  dots:      Dots,
  drop:      Drop,
  curl:      CurlTong,
  leaf:      Leaf,
  flask:     Flask,
  wand:      Wand,
  head:      HeadMale,
  headcurl:  HeadCurl,
  beard:     Beard,
  child:     Child,
  flower:    Flower,
  nail:      Nail,
}

export function ServiceIcon({ name, className = '' }) {
  const Icon = ICON_MAP[name]
  return Icon ? <Icon className={className} /> : null
}
