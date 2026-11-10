import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

import Button from '../../atoms/Button/Button'

const getInitialValues = (fields, entity) =>
  Object.fromEntries(
    fields.map((field) => [
      field.name,
      entity?.[field.name] ?? field.defaultValue ?? (field.type === 'multiselect' ? [] : ''),
    ]),
  )

const EntityFormModal = ({
  entity,
  entityName,
  fields,
  validate,
  error,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState(() => getInitialValues(fields, entity))
  const [errors, setErrors] = useState({})
  const isEditing = Boolean(entity)

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const handleChange = (event) => {
    const { name, value, checked } = event.target
    const field = fields.find((item) => item.name === name)

    setValues((previous) => ({
      ...previous,
      [name]: field?.type === 'multiselect'
        ? checked
          ? [...previous[name], value]
          : previous[name].filter((item) => item !== value)
        : value,
    }))
    setErrors((previous) => ({ ...previous, [name]: '' }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {}
    for (const field of fields) {
      const value = values[field.name]
      if (
        field.required &&
        (Array.isArray(value) ? value.length === 0 : String(value).trim() === '')
      ) {
        nextErrors[field.name] = `${field.label} is required.`
      } else if (field.type === 'number' && value !== '') {
        const number = Number(value)
        if (
          !Number.isFinite(number) ||
          number < (field.min ?? 0) ||
          (field.integer && !Number.isInteger(number))
        ) {
          nextErrors[field.name] = `${field.label} must be a valid number.`
        }
      } else if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        nextErrors[field.name] = 'Enter a valid email address.'
      }
    }

    Object.assign(nextErrors, validate?.(values) ?? {})
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const submittedValues = Object.fromEntries(
      fields.map((field) => [
        field.name,
        field.type === 'number' && values[field.name] !== ''
          ? Number(values[field.name])
          : values[field.name],
      ]),
    )
    onSubmit(submittedValues)
  }

  const inputClass =
    'w-full rounded-lg border border-border-default bg-white px-3 py-2.5 text-sm text-text-primary outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'

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
        aria-labelledby="entity-form-title"
        className="modal-scrollbar max-h-[calc(100dvh-1rem)] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100dvh-2rem)]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border-default px-4 py-4 sm:px-6">
          <div>
            <h2 id="entity-form-title" className="text-lg font-semibold text-text-primary">
              {isEditing ? `Edit ${entityName}` : `Add ${entityName}`}
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              {isEditing ? `Update ${entityName.toLowerCase()} details.` : `Enter the new ${entityName.toLowerCase()} details.`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-text-secondary transition hover:bg-background-main hover:text-text-primary"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-4 sm:p-6">
          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-status-danger" role="alert">
              {error}
            </p>
          )}
          {fields.map((field) => (
            <div key={field.name}>
              {field.type === 'multiselect' ? (
                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-text-primary">
                    {field.label}
                  </legend>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {field.options.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 text-sm text-text-secondary">
                        <input
                          type="checkbox"
                          name={field.name}
                          value={option.value}
                          checked={values[field.name].includes(option.value)}
                          onChange={handleChange}
                          className="accent-brand-primary"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : (
                <>
                  <label htmlFor={`entity-${field.name}`} className="mb-1.5 block text-sm font-medium text-text-primary">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={`entity-${field.name}`}
                      name={field.name}
                      value={values[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      rows={field.rows ?? 3}
                      className={`${inputClass} resize-y`}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      id={`entity-${field.name}`}
                      name={field.name}
                      value={values[field.name]}
                      onChange={handleChange}
                      className={`${inputClass} plated-select`}
                    >
                      <option value="">Select {field.label.toLowerCase()}</option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`entity-${field.name}`}
                      name={field.name}
                      type={field.type ?? 'text'}
                      value={values[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      min={field.min}
                      step={field.step}
                      inputMode={field.type === 'number' ? 'decimal' : undefined}
                      className={inputClass}
                    />
                  )}
                </>
              )}
              {errors[field.name] && (
                <p className="mt-1 text-xs text-status-danger">{errors[field.name]}</p>
              )}
            </div>
          ))}

          <div className="flex justify-end gap-3 border-t border-border-default pt-5">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Save Changes' : `Add ${entityName}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EntityFormModal
