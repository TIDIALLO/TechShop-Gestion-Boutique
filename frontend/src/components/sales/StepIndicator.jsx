const steps = [
  "Panier",
  "Client",
  "Livraison",
  "Paiement",
  "Résumé",
]

export default function StepIndicator({ currentStep = 1 }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5 mb-6">
      <div className="flex items-center justify-between">

        {steps.map((step, index) => {

          const number = index + 1

          const active = number === currentStep

          const completed = number < currentStep

          return (
            <div
              key={step}
              className="flex-1 flex items-center"
            >

              <div className="flex flex-col items-center">

                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-bold transition-all
                  ${
                    completed
                      ? "bg-green-500 text-white"
                      : active
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {completed ? "✓" : number}
                </div>

                <span
                  className={`mt-2 text-sm font-medium ${
                    active
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  {step}
                </span>

              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 h-1 bg-gray-200 mx-3 rounded-full" />
              )}

            </div>
          )
        })}

      </div>
    </div>
  )
}