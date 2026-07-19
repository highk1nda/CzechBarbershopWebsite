import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { formatPriceRange, formatDurationRange } from '../../utils/priceDuration'
import { ICON_NAMES, ServiceIcon } from '../../components/ServiceIcons'
import PhotoUploadField from '../components/PhotoUploadField'
import ConfirmDialog from '../components/ConfirmDialog'

const LANGS = [
  { code: 'cs', label: 'Čeština' },
  { code: 'en', label: 'English' },
  { code: 'uk', label: 'Українська' },
]

const DIACRITICS_RE = new RegExp('[' + String.fromCharCode(0x0300) + '-' + String.fromCharCode(0x036f) + ']', 'g')

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(DIACRITICS_RE, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const emptyTranslation = () => ({ name: '', desc: '', details_text: '', details_steps: '' })

export default function ServiceEditPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isNew = !id

  const [tabs, setTabs] = useState([])
  const [categories, setCategories] = useState([])
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [activeLang, setActiveLang] = useState('cs')

  const [categoryId, setCategoryId] = useState(searchParams.get('category') ?? '')
  const [icon, setIcon] = useState(ICON_NAMES[0])
  const [translations, setTranslations] = useState({ cs: emptyTranslation(), en: emptyTranslation(), uk: emptyTranslation() })
  const [photos, setPhotos] = useState([])
  const [workerIds, setWorkerIds] = useState([])
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [priceOpenEnded, setPriceOpenEnded] = useState(false)
  const [priceUnknown, setPriceUnknown] = useState(false)
  const [durationMin, setDurationMin] = useState('')
  const [durationMax, setDurationMax] = useState('')
  const [durationUpTo, setDurationUpTo] = useState(false)
  const [active, setActive] = useState(true)

  useEffect(() => {
    async function load() {
      const [tabsRes, categoriesRes, teamRes] = await Promise.all([
        supabase.from('tabs').select('id, sort_order, tab_translations(lang, label)').order('sort_order'),
        supabase.from('categories').select('id, tab_id, sort_order, category_translations(lang, title)').order('sort_order'),
        supabase.from('team_members').select('id, team_member_translations(lang, name)').eq('active', true).order('sort_order'),
      ])
      if (tabsRes.error || categoriesRes.error || teamRes.error) {
        setError((tabsRes.error || categoriesRes.error || teamRes.error).message)
        setLoading(false)
        return
      }
      setTabs(tabsRes.data)
      setCategories(categoriesRes.data)
      setTeam(teamRes.data.map((t) => ({ id: t.id, name: t.team_member_translations.find((x) => x.lang === 'cs')?.name ?? '' })))

      if (!isNew) {
        const { data: service, error: svcErr } = await supabase
          .from('services')
          .select(`
            id, icon, category_id, active,
            price_min, price_max, price_open_ended, price_unknown,
            duration_min_minutes, duration_max_minutes, duration_up_to,
            service_translations(lang, name, description, details_text, details_steps),
            service_photos(id, url, sort_order),
            service_workers(team_member_id)
          `)
          .eq('id', id)
          .single()
        if (svcErr) { setError(svcErr.message); setLoading(false); return }

        setCategoryId(service.category_id)
        setIcon(service.icon ?? ICON_NAMES[0])
        setActive(service.active)
        setPriceMin(service.price_min ?? '')
        setPriceMax(service.price_max ?? '')
        setPriceOpenEnded(service.price_open_ended)
        setPriceUnknown(service.price_unknown)
        setDurationMin(service.duration_min_minutes ?? '')
        setDurationMax(service.duration_max_minutes ?? '')
        setDurationUpTo(service.duration_up_to)
        setPhotos(service.service_photos.slice().sort((a, b) => a.sort_order - b.sort_order))
        setWorkerIds(service.service_workers.map((w) => w.team_member_id))

        const byLang = {}
        for (const t of service.service_translations) {
          byLang[t.lang] = {
            name: t.name ?? '',
            desc: t.description ?? '',
            details_text: t.details_text ?? '',
            details_steps: (t.details_steps ?? []).join('\n'),
          }
        }
        setTranslations({ cs: byLang.cs ?? emptyTranslation(), en: byLang.en ?? emptyTranslation(), uk: byLang.uk ?? emptyTranslation() })
      }
      setLoading(false)
    }
    load()
  }, [id, isNew])

  function updateTranslation(lang, field, value) {
    setTranslations((t) => ({ ...t, [lang]: { ...t[lang], [field]: value } }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    if (!categoryId) { setError('Vyberte kategorii.'); return }
    if (!translations.cs.name.trim()) { setError('Vyplňte český název služby.'); return }
    if (!priceUnknown && priceMin === '') { setError('Vyplňte cenu, nebo zaškrtněte "cena neurčena".'); return }

    setSaving(true)
    try {
      const payload = {
        icon,
        category_id: categoryId,
        active,
        price_min: priceUnknown ? null : Number(priceMin),
        price_max: priceUnknown || priceMax === '' ? null : Number(priceMax),
        price_open_ended: priceUnknown ? false : priceOpenEnded,
        price_unknown: priceUnknown,
        duration_min_minutes: durationMin === '' ? null : Number(durationMin),
        duration_max_minutes: durationMax === '' ? null : Number(durationMax),
        duration_up_to: durationMax === '' ? false : durationUpTo,
      }

      let serviceId = id
      if (isNew) {
        const base = slugify(translations.cs.name)
        const { data: existing } = await supabase.from('services').select('id').like('id', `${base}%`)
        const existingIds = new Set((existing ?? []).map((r) => r.id))
        let slug = base
        let n = 2
        while (existingIds.has(slug)) { slug = `${base}-${n}`; n++ }
        serviceId = slug
        const { error: insertErr } = await supabase.from('services').insert({ id: serviceId, sort_order: 999, ...payload })
        if (insertErr) throw insertErr
      } else {
        const { error: updateErr } = await supabase.from('services').update(payload).eq('id', serviceId)
        if (updateErr) throw updateErr
      }

      for (const lang of ['cs', 'en', 'uk']) {
        const t = translations[lang]
        if (!t.name.trim()) continue
        await supabase.from('service_translations').upsert({
          service_id: serviceId,
          lang,
          name: t.name.trim(),
          description: t.desc.trim() || null,
          details_text: t.details_text.trim() || null,
          details_steps: t.details_steps.trim() ? t.details_steps.split('\n').map((s) => s.trim()).filter(Boolean) : null,
        })
      }

      await supabase.from('service_workers').delete().eq('service_id', serviceId)
      if (workerIds.length > 0) {
        await supabase.from('service_workers').insert(workerIds.map((team_member_id) => ({ service_id: serviceId, team_member_id })))
      }

      navigate('/admin/services')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    await supabase.from('services').delete().eq('id', id)
    navigate('/admin/services')
  }

  async function addPhoto(url) {
    if (!url) return
    const sortOrder = photos.length
    const { data, error: photoErr } = await supabase
      .from('service_photos')
      .insert({ service_id: id, url, sort_order: sortOrder })
      .select('id, url, sort_order')
      .single()
    if (photoErr) { setError(photoErr.message); return }
    setPhotos((p) => [...p, data])
  }

  async function removePhoto(photo) {
    await supabase.from('service_photos').delete().eq('id', photo.id)
    setPhotos((p) => p.filter((x) => x.id !== photo.id))
  }

  if (loading) return <p className="font-body text-sm text-warm">Načítání…</p>

  const tabsWithCategories = tabs.map((tab) => ({
    ...tab,
    label: tab.tab_translations.find((t) => t.lang === 'cs')?.label ?? '',
    categories: categories.filter((c) => c.tab_id === tab.id),
  }))

  const pricePreview = priceUnknown ? 'Cena bude upřesněna' : formatPriceRange(Number(priceMin) || 0, priceMax === '' ? undefined : Number(priceMax), priceOpenEnded)
  const durationPreview = durationMin === '' ? '—' : formatDurationRange(Number(durationMin), durationMax === '' ? undefined : Number(durationMax), durationUpTo)

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl text-ink">{isNew ? 'Nová služba' : 'Upravit službu'}</h1>
        <Link to="/admin/services" className="font-body text-sm text-warm hover:text-mauve">← Zpět na seznam</Link>
      </div>

      <form onSubmit={handleSave} className="space-y-6 bg-white border border-stone shadow-soft p-6">
        {/* Language tabs */}
        <div className="flex gap-2 border-b border-stone pb-3">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setActiveLang(l.code)}
              className={`font-body text-xs tracking-widest uppercase px-3 py-1.5 rounded-full border ${activeLang === l.code ? 'bg-mauve border-mauve text-white' : 'border-stone text-charcoal'}`}
            >
              {l.code}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-body text-xs tracking-wide uppercase text-mauve">Název {activeLang === 'cs' && '*'}</label>
            <input
              value={translations[activeLang].name}
              onChange={(e) => updateTranslation(activeLang, 'name', e.target.value)}
              className="w-full border border-stone px-3 py-2 font-body text-sm mt-1 focus:outline-none focus:border-mauve"
            />
          </div>
          <div>
            <label className="font-body text-xs tracking-wide uppercase text-mauve">Krátký popis (volitelné)</label>
            <input
              value={translations[activeLang].desc}
              onChange={(e) => updateTranslation(activeLang, 'desc', e.target.value)}
              className="w-full border border-stone px-3 py-2 font-body text-sm mt-1 focus:outline-none focus:border-mauve"
            />
          </div>
          <div>
            <label className="font-body text-xs tracking-wide uppercase text-mauve">Detailní popis (pro "Více info")</label>
            <textarea
              value={translations[activeLang].details_text}
              onChange={(e) => updateTranslation(activeLang, 'details_text', e.target.value)}
              rows={3}
              className="w-full border border-stone px-3 py-2 font-body text-sm mt-1 focus:outline-none focus:border-mauve"
            />
          </div>
          <div>
            <label className="font-body text-xs tracking-wide uppercase text-mauve">Kroky procedury (volitelné, jeden na řádek)</label>
            <textarea
              value={translations[activeLang].details_steps}
              onChange={(e) => updateTranslation(activeLang, 'details_steps', e.target.value)}
              rows={3}
              className="w-full border border-stone px-3 py-2 font-body text-sm mt-1 focus:outline-none focus:border-mauve"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-stone pt-5">
          <div>
            <label className="font-body text-xs tracking-wide uppercase text-mauve">Kategorie</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-stone px-3 py-2 font-body text-sm mt-1 focus:outline-none focus:border-mauve"
            >
              <option value="">— vybrat —</option>
              {tabsWithCategories.map((tab) => (
                <optgroup key={tab.id} label={tab.label}>
                  {tab.categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.category_translations.find((t) => t.lang === 'cs')?.title}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label className="font-body text-xs tracking-wide uppercase text-mauve">Ikona</label>
            <div className="flex items-center gap-2 mt-1">
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="flex-1 border border-stone px-3 py-2 font-body text-sm focus:outline-none focus:border-mauve"
              >
                {ICON_NAMES.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
              <span className="w-9 h-9 flex items-center justify-center border border-stone flex-shrink-0"><ServiceIcon name={icon} /></span>
            </div>
          </div>
        </div>

        <div className="border-t border-stone pt-5">
          <p className="font-body text-xs tracking-wide uppercase text-mauve mb-2">Cena</p>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5 font-body text-sm text-charcoal">
              <input type="checkbox" checked={priceUnknown} onChange={(e) => setPriceUnknown(e.target.checked)} />
              cena neurčena
            </label>
            {!priceUnknown && (
              <>
                <input type="number" min="0" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="od" className="w-24 border border-stone px-3 py-2 font-body text-sm focus:outline-none focus:border-mauve" />
                <span className="text-warm">–</span>
                <input type="number" min="0" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="do (volitelné)" className="w-28 border border-stone px-3 py-2 font-body text-sm focus:outline-none focus:border-mauve" />
                <label className="flex items-center gap-1.5 font-body text-sm text-charcoal">
                  <input type="checkbox" checked={priceOpenEnded} onChange={(e) => setPriceOpenEnded(e.target.checked)} />
                  "od" (otevřená cena)
                </label>
              </>
            )}
          </div>
          <p className="font-body text-xs text-warm mt-2">Náhled: <span className="text-mauve-deep">{pricePreview}</span></p>
        </div>

        <div className="border-t border-stone pt-5">
          <p className="font-body text-xs tracking-wide uppercase text-mauve mb-2">Délka trvání (volitelné, v minutách)</p>
          <div className="flex flex-wrap items-center gap-3">
            <input type="number" min="0" value={durationMin} onChange={(e) => setDurationMin(e.target.value)} placeholder="min" className="w-24 border border-stone px-3 py-2 font-body text-sm focus:outline-none focus:border-mauve" />
            <span className="text-warm">–</span>
            <input type="number" min="0" value={durationMax} onChange={(e) => setDurationMax(e.target.value)} placeholder="max (volitelné)" className="w-28 border border-stone px-3 py-2 font-body text-sm focus:outline-none focus:border-mauve" />
            <label className="flex items-center gap-1.5 font-body text-sm text-charcoal">
              <input type="checkbox" checked={durationUpTo} onChange={(e) => setDurationUpTo(e.target.checked)} />
              "do" (maximální doba)
            </label>
          </div>
          <p className="font-body text-xs text-warm mt-2">Náhled: <span className="text-mauve-deep">{durationPreview}</span></p>
        </div>

        <div className="border-t border-stone pt-5">
          <p className="font-body text-xs tracking-wide uppercase text-mauve mb-2">Specialisté</p>
          <div className="flex flex-wrap gap-3">
            {team.map((member) => (
              <label key={member.id} className="flex items-center gap-1.5 font-body text-sm text-charcoal">
                <input
                  type="checkbox"
                  checked={workerIds.includes(member.id)}
                  onChange={(e) => setWorkerIds((ids) => e.target.checked ? [...ids, member.id] : ids.filter((i) => i !== member.id))}
                />
                {member.name}
              </label>
            ))}
          </div>
        </div>

        {!isNew && (
          <div className="border-t border-stone pt-5">
            <p className="font-body text-xs tracking-wide uppercase text-mauve mb-2">Fotky</p>
            <div className="flex flex-wrap gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative w-24 h-24 border border-stone overflow-hidden">
                  <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removePhoto(photo)} className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-ink/70 text-white text-xs leading-none flex items-center justify-center hover:bg-ink" aria-label="Odebrat fotku">×</button>
                </div>
              ))}
              <PhotoUploadField folder={`services/${id}`} value="" onChange={addPhoto} />
            </div>
          </div>
        )}
        {isNew && <p className="font-body text-xs text-frost italic">Fotky lze přidat po uložení služby.</p>}

        <div className="border-t border-stone pt-5 flex items-center justify-between">
          <label className="flex items-center gap-1.5 font-body text-sm text-charcoal">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            Zobrazeno na webu
          </label>
          {!isNew && (
            <button type="button" onClick={() => setConfirmDelete(true)} className="font-body text-xs text-red-600 hover:text-red-700">Smazat službu</button>
          )}
        </div>

        {error && <p className="font-body text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button type="submit" disabled={saving} className="font-body text-xs tracking-widest2 uppercase px-6 py-3 bg-mauve text-white hover:bg-mauve-deep transition-colors disabled:opacity-50">
            {saving ? 'Ukládání…' : 'Uložit'}
          </button>
        </div>
      </form>

      <ConfirmDialog
        open={confirmDelete}
        title="Smazat službu?"
        message="Tuto akci nelze vrátit zpět."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}
