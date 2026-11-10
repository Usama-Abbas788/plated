import { initialRoles } from '../../data/mock/restaurantData'
import { createCollectionStore } from './createCollectionStore'

export const availablePermissions = [
  'dashboard.view',
  'products.view',
  'products.manage',
  'categories.manage',
  'orders.view',
  'orders.manage',
  'inventory.view',
  'inventory.manage',
  'employees.view',
  'employees.manage',
  'roles.manage',
  'payments.view',
  'payments.manage',
  'reports.view',
  'settings.view',
  'settings.manage',
]

const useRoleStore = createCollectionStore({
  collectionKey: 'roles',
  endpoint: '/roles',
  initialData: initialRoles,
  createAction: 'addRole',
  updateAction: 'updateRole',
  deleteAction: 'deleteRole',
  createDefaults: { employeeCount: 0, isSystem: false },
})

export default useRoleStore
