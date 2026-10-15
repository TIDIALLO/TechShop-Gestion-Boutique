import { AlertTriangle } from "lucide-react"
export default function ConfirmModal({ open, onClose, onConfirm, title, message, confirmText = "Confirmer", danger = false, loading = false }) {
  if (!open) return null
  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-full ${danger ? "bg-red-100" : "bg-amber-100"}`}>
              <AlertTriangle className={`w-5 h-5 ${danger ? "text-red-600" : "text-amber-600"}`} />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
          </div>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex space-x-3 justify-end">
            <button onClick={onClose} className="btn-secondary" disabled={loading}>Annuler</button>
            <button onClick={onConfirm} disabled={loading}
              className={danger ? "btn-danger" : "btn-primary"}>
              {loading ? "Traitement…" : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}