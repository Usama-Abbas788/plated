import { useEffect } from 'react'
import { X } from 'lucide-react'

import Button from '../../atoms/Button/Button'

const RecordDetailsModal = ({ title, details, onClose, action }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-2 sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-details-title"
        className="modal-scrollbar max-h-[calc(100dvh-1rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100dvh-2rem)]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border-default px-4 py-4 sm:px-6">
          <h2 id="record-details-title" className="text-lg font-semibold text-text-primary">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-text-secondary transition hover:bg-background-main hover:text-text-primary"
          >
            <X size={20} />
          </button>
        </div>

        <dl className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6">
          {details.map(({ label, value }) => (
            <div key={label} className="min-w-0">
              <dt className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                {label}
              </dt>
              <dd className="mt-1 break-words text-sm text-text-primary">
                {value ?? '—'}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap justify-end gap-3 border-t border-border-default px-4 py-4 sm:px-6">
          {action}
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RecordDetailsModal
