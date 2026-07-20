import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { formatDateDisplay } from '../../utils/dateRules'
import ConfirmDialog from '../components/ConfirmDialog'

const STATUS_LABELS = { new: 'Nová', approved: 'Schváleno', done: 'Dokončeno' }
const STATUS_CLASSES = {
  new: 'bg-mauve/10 text-mauve-deep',
  approved: 'text-green-700',
  done: 'text-frost',
}

function pickCs(rows) {
  return rows.find((r) => r.lang === 'cs') ?? rows[0] ?? {}
}

function formatTime(t) {
  return t ? t.slice(0, 5) : ''
}

async function fetchTeamMembers() {
  const { data, error } = await supabase
    .from('team_members')
    .select('id, active, team_member_translations(lang, name)')
    .order('sort_order')
  if (error) throw error
  return data.map((m) => ({ id: m.id, active: m.active, name: pickCs(m.team_member_translations).name ?? '' }))
}

async function fetchReservations({ dateFrom, dateTo, status, teamMemberId }) {
  let query = supabase
    .from('reservations')
    .select(`
      id, reservation_date, starts_at, ends_at, status, source, was_auto_assigned,
      customer_name, customer_email, customer_phone, notes,
      team_member_id, team_members(team_member_translations(lang, name)),
      reservation_services(service_id, service_name_snapshot)
    `)
    .order('reservation_date', { ascending: false })
    .order('starts_at', { ascending: false })
  if (dateFrom) query = query.gte('reservation_date', dateFrom)
  if (dateTo) query = query.lte('reservation_date', dateTo)
  if (status) query = query.eq('status', status)
  if (teamMemberId) query = query.eq('team_member_id', teamMemberId)
  const { data, error } = await query
  if (error) throw error
  return data
}

export default function ReservationsListPage() {
  const [teamMembers, setTeamMembers] = useState([])
  const [reservations, setReservations] = useState(null)
  const [error, setError] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [filters, setFilters] = useState({ dateFrom: '', dateTo: '', status: '', teamMemberId: '' })

  useEffect(() => {
    fetchTeamMembers().then(setTeamMembers).catch((err) => setError(err.message))
  }, [])

  const load = useCallback(() => {
    fetchReservations(filters).then(setReservations).catch((err) => setError(err.message))
  }, [filters])

  useEffect(() => { load() }, [load])

  async function updateStatus(reservation, status) {
    const { error: updateErr } = await supabase.from('reservations').update({ status }).eq('id', reservation.id)
    if (updateErr) { setError(updateErr.message); return }
    load()
  }

  async function deleteReservation(reservation) {
    const { error: deleteErr } = await supabase.from('reservations').delete().eq('id', reservation.id)
    setPendingDelete(null)
    if (deleteErr) { setError(deleteErr.message); return }
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl text-ink">Rezervace</h1>
        <Link
          to="/admin/reservations/new"
          className="font-body text-xs tracking-widest uppercase text-mauve border border-mauve/40 rounded-full px-4 py-2 hover:bg-mauve hover:text-white transition-colors"
        >
          + Nová rezervace
        </Link>
      </div>

      <div className="bg-white border border-stone shadow-soft p-4 mb-4 flex flex-wrap items-end gap-4">
        <div>
          <label className="font-body text-[10px] tracking-widest uppercase text-mauve block mb-1">Od data</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
            className="border border-stone px-2 py-1.5 font-body text-sm focus:outline-none focus:border-mauve"
          />
        </div>
        <div>
          <label className="font-body text-[10px] tracking-widest uppercase text-mauve block mb-1">Do data</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
            className="border border-stone px-2 py-1.5 font-body text-sm focus:outline-none focus:border-mauve"
          />
        </div>
        <div>
          <label className="font-body text-[10px] tracking-widest uppercase text-mauve block mb-1">Stav</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="border border-stone px-2 py-1.5 font-body text-sm focus:outline-none focus:border-mauve"
          >
            <option value="">Vše</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-body text-[10px] tracking-widest uppercase text-mauve block mb-1">Specialista</label>
          <select
            value={filters.teamMemberId}
            onChange={(e) => setFilters((f) => ({ ...f, teamMemberId: e.target.value }))}
            className="border border-stone px-2 py-1.5 font-body text-sm focus:outline-none focus:border-mauve"
          >
            <option value="">Všichni</option>
            {teamMembers.map((m) => (
              <option key={m.id} value={m.id}>{m.name}{!m.active ? ' (neaktivní)' : ''}</option>
            ))}
          </select>
        </div>
        {(filters.dateFrom || filters.dateTo || filters.status || filters.teamMemberId) && (
          <button
            type="button"
            onClick={() => setFilters({ dateFrom: '', dateTo: '', status: '', teamMemberId: '' })}
            className="font-body text-xs text-warm hover:text-mauve"
          >
            Zrušit filtr
          </button>
        )}
      </div>

      {error && <p className="font-body text-sm text-red-600 mb-4">{error}</p>}

      {!reservations ? (
        <p className="font-body text-sm text-warm">Načítání…</p>
      ) : reservations.length === 0 ? (
        <p className="font-body text-sm text-frost italic">Žádné rezervace neodpovídají filtru.</p>
      ) : (
        <div className="bg-white border border-stone shadow-soft">
          {reservations.map((r) => {
            const specialistName = pickCs(r.team_members?.team_member_translations ?? []).name ?? '—'
            const services = r.reservation_services.map((s) => s.service_name_snapshot).join(', ')
            const contact = [r.customer_email, r.customer_phone].filter(Boolean).join(' · ')
            return (
              <div key={r.id} className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-stone last:border-b-0">
                <div className="w-32 flex-shrink-0">
                  <p className="font-body text-sm text-ink">{formatDateDisplay(r.reservation_date)}</p>
                  <p className="font-body text-xs text-warm">{formatTime(r.starts_at)}–{formatTime(r.ends_at)}</p>
                </div>
                <div className="flex-1 min-w-[180px]">
                  <p className="font-body text-sm text-ink">{r.customer_name}</p>
                  <p className="font-body text-xs text-warm truncate">{contact || '—'}</p>
                </div>
                <div className="flex-1 min-w-[180px]">
                  <p className="font-body text-sm text-charcoal truncate">{services || '—'}</p>
                  <p className="font-body text-xs text-warm">
                    {specialistName}
                    {r.was_auto_assigned && <span className="text-frost"> (automaticky)</span>}
                  </p>
                </div>
                <span className="font-body text-[10px] tracking-widest uppercase text-frost flex-shrink-0">
                  {r.source === 'admin' ? 'Admin' : 'Web'}
                </span>
                <select
                  value={r.status}
                  onChange={(e) => updateStatus(r, e.target.value)}
                  className={`font-body text-xs tracking-wide uppercase px-2 py-1.5 border border-stone flex-shrink-0 ${STATUS_CLASSES[r.status] ?? ''}`}
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <Link to={`/admin/reservations/${r.id}`} className="font-body text-xs text-mauve underline flex-shrink-0">Upravit</Link>
                <button type="button" onClick={() => setPendingDelete(r)} className="font-body text-xs text-red-600 hover:text-red-700 flex-shrink-0">Smazat</button>
              </div>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Smazat rezervaci?"
        message={`Opravdu chcete trvale smazat rezervaci pro "${pendingDelete?.customer_name ?? ''}"? Termín se tím uvolní pro nové rezervace.`}
        onConfirm={() => deleteReservation(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
