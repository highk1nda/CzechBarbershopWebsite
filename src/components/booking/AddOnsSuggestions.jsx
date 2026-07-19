import { useMemo } from 'react'
import { useBookingCart } from '../../context/BookingCartContext'
import { ITEMS_BY_ID } from '../../data/services'
import { RECOMMENDED_ADD_ONS } from '../../data/addOns'

export default function AddOnsSuggestions() {
  const { state, cartItems, addItem } = useBookingCart()

  const suggestions = useMemo(() => {
    const categoryTitles = new Set(cartItems.map((item) => item.categoryTitle))
    const suggestedIds = new Set()
    categoryTitles.forEach((title) => {
      (RECOMMENDED_ADD_ONS[title] || []).forEach((id) => suggestedIds.add(id))
    })
    return Array.from(suggestedIds)
      .filter((id) => !state.cart.has(id))
      .map((id) => ITEMS_BY_ID[id])
      .filter(Boolean)
      .slice(0, 3)
  }, [cartItems, state.cart])

  if (suggestions.length === 0) return null

  return (
    <div className="border-t border-stone pt-4 mb-1">
      <p className="font-body text-[10px] tracking-widest uppercase text-mauve mb-2.5">
        Zákazníci si také objednávají
      </p>
      <ul className="space-y-2">
        {suggestions.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3">
            <span className="font-body text-sm text-charcoal truncate">{item.name}</span>
            <button
              type="button"
              onClick={() => addItem(item.id)}
              className="flex-shrink-0 font-body text-[10px] tracking-widest uppercase text-mauve border border-mauve/40 rounded-full px-3 py-1.5 hover:bg-mauve hover:text-white transition-all duration-200"
            >
              + Přidat
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
