import { Link } from "react-router-dom"
import { Mail, MapPin, Phone } from "lucide-react"

export default function StoreFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">
            TechShop <span className="text-accent-500">Electronics</span>
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Votre boutique en ligne d'électronique : téléphones, informatique,
            électroménager et accessoires.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-accent-500 transition">Accueil</Link>
            </li>
            <li>
              <Link to="/client/products" className="hover:text-accent-500 transition">Nos produits</Link>
            </li>
            <li>
              <Link to="/client/cart" className="hover:text-accent-500 transition">Mon panier</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-accent-500 transition">Se connecter</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Moyens de paiement</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Espèces à la livraison</li>
            <li>Orange Money</li>
            <li>Wave</li>
            <li>Carte bancaire</li>
            <li>Virement bancaire</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 shrink-0" />
              Dakar, Sénégal
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0" />
              <a href="tel:+221000000000" className="hover:text-accent-500 transition">
                +221 00 000 00 00
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0" />
              <a href="mailto:contact@techshop-electronics.com" className="hover:text-accent-500 transition">
                contact@techshop-electronics.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} TechShop Electronics. Tous droits réservés.
      </div>
    </footer>
  )
}
