import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import Button from '../../atoms/Button/Button'

const ConfirmActionModal = ({
  title,
  message,
  confirmLabel = 'Delete',
  submittingLabel = 'Deleting...',
  error,
  onClose,
  onConfirm,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [actionError, setActionError] = useState('')

  const handleConfirm = async () => {
    setIsSubmitting(true)
    setActionError('')
    try {
      const succeeded = await onConfirm()
      if (typeof succeeded === 'string') {
        setActionError(succeeded)
      } else if (succeeded === false) {
        setActionError(error || 'The action could not be completed. Please try again.')
      }
    } catch (submitError) {
      setActionError(
        submitError instanceof Error
          ? submitError.message
          : 'The action could not be completed. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose()
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-action-title"
        aria-describedby="confirm-action-message"
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-status-danger">
            <AlertTriangle size={20} />
          </span>
          <div className="min-w-0">
            <h2 id="confirm-action-title" className="text-lg font-semibold text-text-primary">
              {title}
            </h2>
            <p id="confirm-action-message" className="mt-2 text-sm leading-6 text-text-secondary">
              {message}
            </p>
            {(actionError || error) && (
              <p className="mt-3 text-sm text-status-danger" role="alert">
                {actionError || error}
              </p>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? submittingLabel : confirmLabel}
          </Button>
        </div>
      </section>
    </div>
  )
}

export default ConfirmActionModal
