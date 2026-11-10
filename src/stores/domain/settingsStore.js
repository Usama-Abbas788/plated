import { initialSettings } from '../../data/mock/summaryData'
import { createValueStore } from './createValueStore'

const useSettingsStore = createValueStore({
  stateKey: 'settings',
  endpoint: '/settings',
  initialValue: initialSettings,
  updateAction: 'updateSettings',
})

export default useSettingsStore
