import beardSvg       from '../../assets/svg/beard-svgrepo-com.svg'
import brush1Svg      from '../../assets/svg/brush-1-svgrepo-com.svg'
import brush3Svg      from '../../assets/svg/brush-3-svgrepo-com.svg'
import curlingSvg     from '../../assets/svg/curling-svgrepo-com.svg'
import hairdresserSvg from '../../assets/svg/hairdresser-with-scissors-cutting-the-hair-to-a-client-sitting-in-front-of-him-svgrepo-com.svg'
import hairStyleSvg   from '../../assets/svg/hair-style-silhouette-svgrepo-com.svg'
import longHairSvg    from '../../assets/svg/long-female-dark-hair-svgrepo-com.svg'
import magicSvg       from '../../assets/svg/magic-svgrepo-com.svg'
import refreshSvg     from '../../assets/svg/refresh-cw-alt-2-svgrepo-com.svg'
import sparklesSvg    from '../../assets/svg/sparkles-outline-svgrepo-com.svg'
import waterDropSvg   from '../../assets/svg/water-drop-svgrepo-com.svg'
import wavesFillSvg   from '../../assets/svg/waves-fill-svgrepo-com.svg'
import womanCutSvg    from '../../assets/svg/woman-hair-cut-svgrepo-com.svg'
import womanStyleSvg  from '../../assets/svg/woman-hair-hairstyle-svgrepo-com.svg'

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
