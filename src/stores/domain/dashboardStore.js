import { initialDashboardData } from '../../data/mock/summaryData'
import { createValueStore } from './createValueStore'

const useDashboardStore = createValueStore({
  stateKey: 'dashboardData',
  endpoint: '/dashboard',
  initialValue: initialDashboardData,
})

export default useDashboardStore
