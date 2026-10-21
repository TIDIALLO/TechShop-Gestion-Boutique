import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Package, ShoppingCart, Check } from "lucide-react"
import { staggerItem } from "../motion/Stagger"

const formatPrice = price =>
  new Intl.NumberFormat("fr-FR").format(Number(price || 0))

// Carte produit façon Jumia : image carrée, nom sur 2 lignes, prix en gras,
// stock restant en orange et bouton « Ajouter au panier ».
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
  const lowStock = available && stock <= 5

  return (
    <motion.article variants={staggerItem} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className="group relative flex h-full flex-col overflow-hidden rounded-md bg-white transition-shadow hover:shadow-[0_6px_18px_rgba(0,0,0,0.16)]">
      <div className="flex aspect-square items-center justify-center bg-white p-3">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
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

        <motion.button
          whileTap={{ scale: 0.95 }}
          type="button"
          disabled={!available}
          onClick={handleAdd}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded bg-[#f68b1e] py-2 text-[13px] font-semibold text-white transition hover:bg-[#e07b0e] focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#313133] disabled:cursor-not-allowed disabled:bg-gray-300 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={justAdded ? "added" : "idle"}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.12 }}
              className="flex items-center gap-2"
            >
              {justAdded ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
              {justAdded ? "Ajouté !" : available ? "Ajouter au panier" : "Indisponible"}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.article>
  )
}
