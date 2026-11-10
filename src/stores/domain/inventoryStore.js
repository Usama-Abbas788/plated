import { initialInventory } from '../../data/mock/restaurantData'
import { createCollectionStore } from './createCollectionStore'

const useInventoryStore = createCollectionStore({
  collectionKey: 'inventory',
  endpoint: '/inventory',
  initialData: initialInventory,
  createAction: 'addItem',
  updateAction: 'updateItem',
  deleteAction: 'deleteItem',
})

export default useInventoryStore
