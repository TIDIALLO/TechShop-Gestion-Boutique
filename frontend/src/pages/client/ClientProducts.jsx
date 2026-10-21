import { useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useSearchParams } from "react-router-dom"
import { ChevronRight, Package } from "lucide-react"
import StoreHeader from "../../components/store/StoreHeader"
import StoreFooter from "../../components/store/StoreFooter"
import ProductTile from "../../components/store/ProductTile"
import { StaggerGroup } from "../../components/motion/Stagger"
import CookieNotice from "../../components/store/CookieNotice"
import { useStoreCatalog } from "../../hooks/useStoreCatalog"
import { addToCart } from "../../store/slices/cartSlice"
import toast from "react-hot-toast"

const SORT_OPTIONS = [
  { value: "popular", label: "Popularité" },
  { value: "new", label: "Nouveautés" },
  { value: "price_asc", label: "Prix : croissant" },
  { value: "price_desc", label: "Prix : décroissant" },
]

export default function ClientProducts() {
  const dispatch = useDispatch()
  const cartItems = useSelector(state => state.cart.items || [])
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, categories, loading } = useStoreCatalog()

  const activeCategory = searchParams.get("category")
  const search = searchParams.get("search") || ""
  const sort = searchParams.get("sort") || "popular"

  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const updateParam = (key, value, replace = false) => {
    setSearchParams(
      previous => {
        const next = new URLSearchParams(previous)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace }
    )
  }

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()
    const min = minPrice === "" ? null : Number(minPrice)
    const max = maxPrice === "" ? null : Number(maxPrice)

    const list = products.filter(product => {
      const price = Number(product.selling_price || 0)

      const matchesSearch =
        !term ||
        product.name?.toLowerCase().includes(term) ||
        product.category_name?.toLowerCase().includes(term)

      const matchesCategory =
        !activeCategory || String(product.category) === String(activeCategory)

      const matchesPrice =
        (min === null || price >= min) && (max === null || price <= max)

      return matchesSearch && matchesCategory && matchesPrice
    })

    if (sort === "price_asc") list.sort((a, b) => a.selling_price - b.selling_price)
    else if (sort === "price_desc") list.sort((a, b) => b.selling_price - a.selling_price)
    else if (sort === "new") list.sort((a, b) => b.id - a.id)

    return list
  }, [products, search, activeCategory, minPrice, maxPrice, sort])

  const countFor = category =>
    products.filter(product => String(product.category) === String(category.id)).length

  const currentCategory = categories.find(
    category => String(category.id) === String(activeCategory)
  )

  const handleAddToCart = product => {
    const stock = Number(product.quantity || 0)
    if (stock <= 0) return

    const inCart = cartItems.find(item => item.id === product.id)
    if (inCart && inCart.cartQuantity >= stock) {
      toast.error("Quantité maximale en stock atteinte")
      return
    }

    dispatch(addToCart(product))
    toast.success(`${product.name} ajouté au panier`)
  }

  const chip = isActive =>
    `shrink-0 rounded-full border px-3 py-1.5 text-[13px] transition ${
      isActive
        ? "border-[#f68b1e] bg-[#f68b1e] text-white"
        : "border-[#d7d7da] bg-white text-[#55555a] hover:border-[#f68b1e]"
    }`

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f5] font-['Inter',sans-serif] text-[#313133]">
      <StoreHeader
        search={search}
        onSearchChange={value => updateParam("search", value, true)}
      />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-4">
        <nav aria-label="Fil d'Ariane" className="mb-3 flex items-center gap-1 text-xs text-[#75757a]">
          <Link to="/" className="hover:text-[#f68b1e]">Accueil</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className={currentCategory ? "" : "font-semibold text-[#313133]"}>
            Catalogue produits
          </span>
          {currentCategory && (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-semibold text-[#313133]">{currentCategory.name}</span>
            </>
          )}
        </nav>

        {/* Catégories en pastilles sur mobile */}
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          <button type="button" onClick={() => updateParam("category", "")} className={chip(!activeCategory)}>
            Tous
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              type="button"
              onClick={() => updateParam("category", String(category.id))}
              className={chip(String(activeCategory) === String(category.id))}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[230px_1fr]">
          {/* Filtres */}
          <aside className="hidden h-fit rounded-lg bg-white lg:block">
            <div className="border-b border-[#ededed] p-4">
              <h2 className="font-['Ubuntu',sans-serif] text-sm font-bold">Catégorie</h2>
              <ul className="mt-2 space-y-0.5">
                <li>
                  <button
                    type="button"
                    onClick={() => updateParam("category", "")}
                    className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-[13px] transition hover:bg-[#f5f5f5] ${
                      !activeCategory ? "font-semibold text-[#f68b1e]" : "text-[#55555a]"
                    }`}
                  >
                    Tous les produits
                    <span className="text-xs text-[#a9a9ad]">{products.length}</span>
                  </button>
                </li>
                {categories.map(category => {
                  const isActive = String(activeCategory) === String(category.id)
                  return (
                    <li key={category.id}>
                      <button
                        type="button"
                        onClick={() => updateParam("category", String(category.id))}
                        className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-[13px] transition hover:bg-[#f5f5f5] ${
                          isActive ? "font-semibold text-[#f68b1e]" : "text-[#55555a]"
                        }`}
                      >
                        {category.name}
                        <span className="text-xs text-[#a9a9ad]">{countFor(category)}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="p-4">
              <h2 className="font-['Ubuntu',sans-serif] text-sm font-bold">Prix (FCFA)</h2>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={minPrice}
                  onChange={event => setMinPrice(event.target.value)}
                  placeholder="Min"
                  aria-label="Prix minimum"
                  className="h-9 w-full rounded border border-[#d7d7da] px-2 text-sm focus:border-[#f68b1e] focus:outline-none"
                />
                <span className="text-[#a9a9ad]">-</span>
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={maxPrice}
                  onChange={event => setMaxPrice(event.target.value)}
                  placeholder="Max"
                  aria-label="Prix maximum"
                  className="h-9 w-full rounded border border-[#d7d7da] px-2 text-sm focus:border-[#f68b1e] focus:outline-none"
                />
              </div>
              {(minPrice !== "" || maxPrice !== "") && (
                <button
                  type="button"
                  onClick={() => { setMinPrice(""); setMaxPrice("") }}
                  className="mt-2 text-xs font-semibold text-[#f68b1e] hover:underline"
                >
                  Effacer le filtre de prix
                </button>
              )}
            </div>
          </aside>

          {/* Résultats */}
          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white px-4 py-3">
              <div>
                <h1 className="font-['Ubuntu',sans-serif] text-lg font-bold">
                  {currentCategory ? currentCategory.name : "Catalogue produits"}
                </h1>
                <p className="text-xs text-[#75757a]">
                  {loading
                    ? "Chargement des produits..."
                    : `${filteredProducts.length} produit${filteredProducts.length > 1 ? "s" : ""} trouvé${filteredProducts.length > 1 ? "s" : ""}`}
                </p>
              </div>

              <label className="flex items-center gap-2 text-[13px] text-[#55555a]">
                Trier par
                <select
                  value={sort}
                  onChange={event => updateParam("sort", event.target.value === "popular" ? "" : event.target.value)}
                  className="h-9 rounded border border-[#d7d7da] bg-white px-2 text-[13px] text-[#313133] focus:border-[#f68b1e] focus:outline-none"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4" aria-busy="true">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-md bg-white p-3">
                    <div className="aspect-square rounded bg-[#ededed]" />
                    <div className="mt-3 h-3 w-4/5 rounded bg-[#ededed]" />
                    <div className="mt-2 h-4 w-1/2 rounded bg-[#ededed]" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-lg bg-white p-12 text-center">
                <Package className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-4 text-sm text-[#75757a]">Aucun produit trouvé.</p>
              </div>
            ) : (
              <StaggerGroup key={filteredProducts.length} delay={0.03} className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map(product => (
                  <ProductTile key={product.id} product={product} onAdd={handleAddToCart} />
                ))}
              </StaggerGroup>
            )}
          </section>
        </div>
      </main>

      <StoreFooter />
      <CookieNotice />
    </div>
  )
}
