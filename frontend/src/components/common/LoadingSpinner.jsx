export default function LoadingSpinner({ size = "md", text = "Chargement..." }) {
  const s = { sm:"w-5 h-5", md:"w-8 h-8", lg:"w-14 h-14" }[size]
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-3">
      <div className={`${s} border-4 border-primary-100 border-t-primary-700 rounded-full animate-spin`} />
      {text && <p className="text-gray-400 text-sm">{text}</p>}
    </div>
  )
}