import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { effectiveDurationMinutes } from '../../utils/cartCalculations'
import { addMinutesToTime, doTimesOverlap } from '../../utils/availability'
import ConfirmDialog from '../components/ConfirmDialog'

const STATUS_OPTIONS = [
  { value: 'new', label: 'Nová' },
  { value: 'approved', label: 'Schváleno' },
  { value: 'done', label: 'Dokončeno' },
]

const RPC_ERROR_MESSAGES = {
  slot_taken: 'Tento termín je pro daného specialistu již obsazený.',
  no_specialist_available: 'V danou dobu není volný žádný specialista.',
  specialist_unavailable: 'Zvolený specialista není aktivní.',
  invalid_services: 'Jedna nebo více vybraných služeb již neexistuje nebo je skrytá.',
  missing_name: 'Vyplňte jméno zákazníka.',
  missing_contact: 'Vyplňte email nebo telefon.',
  date_in_past: 'Zvolené datum už uplynulo.',
  time_in_past: 'Zvolený čas už dnes uplynul.',
  invalid_duration: 'Neplatná délka trvání.',
}

function pickCs(rows) {
  return rows.find((r) => r.lang === 'cs') ?? rows[0] ?? {}
}

export default function ReservationEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const [teamMembers, setTeamMembers] = useState([])
  const [services, setServices] = useState([])
  const [original, setOriginal] = useState(null)

  const [reservationDate, setReservationDate] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [serviceIds, setServiceIds] = useState([])
  const [teamMemberId, setTeamMemberId] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('approved')

  const [conflict, setConflict] = useState(null)

  useEffect(() => {
    async function load() {
      const [teamRes, servicesRes] = await Promise.all([
        supabase.from('team_members').select('id, active, team_member_translations(lang, name)').order('sort_order'),
        supabase.from('services').select('id, duration_min_minutes, service_translations(lang, name)').eq('active', true).order('sort_order'),
      ])
      if (teamRes.error || servicesRes.error) {
        setError((teamRes.error || servicesRes.error).message)
        setLoading(false)
        return
      }
      setTeamMembers(teamRes.data.map((m) => ({ id: m.id, active: m.active, name: pickCs(m.team_member_translations).name ?? '' })))
      setServices(servicesRes.data.map((s) => ({ id: s.id, name: pickCs(s.service_translations).name ?? s.id, duration_min_minutes: s.duration_min_minutes })))

      if (!isNew) {
        const { data: res, error: resErr } = await supabase
          .from('reservations')
          .select(`
            id, reservation_date, starts_at, ends_at, team_member_id, status,
            customer_name, customer_email, customer_phone, notes,
            reservation_services(service_id)
          `)
          .eq('id', id)
          .single()
        if (resErr) { setError(resErr.message); setLoading(false); return }
        setOriginal(res)
        setReservationDate(res.reservation_date)
        setStartsAt(res.starts_at.slice(0, 5))
        setTeamMemberId(res.team_member_id ?? '')
        setStatus(res.status)
        setCustomerName(res.customer_name ?? '')
        setCustomerEmail(res.customer_email ?? '')
        setCustomerPhone(res.customer_phone ?? '')
        setNotes(res.notes ?? '')
        setServiceIds(res.reservation_services.map((rs) => rs.service_id))
      }
      setLoading(false)
    }
    load()
  }, [id, isNew])

  const selectedServices = services.filter((s) => serviceIds.includes(s.id))
  const durationMinutes = effectiveDurationMinutes(selectedServices)
  const visibleTeamMembers = teamMembers.filter((m) => m.active || (!isNew && m.id === original?.team_member_id))

  useEffect(() => {
    if (!reservationDate || !teamMemberId || !startsAt || serviceIds.length === 0) {
      setConflict(null)
      return
    }
    let cancelled = false
    const endsAt = addMinutesToTime(startsAt, durationMinutes)
    supabase.rpc('get_booked_ranges', { p_date: reservationDate }).then(({ data, error: rpcErr }) => {
      if (cancelled || rpcErr || !data) return
      const hit = data.find((row) => {
        if (row.team_member_id !== teamMemberId) return false
        const rowStart = row.starts_at.slice(0, 5)
        const rowEnd = row.ends_at.slice(0, 5)
        const isOwnRow =
          !isNew &&
          original &&
          original.reservation_date === reservationDate &&
          original.team_member_id === teamMemberId &&
          rowStart === original.starts_at.slice(0, 5) &&
          rowEnd === original.ends_at.slice(0, 5)
        if (isOwnRow) return false
        return doTimesOverlap(startsAt, endsAt, rowStart, rowEnd)
      })
      setConflict(hit ? { starts: hit.starts_at.slice(0, 5), ends: hit.ends_at.slice(0, 5) } : null)
    })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationDate, teamMemberId, startsAt, serviceIds, durationMinutes, isNew, original])

  function toggleService(serviceId) {
    setServiceIds((ids) => (ids.includes(serviceId) ? ids.filter((i) => i !== serviceId) : [...ids, serviceId]))
  }

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    if (!reservationDate || !startsAt) { setError('Vyplňte datum a čas.'); return }
    if (serviceIds.length === 0) { setError('Vyberte alespoň jednu službu.'); return }
    if (!customerName.trim()) { setError('Vyplňte jméno zákazníka.'); return }
    if (!customerEmail.trim() && !customerPhone.trim()) { setError('Vyplňte email nebo telefon.'); return }

    setSaving(true)
    try {
      if (isNew) {
        const { data, error: rpcErr } = await supabase.rpc('admin_create_reservation', {
          p_date: reservationDate,
          p_starts_at: startsAt,
          p_service_ids: serviceIds,
          p_team_member_id: teamMemberId || null,
          p_customer_name: customerName.trim(),
          p_customer_email: customerEmail.trim() || null,
          p_customer_phone: customerPhone.trim() || null,
          p_notes: notes.trim() || null,
          p_status: status,
        })
        if (rpcErr) throw rpcErr
        if (data.status !== 'ok') {
          setError(RPC_ERROR_MESSAGES[data.code] || 'Rezervaci se nepodařilo vytvořit.')
          setSaving(false)
          return
        }
      } else {
        const endsAt = addMinutesToTime(startsAt, durationMinutes)
        const { error: updateErr } = await supabase
          .from('reservations')
          .update({
            reservation_date: reservationDate,
            starts_at: startsAt,
            ends_at: endsAt,
            team_member_id: teamMemberId,
            customer_name: customerName.trim(),
            customer_email: customerEmail.trim() || null,
            customer_phone: customerPhone.trim() || null,
            notes: notes.trim() || null,
            status,
          })
          .eq('id', id)
        if (updateErr) {
          setError(updateErr.code === '23P01' ? 'Tento termín je pro daného specialistu již obsazený.' : updateErr.message)
          setSaving(false)
          return
        }
        await supabase.from('reservation_services').delete().eq('reservation_id', id)
        await supabase.from('reservation_services').insert(
          serviceIds.map((serviceId) => ({
            reservation_id: id,
            service_id: serviceId,
            service_name_snapshot: services.find((s) => s.id === serviceId)?.name ?? serviceId,
          }))
        )
      }
      navigate('/admin/reservations')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    await supabase.from('reservations').delete().eq('id', id)
    navigate('/admin/reservations')
  }

  if (loading) return <p className="font-body text-sm text-warm">Načítání…</p>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl text-ink">{isNew ? 'Nová rezervace' : 'Upravit rezervaci'}</h1>
        <Link to="/admin/reservations" className="font-body text-sm text-warm hover:text-mauve">← Zpět na seznam</Link>
      </div>

      <form onSubmit={handleSave} className="space-y-6 bg-white border border-stone shadow-soft p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-xs tracking-wide uppercase text-mauve">Datum</label>
            <input
              type="date"
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
              className="w-full border border-stone px-3 py-2 font-body text-sm mt-1 focus:outline-none focus:border-mauve"
            />
          </div>
          <div>
            <label className="font-body text-xs tracking-wide uppercase text-mauve">Čas</label>
            <input
              type="time"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className="w-full border border-stone px-3 py-2 font-body text-sm mt-1 focus:outline-none focus:border-mauve"
            />
          </div>
        </div>

        <div>
          <label className="font-body text-xs tracking-wide uppercase text-mauve">Specialista</label>
          <select
            value={teamMemberId}
            onChange={(e) => setTeamMemberId(e.target.value)}
            className="w-full border border-stone px-3 py-2 font-body text-sm mt-1 focus:outline-none focus:border-mauve"
          >
            {isNew && <option value="">Automaticky přiřadit</option>}
            {visibleTeamMembers.map((m) => (
              <option key={m.id} value={m.id}>{m.name}{!m.active ? ' (neaktivní)' : ''}</option>
            ))}
          </select>
        </div>

        {conflict && (
          <p className="font-body text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2">
            Tento specialista má v tuto dobu jinou rezervaci ({conflict.starts}–{conflict.ends}). Uložení může selhat.
          </p>
        )}

        <div>
          <label className="font-body text-xs tracking-wide uppercase text-mauve mb-2 block">Služby</label>
          <div className="max-h-56 overflow-y-auto border border-stone p-3 flex flex-col gap-1.5">
            {services.map((s) => (
              <label key={s.id} className="flex items-center gap-1.5 font-body text-sm text-charcoal">
                <input type="checkbox" checked={serviceIds.includes(s.id)} onChange={() => toggleService(s.id)} />
                {s.name}
              </label>
            ))}
          </div>
          <p className="font-body text-xs text-warm mt-2">Odhad délky: {durationMinutes > 0 ? `${durationMinutes} min` : '—'}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-body text-xs tracking-wide uppercase text-mauve">Jméno zákazníka</label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border border-stone px-3 py-2 font-body text-sm mt-1 focus:outline-none focus:border-mauve"
            />
          </div>
          <div>
            <label className="font-body text-xs tracking-wide uppercase text-mauve">Email</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full border border-stone px-3 py-2 font-body text-sm mt-1 focus:outline-none focus:border-mauve"
            />
          </div>
        </div>
        <div className="sm:w-1/2 sm:pr-2">
          <label className="font-body text-xs tracking-wide uppercase text-mauve">Telefon</label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full border border-stone px-3 py-2 font-body text-sm mt-1 focus:outline-none focus:border-mauve"
          />
        </div>
        <div>
          <label className="font-body text-xs tracking-wide uppercase text-mauve">Poznámka</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full border border-stone px-3 py-2 font-body text-sm mt-1 focus:outline-none focus:border-mauve"
          />
        </div>

        <div>
          <label className="font-body text-xs tracking-wide uppercase text-mauve">Stav</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-stone px-3 py-2 font-body text-sm mt-1 focus:outline-none focus:border-mauve"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {!isNew && (
          <div className="border-t border-stone pt-5">
            <button type="button" onClick={() => setConfirmDelete(true)} className="font-body text-xs text-red-600 hover:text-red-700">
              Smazat rezervaci
            </button>
          </div>
        )}

        {error && <p className="font-body text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button type="submit" disabled={saving} className="font-body text-xs tracking-widest2 uppercase px-6 py-3 bg-mauve text-white hover:bg-mauve-deep transition-colors disabled:opacity-50">
            {saving ? 'Ukládání…' : 'Uložit'}
          </button>
        </div>
      </form>

      <ConfirmDialog
        open={confirmDelete}
        title="Smazat rezervaci?"
        message="Termín se tím uvolní pro nové rezervace. Tuto akci nelze vrátit zpět."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}
