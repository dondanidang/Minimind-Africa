import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">MINIMINDS</h3>
            <p className="text-sm text-gray-600">
              Des jeux éducatifs sans écrans pour toute la famille.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">MENU</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Nos Jouets
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">INFORMATION</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Politique de confidentialité
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">CONTACT</h4>
            <p className="text-sm text-gray-600">
              <a href="mailto:miniminds.africa@gmail.com" className="hover:text-primary-600 transition-colors">
                miniminds.africa@gmail.com
              </a>
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()}, MINIMINDS. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

