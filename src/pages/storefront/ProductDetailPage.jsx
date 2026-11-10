import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, ShoppingBag, Store, UserRound, X } from 'lucide-react'
import NotFound from '../NotFound/NotFound'
import useProductStore from '../../stores/domain/productStore'
import useCategoryStore from '../../stores/domain/categoryStore'
import useBagStore from '../../stores/bagStore'

const formatPrice = (amount) => `PKR ${Number(amount || 0).toLocaleString()}`

const ProductDetailPage = () => {
  const { productId } = useParams()
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
  const addItem = useBagStore((state) => state.addItem)
  const [selectedSizeId, setSelectedSizeId] = useState('')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [loadCategories, loadProducts])

  const product = products.find((item) => String(item.id) === String(productId))
  const category = categories.find((item) => String(item.id) === String(product?.categoryId))
  const sizes = useMemo(() => {
    if (!product) return []
    return product.sizes?.length
      ? product.sizes
      : [{ id: 'regular', name: product.productType === 'Drink' ? '1 L' : 'Regular', price: product.price }]
  }, [product])
  const selectedSize = sizes.find((size) => String(size.id ?? size.name) === selectedSizeId) || sizes[0]
  const bagCount = bagItems.reduce((total, item) => total + item.quantity, 0)
  const productQuantity = bagItems
    .filter((item) => String(item.product.id) === String(product?.id))
    .reduce((total, item) => total + item.quantity, 0)
  const soldOut =
    product?.status !== 'Available' ||
    (Number.isFinite(Number(product?.stock)) && product.stock <= productQuantity)
  const loading =
    productsLoading || categoriesLoading || !productsLoaded || !categoriesLoaded

  useEffect(() => {
    if (!added) return undefined
    const timeoutId = window.setTimeout(() => setAdded(false), 2000)
    return () => window.clearTimeout(timeoutId)
  }, [added])

  if (loading) {
    return <main className="p-8 text-center text-sm text-stone-500" role="status">Loading product...</main>
  }

  if (productsError || categoriesError) {
    return (
      <main className="mx-auto max-w-xl p-8 text-center">
        <p className="text-sm text-red-700" role="alert">{productsError || categoriesError}</p>
        <button type="button" onClick={() => { loadProducts(); loadCategories() }} className="mt-4 font-semibold text-orange-700">
          Try again
        </button>
      </main>
    )
  }

  if (!product || !category || category.status !== 'Active') return <NotFound />

  const handleAddToBag = () => {
    if (!selectedSize || soldOut) return
    addItem(product, selectedSize)
    setAdded(true)
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="Plated home">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-700"><Store size={23} /></span>
            <span><span className="block text-xl font-bold tracking-tight">Plated</span><span className="block text-xs text-stone-500">Freshly made, just for you</span></span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/account" aria-label="Customer account and order history" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-700 hover:border-orange-300 hover:bg-orange-50 sm:w-auto sm:gap-2 sm:px-3">
              <UserRound size={17} /><span className="hidden text-sm font-semibold sm:inline">Account</span>
            </Link>
            <Link to="/bag" className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-700">
              <ShoppingBag size={17} /> Bag <span className="rounded-full bg-white px-2 py-1 text-xs text-stone-900">{bagCount}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-orange-700">
          <ArrowLeft size={17} /> Back to menu
        </Link>
        <div className="mt-6 grid gap-8 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm md:grid-cols-2">
          <div className="flex min-h-64 items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 md:min-h-[420px]">
            {product.image ? <img src={product.image} alt={product.name} className="h-full w-full object-cover" /> : <span className="text-8xl" aria-hidden="true">🍽️</span>}
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">{category.name}</p>
            <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
            {product.description && <p className="mt-3 leading-6 text-stone-600">{product.description}</p>}

            <section className="mt-7" aria-labelledby="ingredients-title">
              <h2 id="ingredients-title" className="text-lg font-semibold">Main ingredients</h2>
              {product.ingredients?.length ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient) => (
                    <li key={ingredient} className="rounded-full bg-stone-100 px-3 py-1.5 text-sm text-stone-700">{ingredient}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-stone-500">Ingredient details are coming soon.</p>
              )}
            </section>

            <fieldset className="mt-7">
              <legend className="text-lg font-semibold">{product.productType === 'Drink' ? 'Choose volume' : 'Choose size'}</legend>
              <div className="mt-3 space-y-2">
                {sizes.map((size) => {
                  const key = String(size.id ?? size.name)
                  const selected = String(selectedSize?.id ?? selectedSize?.name) === key
                  return (
                    <label key={key} className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-4 transition ${selected ? 'border-orange-600 bg-orange-50' : 'border-stone-200 hover:border-stone-400'}`}>
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="product-size"
                          value={key}
                          checked={selected}
                          onChange={() => setSelectedSizeId(key)}
                          className="accent-orange-700"
                        />
                        <span className="font-medium">{size.name}</span>
                      </span>
                      <span className="font-semibold">{formatPrice(size.price)}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>

            <button
              type="button"
              onClick={handleAddToBag}
              disabled={soldOut}
              className="mt-6 w-full rounded-xl bg-orange-700 px-5 py-3.5 font-semibold text-white transition hover:bg-orange-800 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              {soldOut ? 'Currently unavailable' : `Add to bag · ${formatPrice(selectedSize?.price)}`}
            </button>
          </div>
        </div>
      </main>

      {added && (
        <div className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm" role="status" aria-live="polite">
          <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-white p-4 shadow-xl">
            <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-green-600" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-stone-900">Added to your bag</p>
              <p className="mt-1 text-sm text-stone-600">{product.name} · {selectedSize.name} · {formatPrice(selectedSize.price)}</p>
            </div>
            <button
              type="button"
              onClick={() => setAdded(false)}
              aria-label="Dismiss added to bag alert"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-900"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage
