import { useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { ArrowRight, ChevronLeft, ChevronRight, Package } from "lucide-react"
import toast from "react-hot-toast"

import StoreHeader from "../../components/store/StoreHeader"
import StoreFooter from "../../components/store/StoreFooter"
import HeroCarousel from "../../components/store/HeroCarousel"
import ProductTile from "../../components/store/ProductTile"
import { StaggerGroup } from "../../components/motion/Stagger"
import CookieNotice from "../../components/store/CookieNotice"
import { categoryIcon } from "../../components/store/categoryIcon"
import { useStoreCatalog } from "../../hooks/useStoreCatalog"
import { addToCart } from "../../store/slices/cartSlice"

const formatPrice = price =>
  new Intl.NumberFormat("fr-FR").format(Number(price || 0))

// Dégradés orange/jaune des bannières (comme sur Jumia) et bannière sombre
const BANNER_BACKGROUNDS = [
  "linear-gradient(100deg,#f68b1e 0%,#f9a825 55%,#fbc02d 100%)",
  "linear-gradient(100deg,#f57c00 0%,#f9a11b 60%,#ffc233 100%)",
  "linear-gradient(100deg,#ee7312 0%,#f6921e 55%,#fdb934 100%)",
]
const DARK_BACKGROUND = "linear-gradient(120deg,#17172e 0%,#25254d 100%)"

const CATEGORY_TILE_COLORS = ["#7a69ee", "#2f93d8", "#de4f7c", "#12998b"]

const PAYMENT_LOGOS = [
  { label: "Wave", src: "/payments/wave.webp" },
  { label: "Orange Money", src: "/payments/orange-money.webp" },
  { label: "Carte bancaire", src: "/payments/credit.avif" },
]

// Rangée de produits qui défile horizontalement (flèches sur ordinateur)
function ProductRow({ items, onAdd }) {
  const rowRef = useRef(null)

  const scroll = direction => {
    const row = rowRef.current
    if (row) row.scrollBy({ left: direction * row.clientWidth * 0.8, behavior: "smooth" })
  }

  return (
    <div className="group/row relative">
      <div
        ref={rowRef}
        className="flex snap-x gap-2 overflow-x-auto scroll-smooth p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map(product => (
          <div key={product.id} className="w-[160px] shrink-0 snap-start sm:w-[185px]">
            <ProductTile product={product} onAdd={onAdd} />
          </div>
        ))}
      </div>

      {items.length > 5 && (
        <>
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Produits précédents"
            className="absolute left-1 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition hover:bg-[#f5f5f5] md:flex"
          >
            <ChevronLeft className="h-5 w-5 text-[#313133]" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Produits suivants"
            className="absolute right-1 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition hover:bg-[#f5f5f5] md:flex"
          >
            <ChevronRight className="h-5 w-5 text-[#313133]" />
          </button>
        </>
      )}
    </div>
  )
}

// Bloc de produits avec son bandeau de titre et « Voir tout »
function Section({ title, to, solid = false, accent, icon: Icon, children }) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div
        className={`flex items-center justify-between px-4 py-3 ${
          solid ? "bg-[#f68b1e] text-white" : "border-b border-[#ededed] text-[#313133]"
        }`}
        style={!solid && accent ? { boxShadow: `inset 4px 0 0 ${accent}` } : undefined}
      >
        <h2 className="flex items-center gap-2 font-['Ubuntu',sans-serif] text-[17px] font-bold">
          {Icon && <Icon className="h-5 w-5" />}
          {title}
        </h2>

        <Link
          to={to}
          className={`flex items-center gap-1 text-[13px] font-semibold ${
            solid ? "text-white hover:underline" : "text-[#f68b1e] hover:underline"
          }`}
        >
          Voir tout
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      {children}
    </section>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" aria-busy="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-md bg-white p-3">
          <div className="aspect-square rounded bg-[#ededed]" />
          <div className="mt-3 h-3 w-4/5 rounded bg-[#ededed]" />
          <div className="mt-2 h-4 w-1/2 rounded bg-[#ededed]" />
        </div>
      ))}
    </div>
  )
}

