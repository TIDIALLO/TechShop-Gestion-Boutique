import { useEffect, useState } from "react"
import { productsService } from "../services/productsService"

// Catalogue public partagé entre l'en-tête, l'accueil et le catalogue :
// une seule requête, mise en cache 20 secondes.
const TTL = 20000
let cache = null
let inflight = null

async function fetchAllProducts() {
  let res = await productsService.getClientProducts({ page_size: 100 })
  let all = res.data.results || res.data || []
  let page = 1

  while (res.data.next && page < 20) {
    page += 1
    res = await productsService.getClientProducts({ page_size: 100, page })
    all = all.concat(res.data.results || [])
  }

  return all
}

function loadCatalog() {
  if (cache && Date.now() - cache.at < TTL) return Promise.resolve(cache)

  if (!inflight) {
    inflight = Promise.all([fetchAllProducts(), productsService.getCategories()])
      .then(([products, categoriesRes]) => {
        const categories = (categoriesRes.data.results || categoriesRes.data || [])
          .filter(category => category.is_active !== false)

        cache = { at: Date.now(), products, categories }
        return cache
      })
      .finally(() => {
        inflight = null
      })
  }

  return inflight
}

export function useStoreCatalog() {
  const [state, setState] = useState({
    products: cache?.products || [],
    categories: cache?.categories || [],
    loading: !cache,
    error: false,
  })

  useEffect(() => {
    let isMounted = true

    loadCatalog()
      .then(data => {
        if (isMounted) {
          setState({
            products: data.products,
            categories: data.categories,
            loading: false,
            error: false,
          })
        }
      })
      .catch(error => {
        console.error("Erreur chargement du catalogue :", error)
        if (isMounted) {
          setState({ products: [], categories: [], loading: false, error: true })
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return state
}
