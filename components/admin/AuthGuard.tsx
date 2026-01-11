'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        
        if (!data?.user) {
          router.push('/admin/login')
          return
        }
        
        setIsAuthenticated(true)
        setIsLoading(false)
      } catch (err: any) {
        router.push('/admin/login')
      }
    }

    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="admin-lg:pl-64 pt-16 admin-lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

