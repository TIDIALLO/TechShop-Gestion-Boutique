import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
export default function SearchInput({ value = "", onChange, placeholder = "Rechercher…", className = "" }) {
  const [local, setLocal] = useState(value)
  useEffect(() => { const t = setTimeout(() => onChange(local), 400); return () => clearTimeout(t) }, [local])
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input value={local} onChange={e => setLocal(e.target.value)}
        placeholder={placeholder}
        className="input pl-9 pr-8" />
      {local && <button onClick={() => { setLocal(""); onChange("") }}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
        <X className="w-4 h-4" />
      </button>}
    </div>
  )
}