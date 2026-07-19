import { createContext, useContext, useReducer, useMemo, useCallback } from 'react'
import emailjs from '@emailjs/browser'
import { ITEMS_BY_ID } from '../data/services'
import { aggregateCart } from '../utils/cartCalculations'
import { buildEmailParams, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY } from '../utils/emailParams'

const BookingCartContext = createContext(null)

function readStoredStylist() {
  try {
    return sessionStorage.getItem('preferredPerson') || ''
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
  const setStylist = useCallback((name) => {
    dispatch({ type: 'SET_APPOINTMENT_FIELD', field: 'stylist', value: name })
    try {
      sessionStorage.setItem('preferredPerson', name)
    } catch {
      /* sessionStorage unavailable — stylist stays in memory only */
    }
  }, [])

  const setDetailsField = useCallback((field, value) => dispatch({ type: 'SET_DETAILS_FIELD', field, value }), [])
  const setStatus = useCallback((status) => dispatch({ type: 'SET_STATUS', status }), [])

  const cartItemsForSubmit = useMemo(
    () => Array.from(state.cart).map((id) => ITEMS_BY_ID[id]).filter(Boolean),
    [state.cart]
  )

  const submitBooking = useCallback(async () => {
    dispatch({ type: 'SET_STATUS', status: 'sending' })
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
          message: state.details.message,
          preferredPerson: state.appointment.stylist,
        }),
        EMAILJS_PUBLIC_KEY
      )
      dispatch({ type: 'SET_STATUS', status: 'sent' })
      dispatch({ type: 'SET_STEP', step: 4 })
    } catch (err) {
      console.error('EmailJS error:', err)
      dispatch({ type: 'SET_STATUS', status: 'error' })
    }
  }, [cartItemsForSubmit, state.appointment, state.details])

  const reset = useCallback(() => {
    try {
      sessionStorage.removeItem('preferredPerson')
    } catch {
      /* ignore */
    }
    dispatch({ type: 'RESET' })
  }, [])

  const cartItems = useMemo(
    () => Array.from(state.cart).map((id) => ITEMS_BY_ID[id]).filter(Boolean),
    [state.cart]
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
