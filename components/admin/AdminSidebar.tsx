'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Products', icon: '📦' },
    { href: '/admin/orders', label: 'Orders', icon: '🛒' },
  ]

  return (
    <>
      {/* Mobile/Tablet Header */}
      <div className="admin-lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4">
          <h1 className="text-lg font-bold text-primary-600">Admin Portal</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="admin-lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } admin-lg:translate-x-0 admin-lg:static admin-lg:inset-0`}
      >
        <div className="flex flex-col h-full">
          {/* Desktop Header */}
          <div className="hidden admin-lg:flex items-center justify-center h-16 border-b border-gray-200">
            <h1 className="text-xl font-bold text-primary-600">Admin Portal</h1>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="mr-2">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

