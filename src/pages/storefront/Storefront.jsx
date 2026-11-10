import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ShoppingBag, Store, UserRound } from 'lucide-react'
import MenuProductCard from '../../components/organisms/MenuProductCard/MenuProductCard'
import useProductStore from '../../stores/domain/productStore'
import useCategoryStore from '../../stores/domain/categoryStore'
import useBagStore from '../../stores/bagStore'

const Storefront = () => {
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
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(0)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const categoryNavRef = useRef(null)
  const categoryNavShellRef = useRef(null)

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [loadCategories, loadProducts])

  const activeCategories = useMemo(
    () => categories.filter((category) => category.status === 'Active'),
    [categories],
  )
  const activeCategoryIds = useMemo(
    () => new Set(activeCategories.map((category) => String(category.id))),
    [activeCategories],
  )
  const availableProducts = useMemo(
    () => products.filter(
      (product) =>
        product.status === 'Available' &&
        activeCategoryIds.has(String(product.categoryId)),
    ),
    [activeCategoryIds, products],
  )
  const menuSections = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    const sections = activeCategories.map((category) => ({
      ...category,
      products: availableProducts.filter((product) => {
        if (String(product.categoryId) !== String(category.id)) return false
        return (
          !query ||
          String(product.name || '').toLocaleLowerCase().includes(query) ||
          String(category.name || '').toLocaleLowerCase().includes(query) ||
          String(product.description || '').toLocaleLowerCase().includes(query)
        )
      }),
    }))
    return query ? sections.filter((category) => category.products.length > 0) : sections
  }, [activeCategories, availableProducts, search])

  useLayoutEffect(() => {
    const nav = categoryNavRef.current
    if (!nav) return undefined

    const updateVisibleCategories = () => {
      const availableWidth = nav.clientWidth
      const styles = window.getComputedStyle(nav)
      const gap = Number.parseFloat(styles.columnGap) || 8
      const fontSize = window.matchMedia('(min-width: 640px)').matches ? 14 : 12
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) return
      context.font = `500 ${fontSize}px Poppins, sans-serif`
      const categoryWidths = menuSections.map(
        (category) => context.measureText(category.name).width + 26,
      )
      context.font = `600 ${fontSize}px Poppins, sans-serif`
      const moreWidth = context.measureText('More').width + 45
      const fullWidth = categoryWidths.reduce((total, width) => total + width, 0) +
        Math.max(0, categoryWidths.length - 1) * gap

      if (fullWidth <= availableWidth) {
        setVisibleCategoryCount(menuSections.length)
        return
      }

      const categorySpace = Math.max(0, availableWidth - moreWidth - gap)
      let usedWidth = 0
      let count = 0
      for (const width of categoryWidths) {
        const nextWidth = usedWidth + (count ? gap : 0) + width
        if (nextWidth > categorySpace) break
        usedWidth = nextWidth
        count += 1
      }
      setVisibleCategoryCount(count)
    }

    updateVisibleCategories()
    const observer = new ResizeObserver(updateVisibleCategories)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [menuSections])

  useEffect(() => {
    if (!isMoreOpen) return undefined
    const handlePointerDown = (event) => {
      if (!categoryNavShellRef.current?.contains(event.target)) setIsMoreOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsMoreOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMoreOpen])

  useEffect(() => {
    if (!menuSections.length) {
      setActiveCategoryId(null)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visibleSections[0]) {
          setActiveCategoryId(visibleSections[0].target.dataset.categoryId)
        }
      },
      { rootMargin: '-150px 0px -60% 0px', threshold: 0 },
    )

    menuSections.forEach((category) => {
      const section = document.getElementById(`store-category-${category.id}`)
      if (section) observer.observe(section)
    })
    return () => observer.disconnect()
  }, [menuSections])

  useEffect(() => {
    if (!menuSections.length) {
      if (activeCategoryId !== null) setActiveCategoryId(null)
      return
    }
    if (!menuSections.some((category) => String(category.id) === activeCategoryId)) {
      setActiveCategoryId(String(menuSections[0].id))
    }
  }, [activeCategoryId, menuSections])

  const handleCategoryNav = (event, categoryId) => {
    event.preventDefault()
    setIsMoreOpen(false)
    document.getElementById(`store-category-${categoryId}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
    setActiveCategoryId(String(categoryId))
  }

  const bagCount = bagItems.reduce((total, item) => total + item.quantity, 0)
  const loading =
    productsLoading || categoriesLoading || !productsLoaded || !categoriesLoaded
  const pageError = productsError || categoriesError
  const visibleCategories = menuSections.slice(0, visibleCategoryCount)
  const overflowCategories = menuSections.slice(visibleCategoryCount)
  const categoryLinkClass = (categoryId) =>
    `shrink-0 rounded-full border px-3 py-2 text-xs font-medium transition sm:text-sm ${
      activeCategoryId === String(categoryId)
        ? 'border-orange-700 bg-orange-700 text-white shadow-sm'
        : 'border-orange-100 bg-white text-stone-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-800'
    }`

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-2 sm:gap-3" aria-label="Plated home">
            <span className="hidden h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-700 sm:flex"><Store size={23} /></span>
            <span className="text-lg font-bold tracking-tight sm:text-xl">Plated</span>
          </Link>
          <div ref={categoryNavShellRef} className="relative min-w-0 flex-1">
            <nav ref={categoryNavRef} aria-label="Menu categories" className="flex min-w-0 items-center justify-center gap-2">
              {visibleCategories.map((category) => (
                <a
                  key={category.id}
                  href={`#store-category-${category.id}`}
                  aria-current={activeCategoryId === String(category.id) ? 'location' : undefined}
                  onClick={(event) => handleCategoryNav(event, category.id)}
                  className={categoryLinkClass(category.id)}
                >
                  {category.name}
                </a>
              ))}
              {overflowCategories.length > 0 && (
                <div className="relative shrink-0">
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={isMoreOpen}
                    onClick={() => setIsMoreOpen((open) => !open)}
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-2 text-xs font-semibold transition sm:text-sm ${
                      overflowCategories.some((category) => String(category.id) === activeCategoryId)
                        ? 'border-orange-700 bg-orange-700 text-white shadow-sm'
                        : 'border-orange-200 bg-orange-50 text-orange-900 hover:border-orange-400 hover:bg-orange-100'
                    }`}
                  >
                    More <ChevronDown size={15} className={`transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isMoreOpen && (
                    <div role="menu" className="absolute right-0 top-full z-50 mt-2 max-h-[min(60vh,24rem)] w-56 overflow-y-auto rounded-2xl border border-orange-200 bg-white p-2 shadow-xl shadow-stone-900/10">
                      {overflowCategories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          role="menuitem"
                          onClick={(event) => handleCategoryNav(event, category.id)}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                            activeCategoryId === String(category.id)
                              ? 'bg-orange-50 font-semibold text-orange-800'
                              : 'text-stone-700 hover:bg-orange-50 hover:text-orange-800'
                          }`}
                        >
                          {category.name}
                          {activeCategoryId === String(category.id) && <span className="h-2 w-2 rounded-full bg-orange-600" aria-hidden="true" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {menuSections.length === 0 && <span className="truncate text-xs text-stone-500 sm:text-sm">Menu categories</span>}
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <Link to="/menu" className="whitespace-nowrap rounded-full bg-orange-700 px-2.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-800 sm:px-4 sm:text-sm">
              <span className="sm:hidden">Explore</span><span className="hidden sm:inline">Explore menu</span>
            </Link>
            <Link to="/account" aria-label="Customer account and order history" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-800 sm:h-10 sm:w-auto sm:gap-2 sm:px-3">
              <UserRound size={17} /><span className="hidden text-sm font-semibold sm:inline">Account</span>
            </Link>
            <Link to="/bag" aria-label={`Bag, ${bagCount} items`} className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-2.5 py-2 text-sm font-semibold text-stone-800 transition hover:border-orange-300 hover:bg-orange-50 sm:gap-2 sm:px-4">
              <ShoppingBag size={17} /><span className="hidden sm:inline">Bag</span>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-100 px-1 text-xs text-orange-900 sm:h-6 sm:min-w-6">{bagCount}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-orange-700 via-orange-600 to-amber-500 px-6 py-10 text-white sm:px-10 sm:py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-100">Welcome to Plated</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">Good food, ready to make your day.</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-orange-50 sm:text-base">Browse the menu, add your favourites to the bag, and place a delivery order in just a few steps.</p>
          <Link to="/menu" className="mt-7 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-orange-800 transition hover:bg-orange-50">Explore the menu</Link>
        </section>

        {pageError && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            <span>{pageError}</span>
            <button type="button" onClick={() => { loadProducts(); loadCategories() }} className="font-semibold underline underline-offset-2">Retry</button>
          </div>
        )}

        <section id="menu" className="mt-10 min-w-0">
          <div>
            <p className="text-sm font-semibold text-orange-700">Made fresh</p>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Explore our menu</h2>
          </div>
          <div className="sticky top-16 z-20 -mx-4 mt-4 bg-stone-50/95 px-4 py-3 backdrop-blur sm:top-20">
            <label className="ml-auto block w-full sm:max-w-xs">
              <span className="sr-only">Search menu</span>
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search dishes..." className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none shadow-sm transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
            </label>
          </div>

          {loading ? (
            <p className="mt-8 rounded-2xl bg-white p-8 text-center text-sm text-stone-500" role="status">Loading the menu...</p>
          ) : menuSections.length ? (
            <div className="mt-5 space-y-10">
              {menuSections.map((category) => (
                <section key={category.id} id={`store-category-${category.id}`} data-category-id={String(category.id)} aria-labelledby={`store-category-title-${category.id}`} className="scroll-mt-36">
                  <div className="mb-4 border-b border-stone-200 pb-3">
                    <h3 id={`store-category-title-${category.id}`} className="text-xl font-bold sm:text-2xl">{category.name}</h3>
                    {category.description && <p className="mt-1 text-sm text-stone-500">{category.description}</p>}
                  </div>
                  {category.products.length ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {category.products.map((product) => (
                        <MenuProductCard key={product.id} product={product} categoryName={category.name} />
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-sm text-stone-500">New items are coming soon.</p>
                  )}
                </section>
              ))}
            </div>
          ) : (
            <p className="mt-5 rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
              {search ? 'No menu items match your search.' : availableProducts.length ? 'The menu is being prepared.' : 'The menu is being prepared. Please check back soon.'}
            </p>
          )}
        </section>
      </main>

      <footer className="mt-12 border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} Plated</span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/account" className="font-medium text-stone-700 hover:text-orange-700">Customer account / order history</Link>
            <Link to="/contact" className="font-medium text-stone-700 hover:text-orange-700">Contact us / complaints</Link>
            <Link to="/login" className="font-medium text-stone-700 hover:text-orange-700">Staff sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Storefront
