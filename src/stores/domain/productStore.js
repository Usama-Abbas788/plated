import { initialProducts } from '../../data/mock/restaurantData'
import { createCollectionStore } from './createCollectionStore'

const useProductStore = createCollectionStore({
  collectionKey: 'products',
  endpoint: '/products',
  initialData: initialProducts,
  createAction: 'addProduct',
  updateAction: 'updateProduct',
  deleteAction: 'deleteProduct',
})

export default useProductStore
