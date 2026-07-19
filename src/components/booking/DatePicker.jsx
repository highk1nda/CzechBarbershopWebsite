import { useState } from 'react'
import { isBlockedDate, todayString } from '../../utils/dateRules'

const MONTH_NAMES = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec',
]
const DAY_LABELS = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']

function toDateStr(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export default function DatePicker({ value, onChange }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const firstOfMonth = new Date(viewYear, viewMonth, 1)
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const startOffset = (firstOfMonth.getDay() + 6) % 7 // Monday-first

  const cells = Array(startOffset).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  )

  const todayStr = todayString()

  function goPrevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1)
      setViewMonth(11)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  function goNextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1)
      setViewMonth(0)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  return (
    <div className="rounded-2xl border border-stone p-3 sm:p-5 bg-white">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goPrevMonth}
          aria-label="Předchozí měsíc"
          className="w-8 h-8 flex items-center justify-center rounded-full text-mauve hover:bg-mauve/10 transition-colors"
        >
          ‹
        </button>
        <span className="font-heading text-base text-ink">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={goNextMonth}
          aria-label="Další měsíc"
          className="w-8 h-8 flex items-center justify-center rounded-full text-mauve hover:bg-mauve/10 transition-colors"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_LABELS.map((d) => (
          <span key={d} className="text-center font-body text-[10px] tracking-wide uppercase text-frost py-1">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <span key={`empty-${i}`} />
          const dateStr = toDateStr(viewYear, viewMonth, d)
          const blocked = dateStr < todayStr || Boolean(isBlockedDate(dateStr))
          const isSelected = value === dateStr
          return (
            <button
              key={dateStr}
              type="button"
              disabled={blocked}
              onClick={() => onChange(dateStr)}
              aria-pressed={isSelected}
              aria-label={dateStr}
              className={`aspect-square min-h-[40px] rounded-full flex items-center justify-center font-body text-sm transition-colors duration-200 ${
                isSelected
                  ? 'bg-mauve text-white'
                  : blocked
                  ? 'text-stone/70 cursor-not-allowed'
                  : 'text-ink hover:bg-mauve/10'
              }`}
            >
              {d}
            </button>
          )
        })}
      </div>

      <p className="font-body text-[10px] text-frost mt-3">Po – Pá, bez státních svátků</p>
    </div>
  )
}
