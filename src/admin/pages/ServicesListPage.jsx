import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { formatItemPrice } from '../../utils/priceDuration'
import ConfirmDialog from '../components/ConfirmDialog'

function pickCs(rows) {
  return rows.find((r) => r.lang === 'cs') ?? rows[0] ?? {}
}

async function fetchAdmin() {
  const [tabsRes, categoriesRes, servicesRes] = await Promise.all([
    supabase.from('tabs').select('id, sort_order, tab_translations(lang, label)').order('sort_order'),
    supabase.from('categories').select('id, tab_id, sort_order, category_translations(lang, title)').order('sort_order'),
    supabase
      .from('services')
      .select('id, icon, category_id, active, sort_order, price_min, price_max, price_open_ended, price_unknown, service_translations(lang, name)')
      .order('sort_order'),
  ])
  for (const res of [tabsRes, categoriesRes, servicesRes]) if (res.error) throw res.error
  return { tabs: tabsRes.data, categories: categoriesRes.data, services: servicesRes.data }
}

export default function ServicesListPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [newCategoryTab, setNewCategoryTab] = useState(null)
  const [newCategoryTitle, setNewCategoryTitle] = useState('')
  const [editingCategory, setEditingCategory] = useState(null)

  const load = useCallback(() => {
    fetchAdmin().then(setData).catch((err) => setError(err.message))
  }, [])

  useEffect(() => { load() }, [load])

  if (error) return <p className="font-body text-sm text-red-600">{error}</p>
  if (!data) return <p className="font-body text-sm text-warm">Načítání…</p>

  const { tabs, categories, services } = data

  async function toggleActive(service) {
    await supabase.from('services').update({ active: !service.active }).eq('id', service.id)
    load()
  }

  async function deleteService(service) {
    const { error: deleteErr } = await supabase.from('services').delete().eq('id', service.id)
    setPendingDelete(null)
    if (deleteErr) {
      setDeleteError(
        deleteErr.code === '23503' ? 'Nelze smazat — existují rezervace, které tuto službu využívají.' : deleteErr.message
      )
      return
    }
    setDeleteError('')
    load()
  }

  async function move(list, index, direction, table) {
    const otherIndex = index + direction
    if (otherIndex < 0 || otherIndex >= list.length) return
    const a = list[index]
    const b = list[otherIndex]
    await Promise.all([
      supabase.from(table).update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from(table).update({ sort_order: a.sort_order }).eq('id', b.id),
    ])
    load()
  }

  async function addCategory(tabId) {
    const title = newCategoryTitle.trim()
    if (!title) return
    const siblings = categories.filter((c) => c.tab_id === tabId)
    const sortOrder = siblings.length
    const { data: catRow, error: catErr } = await supabase.from('categories').insert({ tab_id: tabId, sort_order: sortOrder }).select('id').single()
    if (catErr) { setError(catErr.message); return }
    await supabase.from('category_translations').insert({ category_id: catRow.id, lang: 'cs', title })
    setNewCategoryTab(null)
    setNewCategoryTitle('')
    load()
  }

  async function saveCategoryTitles(categoryId, titlesByLang) {
    for (const lang of ['cs', 'en', 'uk']) {
      const title = titlesByLang[lang]?.trim()
      if (!title) continue
      await supabase.from('category_translations').upsert({ category_id: categoryId, lang, title })
    }
    setEditingCategory(null)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl text-ink">Služby</h1>
      </div>
      {deleteError && <p className="font-body text-sm text-red-600 mb-4">{deleteError}</p>}

      {tabs.map((tab) => {
        const tabCategories = categories.filter((c) => c.tab_id === tab.id).sort((a, b) => a.sort_order - b.sort_order)
        return (
          <section key={tab.id} className="mb-10">
            <h2 className="font-heading text-xl text-mauve-deep mb-4">{pickCs(tab.tab_translations).label}</h2>

            {tabCategories.map((category, catIndex) => {
              const categoryServices = services
                .filter((s) => s.category_id === category.id)
                .sort((a, b) => a.sort_order - b.sort_order)
              const ct = pickCs(category.category_translations)

              return (
                <div key={category.id} className="bg-white border border-stone shadow-soft mb-4">
                  <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-stone">
                    {editingCategory === category.id ? (
                      <CategoryTitleForm
                        translations={category.category_translations}
                        onSave={(titles) => saveCategoryTitles(category.id, titles)}
                        onCancel={() => setEditingCategory(null)}
                      />
                    ) : (
                      <button type="button" onClick={() => setEditingCategory(category.id)} className="font-heading text-base text-ink hover:text-mauve transition-colors text-left">
                        {ct.title}
                      </button>
                    )}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button type="button" onClick={() => move(tabCategories, catIndex, -1, 'categories')} className="text-warm hover:text-mauve px-1" aria-label="Posunout kategorii nahoru">↑</button>
                      <button type="button" onClick={() => move(tabCategories, catIndex, 1, 'categories')} className="text-warm hover:text-mauve px-1" aria-label="Posunout kategorii dolů">↓</button>
                      <Link
                        to={`/admin/services/new?category=${category.id}`}
                        className="font-body text-[10px] tracking-widest uppercase text-mauve border border-mauve/40 rounded-full px-3 py-1.5 hover:bg-mauve hover:text-white transition-colors whitespace-nowrap"
                      >
                        + Přidat službu
                      </Link>
                    </div>
                  </div>

                  <ul>
                    {categoryServices.map((service, sIndex) => {
                      const st = pickCs(service.service_translations)
                      return (
                        <li key={service.id} className={`flex items-center gap-3 px-5 py-3 border-b border-stone last:border-b-0 ${service.active ? '' : 'opacity-50'}`}>
                          <div className="flex flex-col">
                            <button type="button" onClick={() => move(categoryServices, sIndex, -1, 'services')} className="text-warm hover:text-mauve leading-none text-xs" aria-label="Nahoru">▲</button>
                            <button type="button" onClick={() => move(categoryServices, sIndex, 1, 'services')} className="text-warm hover:text-mauve leading-none text-xs" aria-label="Dolů">▼</button>
                          </div>
                          <span className="font-body text-sm text-ink flex-1 truncate">
                            {st.name || <em className="text-frost">(bez názvu)</em>}
                            {!service.active && <span className="ml-2 font-body text-[10px] uppercase text-frost">skryto</span>}
                          </span>
                          <span className="font-body text-sm text-mauve-deep tabular-nums flex-shrink-0">{formatItemPrice(service)}</span>
                          <Link to={`/admin/services/${service.id}`} className="font-body text-xs text-mauve underline flex-shrink-0">Upravit</Link>
                          <button type="button" onClick={() => toggleActive(service)} className="font-body text-xs text-warm hover:text-mauve flex-shrink-0">
                            {service.active ? 'Skrýt' : 'Zobrazit'}
                          </button>
                          <button type="button" onClick={() => setPendingDelete(service)} className="font-body text-xs text-red-600 hover:text-red-700 flex-shrink-0">Smazat</button>
                        </li>
                      )
                    })}
                    {categoryServices.length === 0 && (
                      <li className="px-5 py-3 font-body text-sm text-frost italic">Žádné služby v této kategorii.</li>
                    )}
                  </ul>
                </div>
              )
            })}

            {newCategoryTab === tab.id ? (
              <div className="flex items-center gap-2 mt-2">
                <input
                  autoFocus
                  value={newCategoryTitle}
                  onChange={(e) => setNewCategoryTitle(e.target.value)}
                  placeholder="Název kategorie"
                  className="border border-stone px-3 py-2 font-body text-sm flex-1 max-w-xs focus:outline-none focus:border-mauve"
                />
                <button type="button" onClick={() => addCategory(tab.id)} className="font-body text-xs uppercase tracking-widest text-white bg-mauve px-4 py-2 hover:bg-mauve-deep">Uložit</button>
                <button type="button" onClick={() => { setNewCategoryTab(null); setNewCategoryTitle('') }} className="font-body text-xs text-warm">Zrušit</button>
              </div>
            ) : (
              <button type="button" onClick={() => setNewCategoryTab(tab.id)} className="font-body text-xs tracking-widest uppercase text-mauve hover:text-mauve-deep mt-1">
                + Přidat kategorii
              </button>
            )}
          </section>
        )
      })}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Smazat službu?"
        message={`Opravdu chcete trvale smazat "${pendingDelete ? pickCs(pendingDelete.service_translations).name : ''}"? Tuto akci nelze vrátit zpět.`}
        onConfirm={() => deleteService(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}

function CategoryTitleForm({ translations, onSave, onCancel }) {
  const byLang = Object.fromEntries(translations.map((t) => [t.lang, t.title]))
  const [titles, setTitles] = useState({ cs: byLang.cs ?? '', en: byLang.en ?? '', uk: byLang.uk ?? '' })

  return (
    <div className="flex flex-wrap items-center gap-2">
      {['cs', 'en', 'uk'].map((lang) => (
        <input
          key={lang}
          value={titles[lang]}
          onChange={(e) => setTitles((t) => ({ ...t, [lang]: e.target.value }))}
          placeholder={lang.toUpperCase()}
          className="border border-stone px-2 py-1.5 font-body text-sm w-32 focus:outline-none focus:border-mauve"
        />
      ))}
      <button type="button" onClick={() => onSave(titles)} className="font-body text-xs uppercase tracking-widest text-white bg-mauve px-3 py-1.5 hover:bg-mauve-deep">Uložit</button>
      <button type="button" onClick={onCancel} className="font-body text-xs text-warm">Zrušit</button>
    </div>
  )
}
