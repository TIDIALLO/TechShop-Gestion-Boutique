import { Plus } from "lucide-react"
import { formatCurrency } from "../../utils/formatters"

export default function ProductCard({ product, onAdd }) {
  console.log("Nom :", product.name)
  console.log("Image :", product.image)
  console.log("Produit complet :", product)

  const image =
    product.image
      ? (
          product.image.startsWith("http")
            ? product.image
            : `http://localhost:8000${product.image}`
        )
      : null

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition duration-300 overflow-hidden">
      <div className="h-52 bg-gray-100 flex items-center justify-center">
        <img
          src={image || "/images/no-product.png"}
          alt={product.name}
          className="w-full h-52 object-cover"
          onError={(e) => {
            e.target.src = "/images/no-product.png"
          }}
        />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-800">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {product.reference}
        </p>

        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-xl font-bold text-blue-700">
              {formatCurrency(product.selling_price)}
            </p>

            <span className="text-green-600 text-sm">
              Stock : {product.quantity}
            </span>
          </div>

          <button
            onClick={() => onAdd(product)}
            className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
          >
            <Plus size={22} />
          </button>
        </div>
      </div>
    </div>
  )
}
