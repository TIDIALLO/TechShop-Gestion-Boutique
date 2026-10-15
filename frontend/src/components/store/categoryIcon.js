import {
  Smartphone, Laptop, Headphones, Wifi, Mouse, Tv, Package,
} from "lucide-react"

// Les icônes emoji enregistrées en base ne s'affichent pas toujours correctement :
// on associe une icône à chaque catégorie d'après son nom.
export function categoryIcon(name = "") {
  const n = name.toLowerCase()

  if (/(smart|t[ée]l[ée]ph|phone|mobile|tablet)/.test(n)) return Smartphone
  if (/(ordi|laptop|\bpc\b|inform)/.test(n)) return Laptop
  if (/(audio|casque|son\b|enceinte)/.test(n)) return Headphones
  if (/(r[ée]seau|wifi|routeur)/.test(n)) return Wifi
  if (/(accessoire|souris|clavier)/.test(n)) return Mouse
  if (/(tv|vid[ée]o|[ée]cran)/.test(n)) return Tv

  return Package
}
