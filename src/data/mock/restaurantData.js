export const initialProducts = [
  { id: 1, name: 'Classic Beef Burger', categoryId: 1, productType: 'Food', ingredients: ['Beef patty', 'Cheddar cheese', 'Lettuce', 'Tomato', 'House sauce'], sizes: [{ id: 'small', name: 'Small', price: 1500 }, { id: 'medium', name: 'Medium', price: 2100 }, { id: 'large', name: 'Large', price: 2700 }], price: 1500, stock: 45, status: 'Available' },
  { id: 2, name: 'Chicken Pizza', categoryId: 2, productType: 'Food', ingredients: ['Grilled chicken', 'Mozzarella', 'Tomato sauce', 'Bell peppers'], sizes: [{ id: 'small', name: 'Small', price: 2200 }, { id: 'medium', name: 'Medium', price: 3000 }, { id: 'large', name: 'Large', price: 3800 }], price: 2200, stock: 30, status: 'Available' },
  { id: 3, name: 'French Fries', categoryId: 4, productType: 'Food', ingredients: ['Potatoes', 'Sea salt'], sizes: [{ id: 'small', name: 'Small', price: 500 }, { id: 'medium', name: 'Medium', price: 750 }, { id: 'large', name: 'Large', price: 1000 }], price: 500, stock: 60, status: 'Available' },
  { id: 4, name: 'Chocolate Shake', categoryId: 3, productType: 'Drink', ingredients: ['Milk', 'Chocolate', 'Vanilla ice cream'], sizes: [{ id: '500ml', name: '0.5 L', price: 650 }, { id: '1l', name: '1 L', price: 1100 }, { id: '1500ml', name: '1.5 L', price: 1500 }], price: 650, stock: 8, status: 'Available' },
  { id: 5, name: 'Grilled Chicken Sandwich', categoryId: 6, productType: 'Food', ingredients: ['Grilled chicken', 'Lettuce', 'Tomato', 'Mayonnaise'], sizes: [{ id: 'small', name: 'Small', price: 1200 }, { id: 'medium', name: 'Medium', price: 1600 }, { id: 'large', name: 'Large', price: 2000 }], price: 1200, stock: 0, status: 'Unavailable' },
  { id: 6, name: 'Pepperoni Pizza', categoryId: 2, productType: 'Food', ingredients: ['Pepperoni', 'Mozzarella', 'Tomato sauce'], sizes: [{ id: 'small', name: 'Small', price: 2500 }, { id: 'medium', name: 'Medium', price: 3300 }, { id: 'large', name: 'Large', price: 4100 }], price: 2500, stock: 18, status: 'Available' },
]

export const initialCategories = [
  { id: 1, name: 'Burgers', description: 'Delicious beef and chicken burgers.', status: 'Active' },
  { id: 2, name: 'Pizza', description: 'Freshly baked pizzas with various toppings.', status: 'Active' },
  { id: 3, name: 'Drinks', description: 'Cold beverages, juices, and shakes.', status: 'Active' },
  { id: 4, name: 'Sides', description: 'Fries, nuggets, and other side dishes.', status: 'Active' },
  { id: 5, name: 'Desserts', description: 'Sweet treats and desserts.', status: 'Inactive' },
  { id: 6, name: 'Sandwiches', description: 'Freshly prepared sandwiches.', status: 'Active' },
]

export const initialOrders = [
  { id: 'ORD-1001', customer: 'Ali Ahmed', date: '2026-11-06', items: [{ name: 'Classic Beef Burger', quantity: 1, unitPrice: 1500 }, { name: 'French Fries', quantity: 2, unitPrice: 500 }], total: 2500, paymentStatus: 'Paid', status: 'Completed' },
  { id: 'ORD-1002', customer: 'Sara Khan', date: '2026-11-06', items: [{ name: 'Chicken Sandwich', quantity: 1, unitPrice: 1200 }, { name: 'Chocolate Shake', quantity: 1, unitPrice: 600 }], total: 1800, paymentStatus: 'Unpaid', status: 'Pending' },
  { id: 'ORD-1003', customer: 'Usman Malik', date: '2026-11-05', items: [{ name: 'Pepperoni Pizza', quantity: 1, unitPrice: 2500 }, { name: 'French Fries', quantity: 2, unitPrice: 350 }], total: 3200, paymentStatus: 'Paid', status: 'Processing' },
  { id: 'ORD-1004', customer: 'Ayesha Noor', date: '2026-11-05', items: [{ name: 'Classic Beef Burger', quantity: 1, unitPrice: 1500 }], total: 1500, paymentStatus: 'Paid', status: 'Completed' },
  { id: 'ORD-1005', customer: 'Hamza Ali', date: '2026-11-04', items: [{ name: 'Chicken Sandwich', quantity: 1, unitPrice: 1700 }, { name: 'French Fries', quantity: 1, unitPrice: 500 }], total: 2200, paymentStatus: 'Unpaid', status: 'Cancelled' },
  { id: 'ORD-1006', customer: 'Fatima Zahra', date: '2026-11-04', items: [{ name: 'Pepperoni Pizza', quantity: 1, unitPrice: 2500 }, { name: 'Classic Beef Burger', quantity: 1, unitPrice: 1500 }, { name: 'French Fries', quantity: 2, unitPrice: 250 }], total: 4500, paymentStatus: 'Paid', status: 'Processing' },
]

