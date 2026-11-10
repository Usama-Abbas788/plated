export const ownerRoutePermissions = [
  ['/owner/dashboard', 'dashboard.view'],
  ['/owner/products', 'products.view'],
  ['/owner/categories', 'categories.manage'],
  ['/owner/orders', 'orders.view'],
  ['/owner/inventory', 'inventory.view'],
  ['/owner/employees', 'employees.view'],
  ['/owner/user-roles', 'roles.manage'],
  ['/owner/payments', 'payments.view'],
  ['/owner/reports', 'reports.view'],
  ['/owner/settings', 'settings.view'],
]

export const getHomePath = (permissions = []) =>
  ownerRoutePermissions.find(([, permission]) =>
    permissions.includes(permission),
  )?.[0] ?? '/no-access'
