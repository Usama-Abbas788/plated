import { initialOrders } from '../../data/mock/restaurantData'
import { createCollectionStore } from './createCollectionStore'

const useOrderStore = createCollectionStore({
  collectionKey: 'orders',
  endpoint: '/orders',
  initialData: initialOrders,
  createAction: 'addOrder',
  updateAction: 'updateOrder',
})

export default useOrderStore
