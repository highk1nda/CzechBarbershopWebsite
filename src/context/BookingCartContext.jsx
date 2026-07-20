import { createContext, useContext, useReducer, useMemo, useCallback } from 'react'
import emailjs from '@emailjs/browser'
import { useContent } from './ContentContext'
import { supabase } from '../lib/supabaseClient'
import { aggregateCart } from '../utils/cartCalculations'
import { buildEmailParams, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY } from '../utils/emailParams'

const BookingCartContext = createContext(null)

function readStoredStylist() {
  try {
    return sessionStorage.getItem('preferredStylistId') || ''
  } catch {
    return ''
  }
}

const initialState = {
  step: 1, // 1 Services | 2 Appointment | 3 Details | 4 Confirmation
  detailsPhase: 'form', // 'form' | 'review'
  cart: new Set(),
  appointment: { date: '', time: '', stylist: readStoredStylist(), notes: '' },
  dateError: '',
  details: { name: '', email: '', phone: '', message: '' },
  status: 'idle', // idle | sending | sent | error
  submitError: null, // null | 'slot_taken' | 'no_specialist_available' | ...other RPC codes | 'unexpected'
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      if (state.cart.has(action.id)) return state
      const cart = new Set(state.cart)
      cart.add(action.id)
      return { ...state, cart }
    }
    case 'REMOVE_ITEM': {
      if (!state.cart.has(action.id)) return state
      const cart = new Set(state.cart)
      cart.delete(action.id)
      return { ...state, cart }
    }
    case 'TOGGLE_ITEM': {
      const cart = new Set(state.cart)
      if (cart.has(action.id)) cart.delete(action.id)
      else cart.add(action.id)
      return { ...state, cart }
    }
    case 'SET_STEP':
      return { ...state, step: action.step }
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, 4) }
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 1) }
    case 'SET_DETAILS_PHASE':
      return { ...state, detailsPhase: action.phase }
    case 'SET_APPOINTMENT_FIELD':
      return { ...state, appointment: { ...state.appointment, [action.field]: action.value } }
    case 'SET_DATE_ERROR':
      return { ...state, dateError: action.message }
    case 'SET_DETAILS_FIELD':
      return { ...state, details: { ...state.details, [action.field]: action.value } }
    case 'SET_STATUS':
      return { ...state, status: action.status }
    case 'SET_SUBMIT_ERROR':
      return { ...state, submitError: action.error }
    case 'RESET':
      return {
        ...initialState,
        cart: new Set(),
        appointment: { date: '', time: '', stylist: '', notes: '' },
      }
    default:
      return state
  }
}

