
import { useEffect, useState } from 'react'
import {
  Store,
  Bell,
  Clock,
  Save,
} from 'lucide-react'

import Button from '../../atoms/Button/Button'
import Input from '../../atoms/Input/Input'
import Label from '../../atoms/Label/Label'

const SettingsPanel = ({
  initialSettings = {},
  onSave,
  canManage = true,
  error,
}) => {
  const [settings, setSettings] = useState({
    restaurantName: 'Plated Restaurant',
    email: 'contact@plated.com',
    phone: '+92 300 1234567',
    address: 'Lahore, Pakistan',
    openingTime: '09:00',
    closingTime: '23:00',
    currency: 'PKR',
    emailNotifications: true,
    orderNotifications: true,
    lowStockNotifications: true,
    ...initialSettings,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    setSettings((previous) => ({
      ...previous,
      ...initialSettings,
    }))
  }, [initialSettings])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setSettings((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (isSaving) return

    if (settings.closingTime === settings.openingTime) {
      setValidationError('Opening and closing times must be different.')
      setSaveMessage('')
      return
    }

    setValidationError('')
    setSaveMessage('')
    setIsSaving(true)
    Promise.resolve(onSave?.(settings))
      .then((savedSettings) => {
        if (!savedSettings) return
        setSettings((previous) => ({ ...previous, ...savedSettings }))
        setSaveMessage('Settings saved successfully.')
      })
      .catch((saveError) => {
        setValidationError(
          saveError instanceof Error
            ? saveError.message
            : 'Settings could not be saved. Please try again.',
        )
      })
      .finally(() => setIsSaving(false))
  }

  const inputFields = [
    {
      name: 'restaurantName',
      label: 'Restaurant Name',
      type: 'text',
    },
    {
      name: 'email',
      label: 'Business Email',
      type: 'email',
    },
    {
      name: 'phone',
      label: 'Contact Number',
      type: 'tel',
    },
    {
      name: 'address',
      label: 'Restaurant Address',
      type: 'text',
    },
  ]

  const notificationOptions = [
    {
      name: 'emailNotifications',
      label: 'Email Notifications',
      description: 'Receive important updates through email.',
    },
    {
      name: 'orderNotifications',
      label: 'Order Notifications',
      description: 'Get notified when new orders are placed.',
    },
    {
      name: 'lowStockNotifications',
      label: 'Low Stock Alerts',
      description: 'Receive alerts when inventory is running low.',
    },
  ]

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary">
          Restaurant Settings
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          Configure your restaurant information and preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {(validationError || error) && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-status-danger" role="alert">
            {validationError || error}
          </p>
        )}
        {saveMessage && (
          <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-status-success" role="status">
            {saveMessage}
          </p>
        )}
        {/* Restaurant Information */}
        <div className="rounded-xl border border-border-default bg-background-surface">
          <div className="flex items-center gap-3 border-b border-border-default p-5">
            <Store className="text-brand-primary" size={20} />

            <div>
              <h3 className="font-semibold text-text-primary">
                Business Information
              </h3>

              <p className="text-sm text-text-secondary">
                Basic details about your restaurant.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
            {inputFields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>
                  {field.label}
                </Label>

                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={settings[field.name]}
                  onChange={handleChange}
                  disabled={!canManage}
                  required
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Operating Hours */}
        <div className="rounded-xl border border-border-default bg-background-surface">
          <div className="flex items-center gap-3 border-b border-border-default p-5">
            <Clock className="text-brand-primary" size={20} />

            <div>
              <h3 className="font-semibold text-text-primary">
                Operating Hours
              </h3>

              <p className="text-sm text-text-secondary">
                Set your restaurant's daily opening and closing times.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="openingTime">
                Opening Time
              </Label>

              <Input
                id="openingTime"
                name="openingTime"
                type="time"
                value={settings.openingTime}
                onChange={handleChange}
                disabled={!canManage}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="closingTime">
                Closing Time
              </Label>

              <Input
                id="closingTime"
                name="closingTime"
                type="time"
                value={settings.closingTime}
                onChange={handleChange}
                disabled={!canManage}
                required
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-xl border border-border-default bg-background-surface">
          <div className="flex items-center gap-3 border-b border-border-default p-5">
            <Bell className="text-brand-primary" size={20} />

            <div>
              <h3 className="font-semibold text-text-primary">
                Notification Preferences
              </h3>

              <p className="text-sm text-text-secondary">
                Choose which notifications you want to receive.
              </p>
            </div>
          </div>

          <div className="divide-y divide-border-default">
            {notificationOptions.map((option) => (
              <label
                key={option.name}
                className="flex cursor-pointer items-center justify-between gap-4 p-5"
              >
                <div>
                  <p className="font-medium text-text-primary">
                    {option.label}
                  </p>

                  <p className="text-sm text-text-secondary">
                    {option.description}
                  </p>
                </div>

                <input
                  type="checkbox"
                  name={option.name}
                  checked={settings[option.name]}
                  onChange={handleChange}
                  disabled={!canManage}
                  className="h-4 w-4 accent-brand-primary"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Save */}
        {canManage && (
          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={isSaving}>
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        )}
      </form>
    </section>
  )
}

export default SettingsPanel
