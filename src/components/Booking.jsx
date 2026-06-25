import { useState, useMemo } from 'react'
import emailjs from '@emailjs/browser'
import { Reveal } from './Reveal'
import { SERVICES } from '../data/services'
import FloatingFlower from './FloatingFlower'
import flowerImg  from '../../assets/flower.png'
import flower3Img from '../../assets/flower3.png'

// ─── EmailJS credentials ──────────────────────────────────────────────────────
// Fill these in after setting up your EmailJS account (emailjs.com):
//   1. Connect your Gmail → copy Service ID
//   2. Create a template with variables listed below → copy Template ID
//   3. Account → Integration → copy Public Key
const EMAILJS_SERVICE_ID  = 'service_5yt31kq'
const EMAILJS_TEMPLATE_ID = 'template_fd1br92'
const EMAILJS_PUBLIC_KEY  = 'RzSL5SRtdfLdYLbzM'

// Template variables used: {{client_name}}, {{client_email}}, {{client_phone}},
//   {{services}}, {{workers}}, {{preferred_person}}, {{datetime}}, {{message}}
// ─────────────────────────────────────────────────────────────────────────────

// Flat list: [{tabLabel, categoryTitle, item}]
const ALL_ITEMS = SERVICES.flatMap(tab =>
  tab.categories.flatMap(cat =>
    cat.items.map(item => ({ tabLabel: tab.label, categoryTitle: cat.title, item }))
  )
)