export function BookingCartProvider({ children }) {
  const { ITEMS_BY_ID, team } = useContent()
  const [state, dispatch] = useReducer(reducer, initialState)

  const addItem = useCallback((id) => dispatch({ type: 'ADD_ITEM', id }), [])
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE_ITEM', id }), [])
  const toggleItem = useCallback((id) => dispatch({ type: 'TOGGLE_ITEM', id }), [])

  const goToStep = useCallback((step) => dispatch({ type: 'SET_STEP', step }), [])
  const nextStep = useCallback(() => dispatch({ type: 'NEXT_STEP' }), [])
  const prevStep = useCallback(() => dispatch({ type: 'PREV_STEP' }), [])
  const setDetailsPhase = useCallback((phase) => dispatch({ type: 'SET_DETAILS_PHASE', phase }), [])

  const setAppointmentField = useCallback(
    (field, value) => dispatch({ type: 'SET_APPOINTMENT_FIELD', field, value }),
    []
  )
  const setDateError = useCallback((message) => dispatch({ type: 'SET_DATE_ERROR', message }), [])
  const setStylist = useCallback((teamMemberId) => {
    dispatch({ type: 'SET_APPOINTMENT_FIELD', field: 'stylist', value: teamMemberId })
    try {
      sessionStorage.setItem('preferredStylistId', teamMemberId)
    } catch {
      /* sessionStorage unavailable — stylist stays in memory only */
    }
  }, [])

  const setDetailsField = useCallback((field, value) => dispatch({ type: 'SET_DETAILS_FIELD', field, value }), [])
  const setStatus = useCallback((status) => dispatch({ type: 'SET_STATUS', status }), [])

  const cartItemsForSubmit = useMemo(
    () => Array.from(state.cart).map((id) => ITEMS_BY_ID[id]).filter(Boolean),
    [state.cart, ITEMS_BY_ID]
  )

  const submitBooking = useCallback(async () => {
    dispatch({ type: 'SET_STATUS', status: 'sending' })
    dispatch({ type: 'SET_SUBMIT_ERROR', error: null })

    const combinedNotes = [state.appointment.notes, state.details.message].filter(Boolean).join('\n\n')

    const { data, error: rpcError } = await supabase.rpc('create_reservation', {
      p_date: state.appointment.date,
      p_starts_at: state.appointment.time,
      p_service_ids: Array.from(state.cart),
      p_team_member_id: state.appointment.stylist || null,
      p_customer_name: state.details.name,
      p_customer_email: state.details.email || null,
      p_customer_phone: state.details.phone || null,
      p_notes: combinedNotes || null,
    })

    if (rpcError || data.status !== 'ok') {
      console.error('create_reservation failed:', rpcError || data)
      dispatch({ type: 'SET_STATUS', status: 'error' })
      dispatch({ type: 'SET_SUBMIT_ERROR', error: rpcError ? 'unexpected' : data.code })
      return
    }

    // Reservation is already the source of truth at this point — EmailJS is
    // just a best-effort heads-up, so its failure must never block or scare
    // the customer after the DB write already succeeded.
    const assignedMember = team.find((m) => m.id === data.team_member_id)
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        buildEmailParams({
          items: cartItemsForSubmit,
          date: state.appointment.date,
          time: state.appointment.time,
          name: state.details.name,
          email: state.details.email,
          phone: state.details.phone,
          message: combinedNotes,
          preferredPerson: assignedMember
            ? `${assignedMember.name}${data.was_auto_assigned ? ' (automaticky přiřazeno)' : ''}`
            : '—',
        }),
        EMAILJS_PUBLIC_KEY
      )
    } catch (emailErr) {
      console.error('EmailJS notification failed (reservation already saved):', emailErr)
    }

    dispatch({ type: 'SET_STATUS', status: 'sent' })
    dispatch({ type: 'SET_STEP', step: 4 })
  }, [cartItemsForSubmit, state.cart, state.appointment, state.details, team])

  const reset = useCallback(() => {
    try {
      sessionStorage.removeItem('preferredStylistId')
    } catch {
      /* ignore */
    }
    dispatch({ type: 'RESET' })
  }, [])

  const cartItems = useMemo(
    () => Array.from(state.cart).map((id) => ITEMS_BY_ID[id]).filter(Boolean),
    [state.cart, ITEMS_BY_ID]
  )
  const cartCount = cartItems.length
  const { price: priceEstimate, duration: durationEstimate } = useMemo(
    () => aggregateCart(cartItems),
    [cartItems]
  )

  const canSubmit =
    cartCount > 0 &&
    Boolean(state.appointment.date) &&
    Boolean(state.appointment.time) &&
    state.details.name.trim().length > 0 &&
    (state.details.email.trim().length > 0 || state.details.phone.trim().length > 0) &&
    state.status !== 'sending'

  const value = useMemo(
    () => ({
      state,
      cartItems,
      cartCount,
      priceEstimate,
      durationEstimate,
      canSubmit,
      addItem,
      removeItem,
      toggleItem,
      goToStep,
      nextStep,
      prevStep,
      setDetailsPhase,
      setAppointmentField,
      setDateError,
      setStylist,
      setDetailsField,
      setStatus,
      submitBooking,
      reset,
    }),
    [
      state,
      cartItems,
      cartCount,
      priceEstimate,
      durationEstimate,
      canSubmit,
      addItem,
      removeItem,
      toggleItem,
      goToStep,
      nextStep,
      prevStep,
      setDetailsPhase,
      setAppointmentField,
      setDateError,
      setStylist,
      setDetailsField,
      setStatus,
      submitBooking,
      reset,
    ]
  )

  return <BookingCartContext.Provider value={value}>{children}</BookingCartContext.Provider>
}

export function useBookingCart() {
  const ctx = useContext(BookingCartContext)
  if (!ctx) throw new Error('useBookingCart must be used within a BookingCartProvider')
  return ctx
}
