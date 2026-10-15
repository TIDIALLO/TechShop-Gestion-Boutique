import { Plus, Minus, Trash2 } from "lucide-react"
import { formatCurrency } from "../../utils/formatters"

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onDelete,
}) {

  return (

    <div className="flex items-center gap-3 border-b border-gray-200 pb-3">

      <div className="flex-1">

        <h4 className="font-semibold text-gray-800">
          {item.name}
        </h4>

        <p className="text-sm text-gray-500">
          {formatCurrency(item.unit_price)}
        </p>

      </div>

      <div className="flex items-center gap-2">

        <button
          onClick={() => onDecrease(item.product_id)}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
        >
          <Minus size={16} />
        </button>

        <span className="w-8 text-center font-bold">
          {item.quantity}
        </span>

        <button
          onClick={() => onIncrease(item.product_id)}
          className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
        >
          <Plus size={16} />
        </button>

      </div>

      <div className="w-24 text-right font-bold text-blue-700">

        {formatCurrency(item.quantity * item.unit_price)}

      </div>

      <button
        onClick={() => onDelete(item.product_id)}
        className="text-red-600 hover:text-red-700"
      >
        <Trash2 size={18} />
      </button>

    </div>

  )

}