import { initialCategories } from '../../data/mock/restaurantData'
import { createCollectionStore } from './createCollectionStore'

const useCategoryStore = createCollectionStore({
  collectionKey: 'categories',
  endpoint: '/categories',
  initialData: initialCategories,
  createAction: 'addCategory',
  updateAction: 'updateCategory',
  deleteAction: 'deleteCategory',
})

export default useCategoryStore