function formatPrague(date, time) {
  try {
    return new Intl.DateTimeFormat('cs-CZ', {
      timeZone: 'Europe/Prague',
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(`${date}T${time}`))
  } catch {
    return `${date} ${time}`
  }
}

function buildEmailParams({ selected, date, time, name, email, phone, message, preferredPerson }) {
  const selectedItems = ALL_ITEMS
    .filter(({ item }) => selected.has(item.name))
    .map(({ item }) => item)

  const servicesLines = selectedItems
    .map(item => `- ${item.name} (${item.price}) — ${item.workers.join(', ')}`)
    .join('\n')

  const workers = [...new Set(selectedItems.flatMap(item => item.workers))].join(', ')

  return {
    client_name:       name,
    client_email:      email || '—',
    client_phone:      phone || '—',
    services:          servicesLines || '—',
    workers:           workers || '—',
    preferred_person:  preferredPerson || '—',
    datetime:          formatPrague(date, time),
    message:           message || '—',
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ServiceList({ selected, onToggle }) {
  // Group by tabLabel → categoryTitle
  const groups = useMemo(() => {
    const map = new Map()
    ALL_ITEMS.forEach(({ tabLabel, categoryTitle, item }) => {
      const key = `${tabLabel} / ${categoryTitle}`
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(item)
    })
    return [...map.entries()]
  }, [])

  return (
    <div className="border border-stone bg-parchment/40 h-72 overflow-y-auto p-4 space-y-5">
      {groups.map(([groupKey, items]) => (
        <div key={groupKey}>
          <p className="font-body text-[10px] tracking-widest uppercase text-mauve mb-2">{groupKey}</p>
          <div className="space-y-1.5">
            {items.map(item => (
              <label key={item.name} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selected.has(item.name)}
                  onChange={() => onToggle(item.name)}
                  className="accent-[#7a6b7d] w-4 h-4 flex-shrink-0 cursor-pointer"
                />
                <span className="font-body text-sm text-charcoal group-hover:text-ink transition-colors">
                  {item.name}
                </span>
                <span className="font-body text-xs text-stone ml-auto flex-shrink-0">{item.price}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function InputField({ label, type = 'text', value, onChange, required, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-[10px] tracking-widest uppercase text-mauve">
        {label}{required && <span className="text-mauve ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="border border-stone bg-white font-body text-sm text-ink px-4 py-2.5 placeholder:text-stone/60 focus:outline-none focus:border-mauve transition-colors"
      />
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Booking() {
  const [selected,        setSelected]        = useState(new Set())
  const [date,            setDate]            = useState('')
  const [time,            setTime]            = useState('')
  const [name,            setName]            = useState('')
  const [email,           setEmail]           = useState('')
  const [phone,           setPhone]           = useState('')
  const [message,         setMessage]         = useState('')
  const [status,          setStatus]          = useState('idle') // idle | sending | sent | error
  const [preferredPerson, setPreferredPerson] = useState(() => sessionStorage.getItem('preferredPerson') || '')

  function toggleService(itemName) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(itemName) ? next.delete(itemName) : next.add(itemName)
      return next
    })
  }

  const canSubmit =
    selected.size > 0 &&
    date && time &&
    name.trim() &&
    (email.trim() || phone.trim()) &&
    status !== 'sending'

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('sending')
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        buildEmailParams({ selected, date, time, name, email, phone, message, preferredPerson }),
        EMAILJS_PUBLIC_KEY,
      )
      setStatus('sent')
    } catch (err) {
      console.error('EmailJS error:', err)
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <section id="booking" className="section-padding bg-ivory border-t border-stone relative overflow-hidden">
        <FloatingFlower
          src={flower3Img}
          style={{ top: '-40px', right: '-30px', width: '280px', opacity: 0.10, transform: 'rotate(-15deg)' }}
          amplitude={11}
          duration={11}
        />
        <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center relative z-10">
          <Reveal>
            <p className="font-body text-xs tracking-widest3 uppercase text-mauve mb-5">Rezervace online</p>
            <h2 className="font-heading text-4xl lg:text-5xl text-ink mb-4">
              Potvrzení <em className="text-mauve not-italic">odesláno</em>
            </h2>
            <span className="mauve-rule mx-auto block mb-7" />
            <p className="font-body text-base text-charcoal leading-relaxed max-w-sm mx-auto mb-8">
              Děkujeme! Brzy vás kontaktujeme pro potvrzení termínu.
            </p>
            <button
              onClick={() => { setStatus('idle'); setSelected(new Set()); setDate(''); setTime(''); setName(''); setEmail(''); setPhone(''); setMessage(''); setPreferredPerson(''); sessionStorage.removeItem('preferredPerson') }}
              className="inline-block border border-stone text-warm font-body text-xs tracking-widest2 uppercase px-8 py-3.5 hover:border-mauve hover:text-mauve transition-all duration-300"
            >
              Nová rezervace
            </button>
          </Reveal>
        </div>
      </section>
    )
  }

  return (
    <section id="booking" className="section-padding bg-ivory border-t border-stone relative overflow-hidden">

      <FloatingFlower
        src={flower3Img}
        style={{ top: '-40px', right: '-30px', width: '280px', opacity: 0.10, transform: 'rotate(-15deg)' }}
        amplitude={11}
        duration={11}
        delay={0.8}
      />
      <FloatingFlower
        src={flowerImg}
        style={{ bottom: '-60px', left: '-50px', width: '260px', opacity: 0.10, transform: 'scaleX(-1)' }}
        amplitude={9}
        duration={13}
        delay={2.5}
      />

      <div className="max-w-5xl mx-auto px-6 lg:px-10 relative z-10">

        <Reveal>
          <div className="text-center mb-10">
            <p className="font-body text-xs tracking-widest3 uppercase text-mauve mb-5">Rezervace online</p>
            <h2 className="font-heading text-4xl lg:text-5xl text-ink mb-4">
              Vaše krása,{' '}
              <em className="text-mauve not-italic">váš čas</em>
            </h2>
            <span className="mauve-rule mx-auto block mb-7" />
            <p className="font-body text-base text-charcoal leading-relaxed max-w-sm mx-auto">
              Jednoduše, rychle, online — vyberte si službu a čas, který vám vyhovuje.
            </p>
          </div>
        </Reveal>

        <form onSubmit={handleSubmit} noValidate>
          {/* ── Services + Date/Time ── */}
          <Reveal delay={0.08}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mb-6">

              {/* Service checkboxes */}
              <div>
                <p className="font-body text-[10px] tracking-widest uppercase text-mauve mb-2">
                  Vyberte služby <span className="text-mauve">*</span>
                </p>
                <ServiceList selected={selected} onToggle={toggleService} />
                {selected.size > 0 && (
                  <p className="font-body text-xs text-charcoal mt-2">
                    Vybráno: {selected.size} {selected.size === 1 ? 'služba' : selected.size < 5 ? 'služby' : 'služeb'}
                  </p>
                )}
              </div>

              {/* Date + Time */}
              <div className="flex flex-col gap-5">
                <InputField
                  label="Datum"
                  type="date"
                  value={date}
                  onChange={setDate}
                  required
                  placeholder=""
                />
                <InputField
                  label="Čas"
                  type="time"
                  value={time}
                  onChange={setTime}
                  required
                  placeholder=""
                />
              </div>
            </div>
          </Reveal>

          {/* ── Preferred person ── */}
          {preferredPerson && (
            <Reveal delay={0.1}>
              <div className="flex items-center gap-3 mb-6">
                <p className="font-body text-[10px] tracking-widest uppercase text-mauve flex-shrink-0">
                  Preferovaná osoba
                </p>
                <div className="flex items-center gap-2 border border-mauve/40 bg-mauve/6 px-3.5 py-1.5">
                  <span className="font-body text-sm text-mauve-deep">{preferredPerson}</span>
                  <button
                    type="button"
                    onClick={() => { setPreferredPerson(''); sessionStorage.removeItem('preferredPerson') }}
                    className="text-stone hover:text-mauve transition-colors ml-1 leading-none"
                    aria-label="Odebrat preferovanou osobu"
                  >
                    ×
                  </button>
                </div>
              </div>
            </Reveal>
          )}

          {/* ── Contact info ── */}
          <Reveal delay={0.12}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <InputField label="Jméno"   value={name}   onChange={setName}   required placeholder="Jana Nováková" />
              <InputField label="Email"   type="email" value={email}  onChange={setEmail}  placeholder="jana@example.com" />
              <InputField label="Telefon" type="tel"   value={phone}  onChange={setPhone}  placeholder="+420 777 123 456" />
            </div>
          </Reveal>

          {/* ── Message ── */}
          <Reveal delay={0.16}>
            <div className="flex flex-col gap-1.5 mb-8">
              <label className="font-body text-[10px] tracking-widest uppercase text-mauve">Zpráva</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                placeholder="Volitelná zpráva nebo přání..."
                className="border border-stone bg-white font-body text-sm text-ink px-4 py-2.5 placeholder:text-stone/60 focus:outline-none focus:border-mauve transition-colors resize-none"
              />
            </div>
          </Reveal>

          {/* ── Submit ── */}
          <Reveal delay={0.2}>
            <div className="text-center space-y-4">
              {status === 'error' && (
                <p className="font-body text-sm text-red-500">
                  Něco se pokazilo. Zkuste to znovu nebo nás kontaktujte přímo.
                </p>
              )}
              {!canSubmit && status === 'idle' && (
                <p className="font-body text-xs text-stone">
                  {selected.size === 0 ? 'Vyberte alespoň jednu službu.' : !date || !time ? 'Zadejte datum a čas.' : !name.trim() ? 'Zadejte své jméno.' : 'Zadejte email nebo telefon.'}
                </p>
              )}
              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-block border border-stone text-warm font-body text-xs tracking-widest2 uppercase px-10 py-4 hover:border-mauve hover:text-mauve transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-stone disabled:hover:text-warm"
              >
                {status === 'sending' ? 'Odesílám…' : 'Odeslat rezervaci'}
              </button>
            </div>
          </Reveal>
        </form>

      </div>
    </section>
  )
}
