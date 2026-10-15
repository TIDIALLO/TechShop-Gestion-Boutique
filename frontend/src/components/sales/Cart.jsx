import { ShoppingCart } from "lucide-react"
import CartItem from "./CartItem"

export default function Cart({
  cart,
  onIncrease,
  onDecrease,
  onDelete,
}) {

  return (

    <div className="bg-white rounded-2xl shadow border border-gray-200 p-5">

      <div className="flex items-center gap-2 mb-5">

        <ShoppingCart size={22} />

        <h2 className="font-bold text-lg">
          Panier
        </h2>

      </div>

      {cart.length === 0 ? (

        <div className="text-center text-gray-400 py-10">

          Aucun produit dans le panier

        </div>

      ) : (

        <div className="space-y-4">

          {cart.map(item => (

            <CartItem
              key={item.product_id}
              item={item}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onDelete={onDelete}
            />

          ))}

        </div>

      )}

    </div>

  )

}