export const initialInventory = [
  { id: 1, name: 'Cheese', category: 'Dairy', quantity: 5, unit: 'kg', minimumStock: 10, cost: 850 },
  { id: 2, name: 'Chicken', category: 'Meat', quantity: 2, unit: 'kg', minimumStock: 8, cost: 1200 },
  { id: 3, name: 'Tomato Sauce', category: 'Condiments', quantity: 15, unit: 'kg', minimumStock: 5, cost: 450 },
  { id: 4, name: 'Burger Buns', category: 'Bakery', quantity: 0, unit: 'pcs', minimumStock: 20, cost: 80 },
  { id: 5, name: 'Cooking Oil', category: 'Grocery', quantity: 12, unit: 'L', minimumStock: 5, cost: 650 },
  { id: 6, name: 'Potatoes', category: 'Vegetables', quantity: 30, unit: 'kg', minimumStock: 10, cost: 150 },
]

export const initialEmployees = [
  { id: 1, name: 'Ali Ahmed', email: 'ali@example.com', phone: '03001234567', role: 'Manager', department: 'Management', salary: 65000, status: 'Active', joiningDate: '2025-02-10' },
  { id: 2, name: 'Sara Khan', email: 'sara@example.com', phone: '03011234567', role: 'Chef', department: 'Kitchen', salary: 55000, status: 'Active', joiningDate: '2025-03-15' },
  { id: 3, name: 'Usman Tariq', email: 'usman@example.com', phone: '03021234567', role: 'Waiter', department: 'Service', salary: 30000, status: 'Active', joiningDate: '2025-04-01' },
  { id: 4, name: 'Ayesha Malik', email: 'ayesha@example.com', phone: '03031234567', role: 'Cashier', department: 'Finance', salary: 35000, status: 'Inactive', joiningDate: '2024-11-20' },
  { id: 5, name: 'Hamza Raza', email: 'hamza@example.com', phone: '03041234567', role: 'Delivery Rider', department: 'Delivery', salary: 32000, status: 'Active', joiningDate: '2025-06-05' },
  { id: 6, name: 'Zainab Noor', email: 'zainab@example.com', phone: '03051234567', role: 'Chef', department: 'Kitchen', salary: 50000, status: 'On Leave', joiningDate: '2025-01-12' },
]

export const initialRoles = [
  { id: 1, name: 'Owner', description: 'Full access to all restaurant operations and settings.', employeeCount: 1, permissions: ['dashboard.view', 'products.view', 'products.manage', 'categories.manage', 'orders.view', 'orders.manage', 'payments.view', 'payments.manage', 'inventory.view', 'inventory.manage', 'employees.view', 'employees.manage', 'roles.manage', 'reports.view', 'settings.view', 'settings.manage'], status: 'Active', isSystem: true },
  { id: 2, name: 'Manager', description: 'Manage daily restaurant operations and staff.', employeeCount: 2, permissions: ['dashboard.view', 'products.view', 'products.manage', 'categories.manage', 'orders.view', 'orders.manage', 'payments.view', 'payments.manage', 'inventory.view', 'inventory.manage', 'employees.view', 'employees.manage', 'roles.manage', 'reports.view', 'settings.view'], status: 'Active', isSystem: true },
  { id: 3, name: 'Cashier', description: 'Handle customer orders and payment transactions.', employeeCount: 2, permissions: ['dashboard.view', 'products.view', 'orders.view', 'orders.manage', 'payments.view', 'payments.manage'], status: 'Active', isSystem: false },
  { id: 4, name: 'Kitchen Staff', description: 'View incoming orders and update preparation status.', employeeCount: 4, permissions: ['dashboard.view', 'orders.view', 'orders.manage'], status: 'Active', isSystem: false },
  { id: 5, name: 'Delivery Staff', description: 'View assigned orders and update delivery status.', employeeCount: 3, permissions: ['dashboard.view', 'orders.view'], status: 'Inactive', isSystem: false },
  { id: 6, name: 'Inventory Manager', description: 'Monitor stock levels and manage inventory records.', employeeCount: 1, permissions: ['dashboard.view', 'products.view', 'inventory.view', 'inventory.manage'], status: 'Active', isSystem: false },
]

export const initialPayments = [
  { id: 1, transactionId: 'TXN-1001', orderId: 'ORD-1001', customer: 'Ali Ahmed', amount: 2500, method: 'Cash', status: 'Completed', date: '2026-11-01' },
  { id: 2, transactionId: 'TXN-1002', orderId: 'ORD-1002', customer: 'Sara Khan', amount: 1800, method: 'Card', status: 'Pending', date: '2026-11-06' },
  { id: 3, transactionId: 'TXN-1003', orderId: 'ORD-1003', customer: 'Usman Malik', amount: 3200, method: 'Online', status: 'Completed', date: '2026-11-05' },
  { id: 4, transactionId: 'TXN-1004', orderId: 'ORD-1004', customer: 'Ayesha Noor', amount: 1500, method: 'Cash', status: 'Completed', date: '2026-11-05' },
  { id: 5, transactionId: 'TXN-1005', orderId: 'ORD-1005', customer: 'Hamza Ali', amount: 2200, method: 'Card', status: 'Failed', date: '2026-11-04' },
  { id: 6, transactionId: 'TXN-1006', orderId: 'ORD-1006', customer: 'Fatima Zahra', amount: 4500, method: 'Online', status: 'Completed', date: '2026-11-04' },
]
