import { useEffect } from 'react'
import OwnerDashboardTemplate from '../../../components/templates/OwnerDashboardTemplate/OwnerDashboardTemplate'
import SettingsPanel from '../../../components/organisms/SettingsPanel/SettingsPanel'
import useSettingsStore from '../../../stores/domain/settingsStore'
import useHasPermission from '../../../auth/useHasPermission'

function Settings() {
  const canManageSettings = useHasPermission('settings.manage')
  const settings = useSettingsStore((state) => state.settings)
  const loadSettings = useSettingsStore((state) => state.load)
  const isLoading = useSettingsStore((state) => state.isLoading)
  const hasLoaded = useSettingsStore((state) => state.hasLoaded)
  const error = useSettingsStore((state) => state.error)
  const updateSettings = useSettingsStore((state) => state.updateSettings)

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  return (
    <OwnerDashboardTemplate
      title="Settings"
      subtitle="Manage your restaurant information and application preferences."
      error={error}
      onRetry={loadSettings}
      loading={isLoading || !hasLoaded}
    >
      <SettingsPanel
        initialSettings={settings}
        onSave={updateSettings}
        canManage={canManageSettings}
        error={error}
      />
    </OwnerDashboardTemplate>
  )
}

export default Settings