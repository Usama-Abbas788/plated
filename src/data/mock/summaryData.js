export const initialReportData = {
  summary: {
    totalRevenue: 485000,
    totalOrders: 1248,
    averageOrderValue: 388,
    totalCustomers: 856,
    revenueGrowth: 12.5,
    ordersGrowth: 8.2,
  },
  salesData: [
    { name: 'Jan', revenue: 32000, orders: 85 },
    { name: 'Feb', revenue: 38000, orders: 102 },
    { name: 'Mar', revenue: 35000, orders: 94 },
    { name: 'Apr', revenue: 42000, orders: 115 },
    { name: 'May', revenue: 48000, orders: 130 },
    { name: 'Jun', revenue: 45000, orders: 122 },
    { name: 'Jul', revenue: 52000, orders: 140 },
    { name: 'Aug', revenue: 58000, orders: 152 },
    { name: 'Sep', revenue: 55000, orders: 146 },
    { name: 'Oct', revenue: 62000, orders: 165 },
    { name: 'Nov', revenue: 68000, orders: 178 },
    { name: 'Dec', revenue: 72000, orders: 190 },
  ],
  topProducts: [
    { name: 'Classic Burger', sales: 320, revenue: 96000 },
    { name: 'Chicken Pizza', sales: 285, revenue: 85500 },
    { name: 'Zinger Burger', sales: 240, revenue: 72000 },
    { name: 'French Fries', sales: 210, revenue: 31500 },
    { name: 'Club Sandwich', sales: 175, revenue: 52500 },
  ],
  paymentMethods: [
    { name: 'Cash', value: 45 },
    { name: 'Card', value: 30 },
    { name: 'Online', value: 25 },
  ],
  orderStatus: [
    { name: 'Completed', value: 780 },
    { name: 'Pending', value: 180 },
    { name: 'Cancelled', value: 88 },
    { name: 'Processing', value: 200 },
  ],
}

export const initialDashboardData = {
  stats: [
    { id: 1, title: 'Total Revenue', value: 'Rs. 245,800', icon: 'revenue', trend: '+12.5%', trendType: 'up', description: 'Compared to last month' },
    { id: 2, title: 'Total Orders', value: '1,245', icon: 'orders', trend: '+8.2%', trendType: 'up', description: 'Compared to last month' },
    { id: 3, title: 'Total Customers', value: '856', icon: 'customers', trend: '+5.4%', trendType: 'up', description: 'Compared to last month' },
    { id: 4, title: 'Average Order Value', value: 'Rs. 1,975', icon: 'averageOrder', trend: '+3.1%', trendType: 'up', description: 'Compared to last month' },
  ],
  salesData: [
    { name: 'Mon', revenue: 12000 },
    { name: 'Tue', revenue: 18000 },
    { name: 'Wed', revenue: 15000 },
    { name: 'Thu', revenue: 22000 },
    { name: 'Fri', revenue: 28000 },
    { name: 'Sat', revenue: 35000 },
    { name: 'Sun', revenue: 30000 },
  ],
  topProducts: [
    { id: 1, name: 'Classic Beef Burger', category: 'Burgers', unitsSold: 320, revenue: 48000 },
    { id: 2, name: 'Chicken Pizza', category: 'Pizza', unitsSold: 250, revenue: 37500 },
    { id: 3, name: 'French Fries', category: 'Sides', unitsSold: 210, revenue: 12600 },
  ],
  quickActions: [
    { id: 'add-product', label: 'Add Product', description: 'Add a new menu item', icon: 'product' },
    { id: 'create-category', label: 'Create Category', description: 'Organize your menu items', icon: 'category' },
    { id: 'add-employee', label: 'Add Employee', description: 'Add a new team member', icon: 'employee' },
    { id: 'view-orders', label: 'View Orders', description: 'Manage customer orders', icon: 'orders' },
  ],
}

export const initialSettings = {
  restaurantName: 'Plated Restaurant',
  email: 'contact@plated.com',
  phone: '03001234567',
  address: 'Main Boulevard, Lahore, Pakistan',
  openingTime: '09:00',
  closingTime: '23:00',
  currency: 'PKR',
  emailNotifications: true,
  orderNotifications: true,
  lowStockNotifications: true,
}
