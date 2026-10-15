import { Package, ShoppingCart } from "lucide-react"

const formatPrice = price =>
  new Intl.NumberFormat("fr-FR").format(Number(price || 0))

// Carte produit façon Jumia : image carrée, nom sur 2 lignes, prix en gras,
// stock restant en orange et bouton « Ajouter au panier ».
export default function ProductTile({ product, onAdd }) {
  const stock = Number(product.quantity || 0)
  const available = stock > 0
  const lowStock = available && stock <= 5

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-md bg-white transition-shadow hover:shadow-[0_6px_18px_rgba(0,0,0,0.16)]">
      <div className="flex aspect-square items-center justify-center bg-white p-3">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain"
          />
        ) : (
          <Package className="h-12 w-12 text-gray-300" />
        )}
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-[13px] leading-5 text-[#313133]">
          {product.name}
        </h3>

        <p className="mt-1 text-[15px] font-bold text-[#313133]">
          {formatPrice(product.selling_price)} FCFA
        </p>

        <p className="mt-0.5 h-4 text-[11px] text-[#f68b1e]">
          {lowStock ? `${stock} unité${stock > 1 ? "s" : ""} restante${stock > 1 ? "s" : ""}` : ""}
        </p>

        <button
          type="button"
          disabled={!available}
          onClick={() => onAdd?.(product)}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded bg-[#f68b1e] py-2 text-[13px] font-semibold text-white transition hover:bg-[#e07b0e] focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#313133] disabled:cursor-not-allowed disabled:bg-gray-300 md:opacity-0 md:group-hover:opacity-100"
        >
          <ShoppingCart className="h-4 w-4" />
          {available ? "Ajouter au panier" : "Indisponible"}
        </button>
      </div>
    </article>
  )
}
