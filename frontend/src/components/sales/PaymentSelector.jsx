import { PAYMENT_METHODS } from "../../utils/constants"

export default function PaymentSelector({
  paymentMethod,
  setPaymentMethod,
}) {

  return (

    <div className="bg-white rounded-2xl shadow border border-gray-200 p-5">

      <h2 className="text-lg font-bold mb-4">
        Mode de paiement
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {Object.entries(PAYMENT_METHODS).map(([key, method]) => (

          <button
            key={key}
            type="button"
            onClick={() => setPaymentMethod(key)}
            className={`rounded-2xl border-2 p-4 transition

              ${
                paymentMethod === key
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }

            `}
          >

            <div className="flex flex-col items-center">

              <img
                src={method.icon}
                alt={method.label}
                className="h-12 object-contain mb-3"
              />

              <span className="font-semibold">

                {method.label}

              </span>

            </div>

          </button>

        ))}

      </div>

    </div>

  )

}