import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import PhotoUploadField from '../components/PhotoUploadField'
import ConfirmDialog from '../components/ConfirmDialog'

const LANGS = ['cs', 'en', 'uk']

function pickCs(rows) {
  return rows.find((r) => r.lang === 'cs') ?? {}
}

async function fetchTeam() {
  const { data, error } = await supabase
    .from('team_members')
    .select('id, photo_url, sort_order, active, team_member_translations(lang, name, role)')
    .order('sort_order')
  if (error) throw error
  return data
}

export default function TeamPage() {
  const [members, setMembers] = useState(null)
  const [error, setError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

  const load = useCallback(() => {
    fetchTeam().then(setMembers).catch((err) => setError(err.message))
  }, [])

  useEffect(() => { load() }, [load])

  if (error) return <p className="font-body text-sm text-red-600">{error}</p>
  if (!members) return <p className="font-body text-sm text-warm">Načítání…</p>

  async function toggleActive(member) {
    await supabase.from('team_members').update({ active: !member.active }).eq('id', member.id)
    load()
  }

  async function deleteMember(member) {
    const { error: deleteErr } = await supabase.from('team_members').delete().eq('id', member.id)
    setPendingDelete(null)
    if (deleteErr) {
      setDeleteError(
        deleteErr.code === '23503' ? 'Nelze smazat — existují rezervace, které tuto osobu využívají.' : deleteErr.message
      )
      return
    }
    setDeleteError('')
    load()
  }

  async function move(index, direction) {
    const otherIndex = index + direction
    if (otherIndex < 0 || otherIndex >= members.length) return
    const a = members[index]
    const b = members[otherIndex]
    await Promise.all([
      supabase.from('team_members').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('team_members').update({ sort_order: a.sort_order }).eq('id', b.id),
    ])
    load()
  }

  async function addMember() {
    const sortOrder = members.length
    const { data, error: insertErr } = await supabase.from('team_members').insert({ sort_order: sortOrder }).select('id').single()
    if (insertErr) { setError(insertErr.message); return }
    await supabase.from('team_member_translations').insert({ team_member_id: data.id, lang: 'cs', name: 'Nový člen týmu', role: '' })
    setEditingId(data.id)
    load()
  }

  async function setPhoto(member, url) {
    await supabase.from('team_members').update({ photo_url: url || null }).eq('id', member.id)
    load()
  }

  async function saveTranslations(memberId, byLang) {
    for (const lang of LANGS) {
      const name = byLang[lang]?.name?.trim()
      if (!name) continue
      await supabase.from('team_member_translations').upsert({
        team_member_id: memberId,
        lang,
        name,
        role: byLang[lang]?.role?.trim() || null,
      })
    }
    setEditingId(null)
    load()
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-ink mb-8">Tým</h1>
      {deleteError && <p className="font-body text-sm text-red-600 mb-4">{deleteError}</p>}

      <div className="bg-white border border-stone shadow-soft">
        {members.map((member, index) => {
          const ct = pickCs(member.team_member_translations)
          return (
            <div key={member.id} className={`border-b border-stone last:border-b-0 p-5 ${member.active ? '' : 'opacity-50'}`}>
              {editingId === member.id ? (
                <TeamMemberForm
                  translations={member.team_member_translations}
                  onSave={(titles) => saveTranslations(member.id, titles)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col flex-shrink-0">
                    <button type="button" onClick={() => move(index, -1)} className="text-warm hover:text-mauve leading-none text-xs" aria-label="Nahoru">▲</button>
                    <button type="button" onClick={() => move(index, 1)} className="text-warm hover:text-mauve leading-none text-xs" aria-label="Dolů">▼</button>
                  </div>
                  <div className="w-14 h-14 flex-shrink-0 border border-stone overflow-hidden bg-linen">
                    {member.photo_url && <img src={member.photo_url} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-base text-ink">{ct.name}{!member.active && <span className="ml-2 font-body text-[10px] uppercase text-frost">skryto</span>}</p>
                    <p className="font-body text-sm text-warm">{ct.role}</p>
                  </div>
                  <button type="button" onClick={() => setEditingId(member.id)} className="font-body text-xs text-mauve underline flex-shrink-0">Upravit</button>
                  <button type="button" onClick={() => toggleActive(member)} className="font-body text-xs text-warm hover:text-mauve flex-shrink-0">{member.active ? 'Skrýt' : 'Zobrazit'}</button>
                  <button type="button" onClick={() => setPendingDelete(member)} className="font-body text-xs text-red-600 hover:text-red-700 flex-shrink-0">Smazat</button>
                </div>
              )}
              {editingId === member.id && (
                <div className="mt-4">
                  <PhotoUploadField folder={`team/${member.id}`} value={member.photo_url ?? ''} onChange={(url) => setPhoto(member, url)} label="Fotka" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button type="button" onClick={addMember} className="font-body text-xs tracking-widest uppercase text-mauve hover:text-mauve-deep mt-4">
        + Přidat člena týmu
      </button>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Smazat člena týmu?"
        message={`Opravdu chcete trvale smazat "${pendingDelete ? pickCs(pendingDelete.team_member_translations).name : ''}"? Bude odebrán/a i ze všech přiřazených služeb.`}
        onConfirm={() => deleteMember(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}

function TeamMemberForm({ translations, onSave, onCancel }) {
  const byLangInit = Object.fromEntries(LANGS.map((lang) => {
    const t = translations.find((x) => x.lang === lang)
    return [lang, { name: t?.name ?? '', role: t?.role ?? '' }]
  }))
  const [byLang, setByLang] = useState(byLangInit)
  const [activeLang, setActiveLang] = useState('cs')

  return (
    <div>
      <div className="flex gap-2 mb-3">
        {LANGS.map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setActiveLang(lang)}
            className={`font-body text-xs tracking-widest uppercase px-3 py-1.5 rounded-full border ${activeLang === lang ? 'bg-mauve border-mauve text-white' : 'border-stone text-charcoal'}`}
          >
            {lang}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 max-w-md">
        <input
          value={byLang[activeLang].name}
          onChange={(e) => setByLang((s) => ({ ...s, [activeLang]: { ...s[activeLang], name: e.target.value } }))}
          placeholder="Jméno"
          className="border border-stone px-3 py-2 font-body text-sm focus:outline-none focus:border-mauve"
        />
        <input
          value={byLang[activeLang].role}
          onChange={(e) => setByLang((s) => ({ ...s, [activeLang]: { ...s[activeLang], role: e.target.value } }))}
          placeholder="Role"
          className="border border-stone px-3 py-2 font-body text-sm focus:outline-none focus:border-mauve"
        />
      </div>
      <div className="flex gap-3 mt-3">
        <button type="button" onClick={() => onSave(byLang)} className="font-body text-xs uppercase tracking-widest text-white bg-mauve px-4 py-2 hover:bg-mauve-deep">Uložit</button>
        <button type="button" onClick={onCancel} className="font-body text-xs text-warm">Zrušit</button>
      </div>
    </div>
  )
}
