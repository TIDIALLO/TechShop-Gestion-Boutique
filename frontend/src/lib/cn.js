import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Fusionne des classes Tailwind sans conflit (convention shadcn/ui).
export const cn = (...inputs) => twMerge(clsx(inputs))
