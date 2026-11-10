import { initialPayments } from '../../data/mock/restaurantData'
import { createCollectionStore } from './createCollectionStore'

const usePaymentStore = createCollectionStore({
  collectionKey: 'payments',
  endpoint: '/payments',
  initialData: initialPayments,
  createAction: 'addPayment',
  updateAction: 'updatePayment',
})

export default usePaymentStore
