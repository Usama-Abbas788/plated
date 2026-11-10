import { useEffect, useMemo, useState } from 'react'
import OwnerDashboardTemplate from '../../../components/templates/OwnerDashboardTemplate/OwnerDashboardTemplate'
import InventoryManagement from '../../../components/organisms/InventoryManagement/InventoryManagement'
import EntityFormModal from '../../../components/organisms/EntityFormModal/EntityFormModal'
import ConfirmActionModal from '../../../components/organisms/ConfirmActionModal/ConfirmActionModal'
import useInventoryStore from '../../../stores/domain/inventoryStore'
import useHasPermission from '../../../auth/useHasPermission'

const getStockStatus = (item) => {
  if (Number(item.quantity) <= 0) return 'Out of Stock'
  if (Number(item.quantity) <= Number(item.minimumStock)) return 'Low Stock'
  return 'In Stock'
}

const inventoryCategories = [
  'Dairy',
  'Meat',
  'Condiments',
  'Bakery',
  'Grocery',
  'Vegetables',
  'Beverages',
  'Other',
]

function Inventory() {
  const canManageInventory = useHasPermission('inventory.manage')
  const inventory = useInventoryStore((state) => state.inventory)
  const loadInventory = useInventoryStore((state) => state.load)
  const isLoading = useInventoryStore((state) => state.isLoading)
  const hasLoaded = useInventoryStore((state) => state.hasLoaded)
  const error = useInventoryStore((state) => state.error)
  const addItem = useInventoryStore((state) => state.addItem)
  const updateItem = useInventoryStore((state) => state.updateItem)
  const deleteItem = useInventoryStore((state) => state.deleteItem)
  const [searchValue, setSearchValue] = useState('')
  const [filterValues, setFilterValues] = useState({
    category: 'all',
    stockStatus: 'all',
  })
  const [sortValue, setSortValue] = useState('name-asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)

  const pageSize = 5

  useEffect(() => {
    loadInventory()
  }, [loadInventory])

  const filteredInventory = useMemo(() => {
    let result = [...inventory]

    // Search by item name or category
    if (searchValue.trim()) {
      const search = searchValue.toLowerCase()

      result = result.filter(
        (item) =>
          String(item.name || '').toLowerCase().includes(search) ||
          String(item.category || '').toLowerCase().includes(search)
      )
    }

    // Filter by category
    if (filterValues.category !== 'all') {
      result = result.filter(
        (item) => item.category === filterValues.category
      )
    }

    // Filter by stock status
    if (filterValues.stockStatus !== 'all') {
      result = result.filter(
        (item) => getStockStatus(item) === filterValues.stockStatus
      )
    }

    // Sorting
    switch (sortValue) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'quantity-asc':
        result.sort((a, b) => a.quantity - b.quantity)
        break
      case 'quantity-desc':
        result.sort((a, b) => b.quantity - a.quantity)
        break
      default:
        break
    }

    return result
  }, [inventory, searchValue, filterValues, sortValue])

  const totalItems = filteredInventory.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value)
    setCurrentPage(1)
  }

  const handleFilterChange = (key, value) => {
    setFilterValues((previous) => ({ ...previous, [key]: value }))
    setCurrentPage(1)
  }

  const handleSortChange = (value) => {
    setSortValue(value)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setSearchValue('')
    setFilterValues({
      category: 'all',
      stockStatus: 'all',
    })
    setSortValue('name-asc')
    setCurrentPage(1)
  }

  const handleDeleteItem = async (item) => {
    setItemToDelete(item)
  }

  const handleConfirmDeleteItem = async () => {
    if (!itemToDelete) return 'The selected inventory item is no longer available.'

    const deleted = await deleteItem(itemToDelete.id)
    if (!deleted) {
      return useInventoryStore.getState().error || 'The inventory item could not be deleted.'
    }

    setItemToDelete(null)
    return true
  }

  const handleAddItem = () => {
    setSelectedItem(null)
    setIsModalOpen(true)
  }

  const handleEditItem = (item) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleSaveItem = async (formData) => {
    let savedItem
    if (selectedItem) {
      savedItem = await updateItem(selectedItem.id, {
        ...formData,
        name: formData.name.trim(),
        unit: formData.unit.trim(),
      })
    } else {
      savedItem = await addItem({
        ...formData,
        name: formData.name.trim(),
        unit: formData.unit.trim(),
      })
    }
    if (!savedItem) return
    if (!selectedItem) setCurrentPage(1)
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  return (
    <OwnerDashboardTemplate
      title="Inventory"
      subtitle="Monitor stock levels and manage your restaurant ingredients."
      error={error}
      onRetry={loadInventory}
      loading={isLoading || !hasLoaded}
    >
      <InventoryManagement
        inventory={paginatedInventory}
        categories={[...new Set([
          ...inventoryCategories,
          ...inventory.map((item) => item.category).filter(Boolean),
        ])].sort((a, b) => a.localeCompare(b))}
        loading={isLoading || !hasLoaded}
        canManage={canManageInventory}
        searchValue={searchValue}
        filterValues={filterValues}
        sortValue={sortValue}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
        onPageChange={setCurrentPage}
        onAddItem={handleAddItem}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
      />
      {isModalOpen && (
        <EntityFormModal
          key={selectedItem?.id ?? 'new-inventory-item'}
          entity={selectedItem}
          entityName="Inventory Item"
          fields={[
            { name: 'name', label: 'Item Name', required: true, placeholder: 'e.g. Mozzarella cheese' },
            {
              name: 'category',
              label: 'Category',
              type: 'select',
              required: true,
              options: ['Dairy', 'Meat', 'Condiments', 'Bakery', 'Grocery', 'Vegetables', 'Beverages', 'Other'].map((category) => ({ label: category, value: category })),
            },
            { name: 'quantity', label: 'Available Quantity', type: 'number', required: true, min: 0, step: 1, integer: true },
            { name: 'unit', label: 'Unit', required: true, placeholder: 'e.g. kg, L, pcs' },
            { name: 'minimumStock', label: 'Minimum Stock', type: 'number', required: true, min: 0, step: 1, integer: true },
            { name: 'cost', label: 'Unit Cost (PKR)', type: 'number', required: true, min: 0, step: '0.01' },
          ]}
          validate={(values) => {
            const duplicate = inventory.some((item) =>
              item.id !== selectedItem?.id &&
              String(item.category).toLocaleLowerCase() === String(values.category).toLocaleLowerCase() &&
              String(item.name).trim().toLocaleLowerCase() === String(values.name).trim().toLocaleLowerCase(),
            )
            return duplicate ? { name: 'An item with this name already exists in this category.' } : {}
          }}
          onClose={handleCloseModal}
          onSubmit={handleSaveItem}
        />
      )}
      {canManageInventory && itemToDelete && (
        <ConfirmActionModal
          title="Delete Inventory Item?"
          message={`Delete ${itemToDelete.name} from inventory? This action cannot be undone.`}
          error={error}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleConfirmDeleteItem}
        />
      )}
    </OwnerDashboardTemplate>
  )
}

export default Inventory