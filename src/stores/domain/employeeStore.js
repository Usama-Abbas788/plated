import { initialEmployees } from '../../data/mock/restaurantData'
import { createCollectionStore } from './createCollectionStore'

const useEmployeeStore = createCollectionStore({
  collectionKey: 'employees',
  endpoint: '/employees',
  initialData: initialEmployees,
  createAction: 'addEmployee',
  updateAction: 'updateEmployee',
  deleteAction: 'deleteEmployee',
})

export default useEmployeeStore
