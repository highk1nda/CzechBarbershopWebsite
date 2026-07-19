export default function ConfirmDialog({ open, title, message, confirmLabel = 'Smazat', onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-ink/60 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-w-sm w-full p-6 shadow-lift"
      >
        <h3 className="font-heading text-xl text-ink mb-2">{title}</h3>
        <p className="font-body text-sm text-warm mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="font-body text-xs tracking-widest2 uppercase px-4 py-2.5 border border-stone text-charcoal hover:border-mauve/50 transition-colors"
          >
            Zrušit
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="font-body text-xs tracking-widest2 uppercase px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
