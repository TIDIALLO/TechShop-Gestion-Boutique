import { Search } from "lucide-react"
import ProductCard from "./ProductCard"

export default function ProductSearch({
  search,
  setSearch,
  products,
  onAdd,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">

      <h2 className="text-lg font-bold mb-4">
        Rechercher un produit
      </h2>

      <div className="relative mb-5">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nom, référence ou code-barres..."
          className="w-full border rounded-xl pl-10 pr-4 py-3"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={onAdd}
          />
        ))}
      </div>

    </div>
  )
}