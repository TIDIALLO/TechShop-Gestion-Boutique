import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Package, ShoppingCart, Check } from "lucide-react"
import { staggerItem } from "../motion/Stagger"

const formatPrice = price =>
  new Intl.NumberFormat("fr-FR").format(Number(price || 0))

const LOW_STOCK_THRESHOLD = 5

// Carte produit façon Jumia : toutes les cartes ont exactement la même taille.
// - zone image carrée à dimension fixe (la photo s'y adapte, jamais l'inverse)
// - nom sur 2 lignes réservées, prix, ligne de stock toujours présente
// - bouton « Ajouter au panier » qui apparaît au survol (sans changer la hauteur)
export default function ProductTile({ product, onAdd }) {
  const [justAdded, setJustAdded] = useState(false)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const handleAdd = () => {
    onAdd?.(product)
    setJustAdded(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setJustAdded(false), 1200)
  }

  const stock = Number(product.quantity || 0)
  const available = stock > 0
  const lowStock = available && stock <= LOW_STOCK_THRESHOLD

  return (
    <motion.article
      variants={staggerItem}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-md border border-transparent bg-white transition-[box-shadow,border-color] hover:border-[#f68b1e]/30 hover:shadow-[0_6px_18px_rgba(0,0,0,0.14)]"
    >
      {/* Zone image : carré fixe, l'image est contenue dedans quelle que soit sa forme */}
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-white">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            draggable="false"
            className="absolute inset-0 h-full w-full object-contain p-3 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f5f5f5]">
            <Package className="h-12 w-12 text-gray-300" />
          </div>
        )}

        {!available && (
          <span className="absolute left-2 top-2 rounded bg-[#313133] px-2 py-0.5 text-[11px] font-semibold text-white">
            Rupture
          </span>
        )}
        {lowStock && (
          <span className="absolute left-2 top-2 rounded bg-[#fdeede] px-2 py-0.5 text-[11px] font-semibold text-[#f68b1e]">
            Plus que {stock}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-1">
        <h3 className="line-clamp-2 h-10 text-[13px] leading-5 text-[#313133]" title={product.name}>
          {product.name}
        </h3>

        <p className="mt-1 text-base font-bold leading-6 text-[#313133]">
          {formatPrice(product.selling_price)} FCFA
        </p>

        {/* Zone d'action à hauteur fixe : « En stock » au repos, bouton au survol (toujours visible sur mobile) */}
        <div className="relative mt-auto h-10 pt-2">
          {available && (
            <p className="absolute inset-x-0 top-3 hidden items-center gap-1 text-[11px] font-medium text-emerald-600 transition-opacity duration-200 group-hover:opacity-0 md:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              En stock
            </p>
          )}
          <motion.button
            whileTap={{ scale: 0.96 }}
            type="button"
            disabled={!available}
            onClick={handleAdd}
            aria-label={`Ajouter ${product.name} au panier`}
            className="flex w-full items-center justify-center gap-2 rounded bg-[#f68b1e] py-2 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#e07b0e] focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#313133] disabled:cursor-not-allowed disabled:bg-gray-300 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:translate-y-0"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={justAdded ? "added" : "idle"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.12 }}
                className="flex items-center gap-2"
              >
                {justAdded ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                {justAdded ? "Ajouté !" : available ? "Ajouter au panier" : "Indisponible"}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}
