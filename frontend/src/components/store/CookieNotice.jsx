import { useState } from "react"

const COOKIE_NAME = "techshop_cookies"

const hasAccepted = () =>
  typeof document !== "undefined" &&
  document.cookie.split("; ").some(row => row.startsWith(`${COOKIE_NAME}=`))

// Bandeau « Ce site web utilise des cookies » (bas gauche), comme sur Jumia.
export default function CookieNotice() {
  const [visible, setVisible] = useState(() => !hasAccepted())

  if (!visible) return null

  const accept = () => {
    document.cookie = `${COOKIE_NAME}=1; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax`
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-label="Cookies"
      className="fixed bottom-4 left-4 z-50 w-[calc(100vw-2rem)] max-w-[330px] rounded-lg bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.22)]"
    >
      <h2 className="font-['Ubuntu',sans-serif] text-[15px] font-bold text-[#313133]">
        Ce site web utilise des cookies
      </h2>
      <p className="mt-1.5 text-xs leading-relaxed text-[#75757a]">
        Nous utilisons des cookies pour mémoriser votre panier et améliorer votre
        expérience sur TechShop Electronics.
      </p>
      <button
        type="button"
        onClick={accept}
        className="mt-3 w-full rounded bg-[#f68b1e] py-2 text-[13px] font-semibold text-white transition hover:bg-[#e07b0e]"
      >
        Accepter les cookies
      </button>
    </div>
  )
}
