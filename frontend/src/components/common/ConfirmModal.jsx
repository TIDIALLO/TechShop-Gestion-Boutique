import { AlertTriangle } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
export default function ConfirmModal({ open, onClose, onConfirm, title, message, confirmText = "Confirmer", danger = false, loading = false }) {
  return (
    <AnimatePresence>
      {open && (
    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={loading ? undefined : onClose}>
      <motion.div className="modal max-w-md" role="dialog" aria-modal="true" aria-label={title}
        initial={{ opacity: 0, scale: 0.92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }} onClick={e => e.stopPropagation()}>
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
      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  )
}