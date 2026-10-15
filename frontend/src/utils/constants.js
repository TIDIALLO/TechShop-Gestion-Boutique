export const ROLES = {
  admin: {
    label: "Administrateur",
    color: "bg-purple-100 text-purple-800",
  },

  manager: {
    label: "Gestionnaire",
    color: "bg-blue-100 text-blue-800",
  },

  cashier: {
    label: "Caissier",
    color: "bg-green-100 text-green-800",
  },
}

export const SALE_STATUS = {
  pending: {
    label: "En attente",
    color: "bg-yellow-100 text-yellow-800",
  },

  completed: {
    label: "Complétée",
    color: "bg-green-100 text-green-800",
  },

  cancelled: {
    label: "Annulée",
    color: "bg-red-100 text-red-800",
  },

  refunded: {
    label: "Remboursée",
    color: "bg-gray-100 text-gray-800",
  },
}

export const PAYMENT_METHODS = {
  cash: {
    label: "Espèces",
    icon: "/payments/cash.webp",
  },

  wave: {
    label: "Wave",
    icon: "/payments/wave.webp",
  },

  orange_money: {
    label: "Orange Money",
    icon: "/payments/orange-money.webp",
  },

  transfer: {
    label: "Virement bancaire",
    icon: "/payments/bank.webp",
  },

  credit: {
    label: "Paiement à crédit",
    icon: "/payments/credit.avif",
  },

  card: {
    label: "Carte bancaire",
    icon: "/payments/credit.avif",
  },
}

export const MOVEMENT_TYPES = {
  in: {
    label: "Entrée",
    color: "bg-green-100 text-green-800",
  },

  out: {
    label: "Sortie",
    color: "bg-red-100 text-red-800",
  },

  adjustment: {
    label: "Ajustement",
    color: "bg-yellow-100 text-yellow-800",
  },
}