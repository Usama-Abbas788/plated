import { initialReportData } from '../../data/mock/summaryData'
import { createValueStore } from './createValueStore'

const useReportStore = createValueStore({
  stateKey: 'reportData',
  endpoint: '/reports',
  initialValue: initialReportData,
})

export default useReportStore
