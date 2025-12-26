'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'

export function Header() {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const pathname = usePathname()
  const itemCount = useCartStore(state => state.getItemCount())
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      {/* Purple Top Bar */}
      <div className="bg-primary-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center text-sm">
            <span className="font-bold">Livraison gratuite à Abidjan →</span>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto relative flex h-28 items-center justify-between px-4">
          {/* Left side: Hamburger (Mobile) + Logo (Desktop) */}
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu Button - Mobile only */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>

            {/* Logo - Desktop only, on the left */}
            <Link href="/" className="hidden md:flex items-center">
              {!logoError ? (
                <Image
                  src="/logo.png"
                  alt="MINIMINDS"
                  width={300}
                  height={100}
                  className="h-24 w-auto"
                  priority
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="text-5xl font-bold text-gray-900">MINIMINDS</span>
              )}
            </Link>
          </div>
        
          {/* Center: Logo (Mobile) + Desktop Navigation */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            {/* Logo - Mobile only, centered */}
            <Link href="/" className="md:hidden flex items-center">
              {!logoError ? (
                <Image
                  src="/logo.png"
                  alt="MINIMINDS"
                  width={300}
                  height={100}
                  className="h-24 w-auto"
                  priority
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="text-5xl font-bold text-gray-900">MINIMINDS</span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/" 
                className={`text-sm font-medium hover:text-primary-600 transition-colors ${
                  pathname === '/' 
                    ? 'text-gray-900 border-b-2 border-gray-900' 
                    : 'text-gray-700'
                }`}
              >
                Accueil
              </Link>
              <Link 
                href="/products" 
                className={`text-sm font-medium hover:text-primary-600 transition-colors ${
                  pathname?.startsWith('/products') 
                    ? 'text-gray-900 border-b-2 border-gray-900' 
                    : 'text-gray-700'
                }`}
              >
                Nos Jouets
              </Link>
              <Link 
                href="/contact" 
                className={`text-sm font-medium hover:text-primary-600 transition-colors ${
                  pathname === '/contact' 
                    ? 'text-gray-900 border-b-2 border-gray-900' 
                    : 'text-gray-700'
                }`}
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Right side: Search + Cart Icons */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Search Icon */}
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-medium text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block py-2 text-base font-medium text-gray-700 hover:text-primary-600 transition-colors"
              onClick={closeMobileMenu}
            >
              Accueil
            </Link>
            <Link
              href="/products"
              className="block py-2 text-base font-medium text-gray-700 hover:text-primary-600 transition-colors"
              onClick={closeMobileMenu}
            >
              Nos Jouets
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-base font-medium text-gray-700 hover:text-primary-600 transition-colors"
              onClick={closeMobileMenu}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
