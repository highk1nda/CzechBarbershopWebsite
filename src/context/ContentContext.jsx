import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabaseClient'
import { formatItemPrice, formatItemDuration } from '../utils/priceDuration'
import i18n, { SUPPORTED_LANGUAGES } from '../i18n'

const ContentContext = createContext(null)

function pickTranslation(rows, lang) {
  if (!rows || rows.length === 0) return {}
  return rows.find((r) => r.lang === lang) ?? rows.find((r) => r.lang === 'cs') ?? rows[0]
}

// Turns dot-path rows like { key: 'highlights.items.0.label', value: '...' }
// back into the nested object shape i18next expects.
function unflatten(rows) {
  const root = {}
  for (const { key, value } of rows) {
    const parts = key.split('.')
    let node = root
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      const nextIsIndex = /^\d+$/.test(parts[i + 1])
      if (node[part] === undefined) node[part] = nextIsIndex ? [] : {}
      node = node[part]
    }
    node[parts[parts.length - 1]] = value
  }
  return root
}

async function fetchAll() {
  const [teamRes, tabsRes, servicesRes, addonsRes, settingsRes, contentRes] = await Promise.all([
    supabase
      .from('team_members')
      .select('id, photo_url, sort_order, team_member_translations(lang, name, role)')
      .eq('active', true)
      .order('sort_order'),
    supabase
      .from('tabs')
      .select(`
        id, icon, sort_order,
        tab_translations(lang, label, heading, description, note),
        categories(id, sort_order, category_translations(lang, title))
      `)
      .eq('active', true)
      .order('sort_order')
      .order('sort_order', { referencedTable: 'categories' }),
    supabase
      .from('services')
      .select(`
        id, icon, category_id,
        price_min, price_max, price_open_ended, price_unknown,
        duration_min_minutes, duration_max_minutes, duration_up_to,
        sort_order,
        service_translations(lang, name, description, details_text, details_steps),
        service_photos(url, sort_order),
        service_workers(team_member_id)
      `)
      .eq('active', true)
      .order('sort_order'),
    supabase.from('recommended_addons').select('category_id, service_id, sort_order').order('sort_order'),
    supabase.from('site_settings').select('key, value'),
    supabase.from('site_content').select('key, lang, value'),
  ])

  for (const res of [teamRes, tabsRes, servicesRes, addonsRes, settingsRes, contentRes]) {
    if (res.error) throw res.error
  }

  return {
    teamRows: teamRes.data,
    tabRows: tabsRes.data,
    serviceRows: servicesRes.data,
    addonRows: addonsRes.data,
    settingsRows: settingsRes.data,
    contentRows: contentRes.data,
  }
}

// Rebuilds the same SERVICES / ALL_ITEMS / ITEMS_BY_ID / team shapes the old
// static src/data/*.js files used to export, so most consuming components
// only need to change their import source, not their rendering logic.
function buildContent(raw, lang) {
  const { teamRows, tabRows, serviceRows, addonRows, settingsRows } = raw

  const teamById = {}
  const team = teamRows.map((row) => {
    const t = pickTranslation(row.team_member_translations, lang)
    const member = { id: row.id, name: t.name ?? '', role: t.role ?? '', photo: row.photo_url }
    teamById[row.id] = member
    return member
  })

  const servicesByCategory = {}
  for (const row of serviceRows) {
    const t = pickTranslation(row.service_translations, lang)
    const photos = (row.service_photos ?? []).slice().sort((a, b) => a.sort_order - b.sort_order).map((p) => p.url)
    const hasDetails = Boolean(t.details_text) || (t.details_steps?.length ?? 0) > 0 || photos.length > 0

    const item = {
      id: row.id,
      icon: row.icon,
      name: t.name ?? '',
      desc: t.description ?? null,
      price_min: row.price_min,
      price_max: row.price_max,
      price_open_ended: row.price_open_ended,
      price_unknown: row.price_unknown,
      duration_min_minutes: row.duration_min_minutes,
      duration_max_minutes: row.duration_max_minutes,
      duration_up_to: row.duration_up_to,
      price: formatItemPrice(row),
      duration: formatItemDuration(row),
      workers: (row.service_workers ?? []).map((w) => teamById[w.team_member_id]?.name).filter(Boolean),
      workerIds: (row.service_workers ?? []).map((w) => w.team_member_id),
      details: hasDetails ? { text: t.details_text ?? '', steps: t.details_steps ?? undefined, photos } : undefined,
      categoryId: row.category_id,
    }
    ;(servicesByCategory[row.category_id] ??= []).push(item)
  }

  const SERVICES = tabRows.map((tabRow) => {
    const tt = pickTranslation(tabRow.tab_translations, lang)
    const categories = (tabRow.categories ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((catRow) => {
        const ct = pickTranslation(catRow.category_translations, lang)
        return { id: catRow.id, title: ct.title ?? '', items: servicesByCategory[catRow.id] ?? [] }
      })
    return {
      id: tabRow.id,
      label: tt.label ?? '',
      heading: tt.heading ?? '',
      description: tt.description ?? '',
      icon: tabRow.icon,
      note: tt.note ?? null,
      categories,
    }
  })

  const ALL_ITEMS = SERVICES.flatMap((tab) =>
    tab.categories.flatMap((cat) => cat.items.map((item) => ({ ...item, tabId: tab.id, tabLabel: tab.label, categoryTitle: cat.title })))
  )
  const ITEMS_BY_ID = Object.fromEntries(ALL_ITEMS.map((item) => [item.id, item]))

  const addOns = {}
  for (const row of addonRows) {
    ;(addOns[row.category_id] ??= []).push(row.service_id)
  }

  const settings = Object.fromEntries(settingsRows.map((row) => [row.key, row.value]))

  return { team, SERVICES, ALL_ITEMS, ITEMS_BY_ID, addOns, settings }
}

export function ContentProvider({ children }) {
  const [raw, setRaw] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAll()
      setRaw(data)

      for (const lang of SUPPORTED_LANGUAGES) {
        const rows = data.contentRows.filter((r) => r.lang === lang)
        i18n.addResourceBundle(lang, 'translation', unflatten(rows), true, true)
      }
      // addResourceBundle updates the store silently — react-i18next's useTranslation
      // only re-renders on this event, so emit it manually to pick up fresh content.
      i18n.emit('languageChanged', i18n.language)
    } catch (err) {
      console.error('Failed to load site content from Supabase:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const { i18n: i18nInstance } = useTranslation()
  const lang = i18nInstance.language

  const built = useMemo(() => {
    if (!raw) return { team: [], SERVICES: [], ALL_ITEMS: [], ITEMS_BY_ID: {}, addOns: {}, settings: {} }
    return buildContent(raw, lang)
  }, [raw, lang])

  const value = useMemo(
    () => ({ ...built, loading, error, refetch: load }),
    [built, loading, error, load]
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within a ContentProvider')
  return ctx
}
