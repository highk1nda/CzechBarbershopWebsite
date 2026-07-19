import CartBody from './CartBody'

export default function CartPanel() {
  return (
    <div className="sticky top-24 rounded-3xl border border-stone bg-white shadow-soft p-6 max-h-[calc(100vh-7rem)] flex flex-col">
      <CartBody />
    </div>
  )
}
