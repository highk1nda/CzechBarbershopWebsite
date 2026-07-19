import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const LANGS = ['cs', 'en', 'uk']

const SETTINGS_FIELDS = [
  { key: 'phone', label: 'Telefon' },
  { key: 'email', label: 'E-mail' },
  { key: 'address_street', label: 'Adresa — ulice' },
  { key: 'address_city', label: 'Adresa — město' },
  { key: 'hours_weekdays_time', label: 'Otevírací doba — všední dny' },
  { key: 'hours_saturday_time', label: 'Otevírací doba — sobota' },
  { key: 'hours_sunday_closed', label: 'Neděle zavřeno (true/false)' },
  { key: 'map_query', label: 'Adresa pro mapu (Google Maps)' },
]

function prettifyKey(key) {
  return key
    .split('.')
    .map((seg) => (/^\d+$/.test(seg) ? `#${Number(seg) + 1}` : seg.charAt(0).toUpperCase() + seg.slice(1)))
    .join(' › ')
}

function sectionOf(key) {
  return key.split('.')[0]
}

const SECTION_LABELS = {
  nav: 'Navigace', hero: 'Úvod (Hero)', highlights: 'Přednosti', team: 'Tým — nadpisy',
  gallery: 'Galerie', instagram: 'Instagram', contact: 'Kontakt — nadpisy', footer: 'Patička',
}

export default function SiteContentPage() {
  const [contentRows, setContentRows] = useState(null)
  const [settingsRows, setSettingsRows] = useState(null)
  const [values, setValues] = useState({})
  const [settings, setSettings] = useState({})
  const [activeLang, setActiveLang] = useState('cs')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    Promise.all([
      supabase.from('site_content').select('key, lang, value'),
      supabase.from('site_settings').select('key, value'),
    ]).then(([contentRes, settingsRes]) => {
      if (contentRes.error) { setError(contentRes.error.message); return }
      if (settingsRes.error) { setError(settingsRes.error.message); return }
      setContentRows(contentRes.data)
      setSettingsRows(settingsRes.data)

      const byKey = {}
      for (const row of contentRes.data) {
        (byKey[row.key] ??= {})[row.lang] = row.value
      }
      setValues(byKey)
      setSettings(Object.fromEntries(settingsRes.data.map((r) => [r.key, r.value])))
    })
  }, [])

  if (error) return <p className="font-body text-sm text-red-600">{error}</p>
  if (!contentRows) return <p className="font-body text-sm text-warm">Načítání…</p>

  const keys = Object.keys(values).sort()
  const sections = {}
  for (const key of keys) (sections[sectionOf(key)] ??= []).push(key)

  function setValue(key, lang, value) {
    setValues((v) => ({ ...v, [key]: { ...v[key], [lang]: value } }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const contentPayload = []
      for (const key of keys) {
        for (const lang of LANGS) {
          const value = values[key]?.[lang]
          if (value !== undefined && value !== '') contentPayload.push({ key, lang, value })
        }
      }
      const settingsPayload = SETTINGS_FIELDS.map((f) => ({ key: f.key, value: settings[f.key] ?? '' }))

      const [contentRes, settingsRes] = await Promise.all([
        supabase.from('site_content').upsert(contentPayload),
        supabase.from('site_settings').upsert(settingsPayload),
      ])
      if (contentRes.error) throw contentRes.error
      if (settingsRes.error) throw settingsRes.error
      setSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading text-3xl text-ink mb-6">Texty webu</h1>

      <section className="bg-white border border-stone shadow-soft p-6 mb-6">
        <h2 className="font-heading text-lg text-ink mb-4">Obecné informace</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SETTINGS_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="font-body text-xs tracking-wide uppercase text-mauve">{f.label}</label>
              <input
                value={settings[f.key] ?? ''}
                onChange={(e) => setSettings((s) => ({ ...s, [f.key]: e.target.value }))}
                className="w-full border border-stone px-3 py-2 font-body text-sm mt-1 focus:outline-none focus:border-mauve"
              />
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-2 mb-4 sticky top-0 bg-parchment py-2 z-10">
        {LANGS.map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setActiveLang(lang)}
            className={`font-body text-xs tracking-widest uppercase px-3 py-1.5 rounded-full border ${activeLang === lang ? 'bg-mauve border-mauve text-white' : 'border-stone text-charcoal bg-white'}`}
          >
            {lang}
          </button>
        ))}
      </div>

      {Object.entries(sections).map(([section, sectionKeys]) => (
        <details key={section} className="bg-white border border-stone shadow-soft mb-4 group" open={section === 'hero'}>
          <summary className="font-heading text-lg text-ink px-6 py-4 cursor-pointer select-none">
            {SECTION_LABELS[section] ?? section}
          </summary>
          <div className="px-6 pb-6 space-y-3">
            {sectionKeys.map((key) => (
              <div key={key}>
                <label className="font-body text-xs tracking-wide uppercase text-mauve">{prettifyKey(key)}</label>
                <input
                  value={values[key]?.[activeLang] ?? ''}
                  onChange={(e) => setValue(key, activeLang, e.target.value)}
                  className="w-full border border-stone px-3 py-2 font-body text-sm mt-1 focus:outline-none focus:border-mauve"
                />
              </div>
            ))}
          </div>
        </details>
      ))}

      {error && <p className="font-body text-sm text-red-600 mt-4">{error}</p>}
      {saved && <p className="font-body text-sm text-green-700 mt-4">Uloženo.</p>}

      <div className="sticky bottom-4 flex justify-end mt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="font-body text-xs tracking-widest2 uppercase px-8 py-3.5 bg-mauve text-white shadow-lift hover:bg-mauve-deep transition-colors disabled:opacity-50"
        >
          {saving ? 'Ukládání…' : 'Uložit vše'}
        </button>
      </div>
    </div>
  )
}
