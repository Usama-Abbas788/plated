
import { useEffect, useState } from 'react'

import OwnerDashboardTemplate from '../../../components/templates/OwnerDashboardTemplate/OwnerDashboardTemplate'
import CategoriesManagement from '../../../components/organisms/CategoriesManagement/CategoriesManagement'
import CategoryFormModal from '../../../components/organisms/CategoryFormModal/CategoryFormModal'
import ConfirmActionModal from '../../../components/organisms/ConfirmActionModal/ConfirmActionModal'
import useCategoryStore from '../../../stores/domain/categoryStore'
import useProductStore from '../../../stores/domain/productStore'

const Categories = () => {
  const categories = useCategoryStore((state) => state.categories)
  const loadCategories = useCategoryStore((state) => state.load)
  const isLoading = useCategoryStore((state) => state.isLoading)
  const hasLoaded = useCategoryStore((state) => state.hasLoaded)
  const error = useCategoryStore((state) => state.error)
  const addCategory = useCategoryStore((state) => state.addCategory)
  const updateCategory = useCategoryStore((state) => state.updateCategory)
  const deleteCategory = useCategoryStore((state) => state.deleteCategory)
  const products = useProductStore((state) => state.products)
  const loadProducts = useProductStore((state) => state.load)
  const productsLoading = useProductStore((state) => state.isLoading)
  const productsLoaded = useProductStore((state) => state.hasLoaded)
  const productsError = useProductStore((state) => state.error)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoryToDelete, setCategoryToDelete] = useState(null)

  const [search, setSearch] = useState('')
  const [filterValues, setFilterValues] = useState({})
  const [sortValue, setSortValue] = useState('')

  const [currentPage, setCurrentPage] = useState(1)

  const pageSize = 5

  useEffect(() => {
    loadCategories()
    loadProducts()
  }, [loadCategories, loadProducts])

  const handleFilterChange = (key, value) => {
    setFilterValues((previous) => ({
      ...previous,
      [key]: value,
    }))

    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setSearch('')
    setFilterValues({})
    setSortValue('')
    setCurrentPage(1)
  }

  const handleAddCategory = () => {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  const handleEditCategory = (category) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleSaveCategory = async (formData) => {
    let savedCategory
    if (selectedCategory) {
      savedCategory = await updateCategory(selectedCategory.id, formData)
    } else {
      savedCategory = await addCategory(formData)
    }

    if (!savedCategory) return
    if (!selectedCategory) setCurrentPage(1)
    setIsModalOpen(false)
    setSelectedCategory(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCategory(null)
  }

  const handleDeleteCategory = async () => {
    const deleted = await deleteCategory(categoryToDelete.id)
    if (deleted) setCategoryToDelete(null)
    return deleted || useCategoryStore.getState().error || false
  }

  const categoriesWithProductCount = categories.map((category) => ({
    ...category,
    productCount: products.filter(
      (product) => String(product.categoryId) === String(category.id),
    ).length,
  }))

  const filteredCategories = categoriesWithProductCount.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(search.toLowerCase()) ||
      category.description.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      !filterValues.status ||
      category.status === filterValues.status

    return matchesSearch && matchesStatus
  })

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortValue === 'name-asc') {
      return a.name.localeCompare(b.name)
    }

    if (sortValue === 'name-desc') {
      return b.name.localeCompare(a.name)
    }

    if (sortValue === 'productCount-asc') {
      return a.productCount - b.productCount
    }

    if (sortValue === 'productCount-desc') {
      return b.productCount - a.productCount
    }

    return 0
  })

  const totalItems = sortedCategories.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const validPage = Math.min(currentPage, totalPages)
  const paginatedCategories = sortedCategories.slice(
    (validPage - 1) * pageSize,
    validPage * pageSize,
  )

  return (
    <OwnerDashboardTemplate
      title="Categories"
      subtitle="Organize your restaurant menu into categories."
      error={error || productsError}
      onRetry={() => {
        loadCategories()
        loadProducts()
      }}
      loading={isLoading || !hasLoaded || productsLoading || !productsLoaded}
    >
      <CategoriesManagement
        categories={paginatedCategories}
        loading={isLoading || !hasLoaded}
        searchValue={search}
        filterValues={filterValues}
        sortValue={sortValue}
        currentPage={validPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onSearchChange={(event) => {
          setSearch(event.target.value)
          setCurrentPage(1)
        }}
        onFilterChange={handleFilterChange}
        onSortChange={(value) => {
          setSortValue(value)
          setCurrentPage(1)
        }}
        onResetFilters={handleResetFilters}
        onPageChange={setCurrentPage}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={(category) => {
          if (category.productCount > 0) return
          setCategoryToDelete(category)
        }}
      />
      {isModalOpen && (
        <CategoryFormModal
          key={selectedCategory?.id ?? 'new-category'}
          isOpen={isModalOpen}
          category={selectedCategory}
          categories={categories}
          error={error}
          onClose={handleCloseModal}
          onSubmit={handleSaveCategory}
        />
      )}
      {categoryToDelete && (
        <ConfirmActionModal
          title="Delete category?"
          message={`"${categoryToDelete.name}" will be permanently removed.`}
          confirmLabel="Delete category"
          error={error}
          onClose={() => setCategoryToDelete(null)}
          onConfirm={handleDeleteCategory}
        />
      )}
    </OwnerDashboardTemplate>
  )
}

export default Categories
