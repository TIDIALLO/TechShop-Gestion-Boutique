import { formatCurrency } from "../../utils/formatters"

export default function SaleSummary({
  subtotal,
  discount,
  tax,
  total,
  amountPaid,
  setAmountPaid,
}) {

  const remaining = Math.max(0, total - amountPaid)
  const change = Math.max(0, amountPaid - total)

  return (

    <div className="bg-white rounded-2xl shadow border border-gray-200 p-5">

      <h2 className="text-lg font-bold mb-5">
        Résumé de la vente
      </h2>

      <div className="space-y-3">

        <div className="flex justify-between">
          <span>Sous-total</span>
          <strong>{formatCurrency(subtotal)}</strong>
        </div>

        <div className="flex justify-between">
          <span>Remise</span>
          <strong>- {formatCurrency(discount)}</strong>
        </div>

        <div className="flex justify-between">
          <span>TVA</span>
          <strong>{formatCurrency(tax)}</strong>
        </div>

        <hr />

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span className="text-blue-700">
            {formatCurrency(total)}
          </span>
        </div>

        <div className="pt-4">

          <label className="block text-sm font-medium mb-2">
            Montant reçu
          </label>

          <input
            type="number"
            value={amountPaid}
            onChange={(e) =>
              setAmountPaid(Number(e.target.value) || 0)
            }
            className="input"
          />

        </div>

        {amountPaid < total ? (

          <div className="mt-4 rounded-lg bg-yellow-50 p-4">

            <div className="flex justify-between">

              <span>Reste à payer</span>

              <strong className="text-orange-600">
                {formatCurrency(remaining)}
              </strong>

            </div>

          </div>

        ) : (

          <div className="mt-4 rounded-lg bg-green-50 p-4">

            <div className="flex justify-between">

              <span>Monnaie à rendre</span>

              <strong className="text-green-600">
                {formatCurrency(change)}
              </strong>

            </div>

          </div>

        )}

      </div>

    </div>

  )

}