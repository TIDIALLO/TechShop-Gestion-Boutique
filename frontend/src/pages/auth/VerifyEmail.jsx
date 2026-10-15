import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { authService } from "../../services/authService"
import StoreHeader from "../../components/store/StoreHeader"
import StoreFooter from "../../components/store/StoreFooter"

// Page ouverte depuis le lien du mail de confirmation
export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const [state, setState] = useState(token ? "loading" : "error")
  const [message, setMessage] = useState(token ? "" : "Lien de confirmation invalide.")

  useEffect(() => {
    if (!token) return
    let active = true

    authService
      .verifyEmail(token)
      .then(() => {
        if (!active) return
        setState("success")
        setMessage("Votre adresse e-mail est confirmée. Merci !")
      })
      .catch(error => {
        if (!active) return
        setState("error")
        setMessage(error.response?.data?.error || "Impossible de confirmer votre compte.")
      })

    return () => { active = false }
  }, [token])

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f5]">
      <StoreHeader showSearch={false} showCategories={false} />

      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-sm">
          {state === "loading" && (
            <>
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#f68b1e]" />
              <p className="mt-4 text-[#55555a]">Confirmation en cours...</p>
            </>
          )}

          {state === "success" && (
            <>
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
              <h1 className="mt-4 text-xl font-bold text-[#313133]">Compte confirmé</h1>
              <p className="mt-2 text-sm text-[#55555a]">{message}</p>
            </>
          )}

          {state === "error" && (
            <>
              <XCircle className="mx-auto h-12 w-12 text-red-500" />
              <h1 className="mt-4 text-xl font-bold text-[#313133]">Confirmation impossible</h1>
              <p className="mt-2 text-sm text-[#55555a]">{message}</p>
            </>
          )}

          {state !== "loading" && (
            <div className="mt-6 flex flex-col gap-2">
              <Link
                to="/login"
                className="rounded bg-[#f68b1e] py-2.5 text-sm font-semibold text-white transition hover:bg-[#e07b0e]"
              >
                Se connecter
              </Link>
              <Link to="/" className="text-sm font-medium text-[#f68b1e] hover:underline">
                Retour à l'accueil
              </Link>
            </div>
          )}
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}
