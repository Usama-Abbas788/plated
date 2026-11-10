import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search, ShoppingBag, Store, UserRound } from 'lucide-react'
import MenuProductCard from '../../components/organisms/MenuProductCard/MenuProductCard'
import useProductStore from '../../stores/domain/productStore'
import useCategoryStore from '../../stores/domain/categoryStore'
import useBagStore from '../../stores/bagStore'

const MenuPage = () => {
  const products = useProductStore((state) => state.products)
  const loadProducts = useProductStore((state) => state.load)
  const productsLoading = useProductStore((state) => state.isLoading)
  const productsLoaded = useProductStore((state) => state.hasLoaded)
  const productsError = useProductStore((state) => state.error)
  const categories = useCategoryStore((state) => state.categories)
  const loadCategories = useCategoryStore((state) => state.load)
  const categoriesLoading = useCategoryStore((state) => state.isLoading)
  const categoriesLoaded = useCategoryStore((state) => state.hasLoaded)
  const categoriesError = useCategoryStore((state) => state.error)
  const bagItems = useBagStore((state) => state.items)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [loadCategories, loadProducts])

  const sections = useMemo(() => {
    const activeCategories = categories.filter((category) => category.status === 'Active')
    const query = search.trim().toLocaleLowerCase()

    const sections = activeCategories.map((category) => ({
      ...category,
      products: products.filter((product) => {
        if (product.status !== 'Available' || String(product.categoryId) !== String(category.id)) {
          return false
        }

        return (
          !query ||
          String(product.name || '').toLocaleLowerCase().includes(query) ||
          String(category.name || '').toLocaleLowerCase().includes(query) ||
          String(product.description || '').toLocaleLowerCase().includes(query)
        )
      }),
    }))
    return query ? sections.filter((category) => category.products.length > 0) : sections
  }, [categories, products, search])

  const bagCount = bagItems.reduce((total, item) => total + item.quantity, 0)
  const loading =
    productsLoading || categoriesLoading || !productsLoaded || !categoriesLoaded
  const error = productsError || categoriesError

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="Plated home">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
              <Store size={23} />
            </span>
            <span>
              <span className="block text-xl font-bold tracking-tight">Plated</span>
              <span className="block text-xs text-stone-500">The complete menu</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/account" aria-label="Customer account and order history" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-700 hover:border-orange-300 hover:bg-orange-50 sm:w-auto sm:gap-2 sm:px-3">
              <UserRound size={17} /><span className="hidden text-sm font-semibold sm:inline">Account</span>
            </Link>
            <Link
              to="/bag"
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              <ShoppingBag size={17} />
              Bag <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1.5 text-xs text-stone-900">{bagCount}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-orange-700">
          <ArrowLeft size={17} /> Back to home
        </Link>

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-orange-700">Made fresh</p>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Our complete menu</h1>
            <p className="mt-2 text-sm text-stone-600">Find your next favourite, explore its details, and choose a size.</p>
          </div>
          <label className="relative block w-full sm:max-w-sm">
            <span className="sr-only">Search menu</span>
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search dishes or categories..."
              className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </label>
        </div>

        {error && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => { loadProducts(); loadCategories() }} className="font-semibold underline underline-offset-2">
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <p className="mt-8 rounded-2xl bg-white p-8 text-center text-sm text-stone-500" role="status">Loading the menu...</p>
        ) : sections.length ? (
          <div className="mt-8 space-y-10">
            {sections.map((category) => (
              <section key={category.id} aria-labelledby={`menu-category-${category.id}`}>
                <div className="mb-4 border-b border-stone-200 pb-3">
                  <h2 id={`menu-category-${category.id}`} className="text-2xl font-bold">{category.name}</h2>
                  {category.description && <p className="mt-1 text-sm text-stone-500">{category.description}</p>}
                </div>
                {category.products.length ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {category.products.map((product) => (
                      <MenuProductCard
                        key={product.id}
                        product={product}
                        categoryName={category.name}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-sm text-stone-500">
                    New items are coming soon.
                  </p>
                )}
              </section>
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-sm text-stone-500">
            {search ? 'No menu items match your search.' : 'The menu is being prepared. Please check back soon.'}
          </p>
        )}
      </main>
      <footer className="mt-12 border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-5 px-4 py-6 text-sm sm:px-6 lg:px-8">
          <Link to="/account" className="font-medium text-stone-600 hover:text-orange-700">Customer account / order history</Link>
          <Link to="/contact" className="font-medium text-stone-600 hover:text-orange-700">Contact us / complaints</Link>
          <Link to="/login" className="font-medium text-stone-600 hover:text-orange-700">Staff sign in</Link>
        </div>
      </footer>
    </div>
  )
}

export default MenuPage