export default function HomePage() {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const cartItems = useSelector(state => state.cart.items || [])
  const { products, categories, loading } = useStoreCatalog()

  const [search, setSearch] = useState("")

  const isStaff = ["admin", "manager", "cashier"].includes(user?.role)
  const term = search.trim().toLowerCase()

  const productsOf = category =>
    products.filter(product => String(product.category) === String(category.id))

  const categoriesWithProducts = useMemo(
    () =>
      categories.filter(category =>
        products.some(product => String(product.category) === String(category.id))
      ),
    [categories, products]
  )

  const newest = useMemo(
    () => [...products].sort((a, b) => b.id - a.id).slice(0, 12),
    [products]
  )

  const searchResults = useMemo(() => {
    if (!term) return []
    return products.filter(
      product =>
        product.name?.toLowerCase().includes(term) ||
        product.category_name?.toLowerCase().includes(term)
    )
  }, [products, term])

  // Bannières du carrousel construites à partir des vrais produits de la boutique
  const slides = useMemo(() => {
    const imagesOf = list => list.filter(p => p.image).slice(0, 3).map(p => p.image)

    const featured = categoriesWithProducts
      .map(category => productsOf(category).find(product => product.image))
      .filter(Boolean)

    const categorySlide = (category, i) => {
      const list = productsOf(category)
      const cheapest = Math.min(...list.map(p => Number(p.selling_price || 0)))

      return {
        key: `category-${category.id}`,
        background: BANNER_BACKGROUNDS[(i + 1) % BANNER_BACKGROUNDS.length],
        tag: category.name,
        title: `${category.name}\nau meilleur prix !`,
        pill: `À partir de ${formatPrice(cheapest)} FCFA`,
        images: imagesOf(list),
        to: `/client/products?category=${category.id}`,
      }
    }

    const categorySlides = categoriesWithProducts.slice(0, 3).map(categorySlide)

    const welcome = {
      key: "welcome",
      background: BANNER_BACKGROUNDS[0],
      tag: "TechShop Electronics",
      title: "L'électronique\nà petits prix !",
      pill: products.length ? `${products.length} produits en stock` : "Livraison partout au Sénégal",
      images: featured.slice(0, 3).map(p => p.image),
      to: "/client/products",
    }

    const payment = {
      key: "payment",
      theme: "dark",
      align: "center",
      background: DARK_BACKGROUND,
      title: "Payez comme vous voulez",
      pill: "Wave, Orange Money ou carte bancaire",
      logos: PAYMENT_LOGOS,
      to: "/client/products",
    }

    return [welcome, categorySlides[0], payment, ...categorySlides.slice(1)].filter(Boolean)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesWithProducts, products])

  // Petites tuiles colorées sous la bannière
  const tiles = useMemo(() => {
    const firstImage = list => list.find(p => p.image)?.image

    const list = [
      isAuthenticated
        ? {
            key: "account",
            title: isStaff ? "Mon espace" : "Mon compte",
            sub: `Salut, ${user?.first_name || user?.username || ""}`,
            to: isStaff ? "/dashboard" : "/client",
            bg: "#f9c01d",
            darkText: true,
          }
        : {
            key: "signup",
            title: "Créer un compte",
            sub: "Mail de confirmation",
            to: "/register",
            bg: "#f9c01d",
            darkText: true,
          },
      { key: "all", title: "Tous les produits", to: "/client/products", bg: "#f26b21" },
    ]

    categoriesWithProducts.slice(0, 4).forEach((category, i) => {
      list.push({
        key: `category-${category.id}`,
        title: category.name,
        to: `/client/products?category=${category.id}`,
        bg: CATEGORY_TILE_COLORS[i % CATEGORY_TILE_COLORS.length],
        image: firstImage(productsOf(category)),
      })
    })

    list.push({
      key: "new",
      title: "Nouveautés",
      to: "/client/products?sort=new",
      bg: "#a8e0c9",
      darkText: true,
      image: firstImage(newest),
    })

    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isStaff, user, categoriesWithProducts, newest])

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

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f5] font-['Inter',sans-serif] text-[#313133]">
      <StoreHeader search={search} onSearchChange={setSearch} />

      <main className="mx-auto w-full max-w-[1200px] flex-1 space-y-4 px-4 py-4">
        {term ? (
          <Section title={`Résultats pour « ${search.trim()} »`} to="/client/products">
            {searchResults.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-4 text-sm text-[#75757a]">Aucun produit trouvé.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {searchResults.map(product => (
                  <ProductTile key={product.id} product={product} onAdd={handleAddToCart} />
                ))}
              </div>
            )}
          </Section>
        ) : (
          <>
            <HeroCarousel slides={slides.length ? slides : [{
              key: "default",
              background: BANNER_BACKGROUNDS[0],
              tag: "TechShop Electronics",
              title: "L'électronique\nà petits prix !",
              pill: "Livraison partout au Sénégal",
              to: "/client/products",
            }]} />

            {/* Tuiles de raccourcis */}
            <div className="grid auto-cols-[140px] grid-flow-col gap-3 overflow-x-auto pb-1 [scrollbar-width:none] md:auto-cols-fr [&::-webkit-scrollbar]:hidden">
              {tiles.map(tile => (
                <Link
                  key={tile.key}
                  to={tile.to}
                  className="relative block h-[92px] overflow-hidden rounded-lg p-3 transition hover:brightness-95"
                  style={{ background: tile.bg }}
                >
                  <span
                    className={`flex items-center justify-between gap-1 font-['Ubuntu',sans-serif] text-[14px] font-bold leading-tight ${
                      tile.darkText ? "text-[#313133]" : "text-white"
                    }`}
                  >
                    {tile.title}
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                  </span>
                  {tile.sub && (
                    <span className="mt-1 block max-w-[80%] truncate text-[11px] text-[#313133]/80">
                      {tile.sub}
                    </span>
                  )}
                  {tile.image && (
                    <img
                      src={tile.image}
                      alt=""
                      loading="lazy"
                      className="absolute -bottom-1 right-1.5 h-[56px] w-[56px] rounded-md bg-white object-contain p-1 shadow"
                    />
                  )}
                </Link>
              ))}
            </div>

            {loading ? (
              <SkeletonGrid />
            ) : products.length === 0 ? (
              <div className="rounded-lg bg-white p-12 text-center">
                <Package className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-4 text-sm text-[#75757a]">Aucun produit disponible pour le moment.</p>
              </div>
            ) : (
              <>
                <Section title="Nouveaux arrivages" to="/client/products?sort=new" solid>
                  <ProductRow items={newest} onAdd={handleAddToCart} />
                </Section>

                {categoriesWithProducts.map(category => (
                  <Section
                    key={category.id}
                    title={category.name}
                    to={`/client/products?category=${category.id}`}
                    accent={category.color}
                    icon={categoryIcon(category.name)}
                  >
                    <ProductRow items={productsOf(category).slice(0, 12)} onAdd={handleAddToCart} />
                  </Section>
                ))}

                <Section title="Tous nos produits" to="/client/products">
                  <StaggerGroup delay={0.03} className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {products.slice(0, 12).map(product => (
                      <ProductTile key={product.id} product={product} onAdd={handleAddToCart} />
                    ))}
                  </StaggerGroup>
                  {products.length > 12 && (
                    <div className="border-t border-[#ededed] p-3 text-center">
                      <Link
                        to="/client/products"
                        className="inline-flex items-center gap-2 rounded bg-[#f68b1e] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e07b0e]"
                      >
                        Voir tous les produits
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </Section>
              </>
            )}
          </>
        )}
      </main>

      <StoreFooter />
      <CookieNotice />
    </div>
  )
}
