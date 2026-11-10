import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const MenuProductCard = ({ product, categoryName, compact = false }) => {
  const soldOut = Number.isFinite(Number(product.stock)) && Number(product.stock) <= 0
  const sizePrices = product.sizes?.map((size) => Number(size.price)).filter(Number.isFinite) || []
  const startingPrice = sizePrices.length ? Math.min(...sizePrices) : Number(product.price || 0)

  return (
    <article className={`flex min-w-0 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm ${compact ? 'aspect-square' : ''}`}>
      <div className={`flex shrink-0 items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 ${compact ? 'min-h-0 flex-1' : 'h-36'}`}>
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-5xl" aria-hidden="true">🍽️</span>
        )}
      </div>
      <div className={`flex min-h-0 flex-col ${compact ? 'p-2.5 sm:p-3' : 'flex-1 p-4'}`}>
        <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-orange-700 sm:text-xs">
          {categoryName || 'Menu'}
        </p>
        <h3 className={`mt-0.5 line-clamp-2 font-semibold ${compact ? 'text-sm leading-5 sm:text-base' : 'text-lg'}`}>{product.name}</h3>
        {!compact && product.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-5 text-stone-500">{product.description}</p>
        )}
        <div className={`mt-auto flex items-center justify-between gap-1 ${compact ? 'pt-2' : 'gap-3 pt-5'}`}>
          <span className={`min-w-0 truncate font-bold ${compact ? 'text-xs sm:text-sm' : ''}`}>From PKR {startingPrice.toLocaleString()}</span>
          <Link
            to={`/product/${product.id}`}
            aria-label={`View details for ${product.name}`}
            className={`inline-flex shrink-0 items-center gap-1 rounded-full bg-orange-700 font-semibold text-white transition hover:bg-orange-800 ${compact ? 'px-2 py-1.5 text-[10px] sm:px-2.5 sm:text-xs' : 'px-4 py-2 text-sm'}`}
          >
            {soldOut ? 'Unavailable' : compact ? 'View' : 'View details'} <ArrowRight size={compact ? 12 : 16} />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default MenuProductCard
