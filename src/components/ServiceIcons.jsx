const SVG = (name) => `/assets/svg/${name}`

const beardSvg       = SVG('beard-svgrepo-com.svg')
const brush1Svg      = SVG('brush-1-svgrepo-com.svg')
const brush3Svg      = SVG('brush-3-svgrepo-com.svg')
const curlingSvg     = SVG('curling-svgrepo-com.svg')
const hairdresserSvg = SVG('hairdresser-with-scissors-cutting-the-hair-to-a-client-sitting-in-front-of-him-svgrepo-com.svg')
const hairStyleSvg   = SVG('hair-style-silhouette-svgrepo-com.svg')
const longHairSvg    = SVG('long-female-dark-hair-svgrepo-com.svg')
const magicSvg       = SVG('magic-svgrepo-com.svg')
const refreshSvg     = SVG('refresh-cw-alt-2-svgrepo-com.svg')
const sparklesSvg    = SVG('sparkles-outline-svgrepo-com.svg')
const waterDropSvg   = SVG('water-drop-svgrepo-com.svg')
const wavesFillSvg   = SVG('waves-fill-svgrepo-com.svg')
const womanCutSvg    = SVG('woman-hair-cut-svgrepo-com.svg')
const womanStyleSvg  = SVG('woman-hair-hairstyle-svgrepo-com.svg')

const ICON_SRCS = {
  scissors:  hairdresserSvg,
  crown:     womanStyleSvg,
  waves:     wavesFillSvg,
  brush:     brush1Svg,
  sparkle:   sparklesSvg,
  dots:      magicSvg,
  drop:      waterDropSvg,
  curl:      curlingSvg,
  leaf:      refreshSvg,
  flask:     brush3Svg,
  wand:      magicSvg,
  head:      hairStyleSvg,
  headcurl:  curlingSvg,
  beard:     beardSvg,
  child:     womanCutSvg,
  flower:    longHairSvg,
  nail:      sparklesSvg,
}

const svgBase = 'w-6 h-6'

export function ServiceIcon({ name, className = '' }) {
  const src = ICON_SRCS[name]
  if (!src) return null
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={`${svgBase} object-contain icon-svg ${className}`}
    />
  )
}

const clockSvg = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    className={`${svgBase} flex-shrink-0 ${p.className ?? ''}`}>
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 7v5l3 3"/>
  </svg>
)

export const Clock = clockSvg
