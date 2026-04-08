'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  HomeIcon,
  ShoppingBagIcon,
  ListBulletIcon,
  UsersIcon,
  ShoppingCartIcon,
  TagIcon,
  NewspaperIcon,
  PhotoIcon,
  MegaphoneIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Ürünler', href: '/products', icon: ShoppingBagIcon },
  { name: 'Kategoriler', href: '/categories', icon: ListBulletIcon },
  { name: 'Siparişler', href: '/orders', icon: ShoppingCartIcon },
  { name: 'Müşteriler', href: '/customers', icon: UsersIcon },
  { name: 'Kuponlar', href: '/coupons', icon: TagIcon },
  { name: 'Bannerlar', href: '/banners', icon: PhotoIcon },
  { name: 'Duyurular', href: '/duyurular', icon: MegaphoneIcon },
  { name: 'Yorumlar', href: '/yorumlar', icon: ChatBubbleLeftRightIcon },
  { name: 'Site İçerikleri', href: '/icerikler', icon: DocumentTextIcon },
]

export function Sidebar() {
  const pathname = usePathname()
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    // Login sayfasındaysa gösterme
    if (pathname === '/') {
      setShouldRender(false)
      return
    }
    
    // Token kontrolü
    const token = localStorage.getItem('admin_token')
    if (!token) {
      setShouldRender(false)
      return
    }
    
    setShouldRender(true)
  }, [pathname])

  if (!shouldRender) {
    return null
  }

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen flex-shrink-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold">360 Sehpa</h1>
        <p className="text-gray-400 text-sm">Admin Panel</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => {
            localStorage.removeItem('admin_token')
            window.location.href = '/'
          }}
          className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Çıkış Yap
        </button>
      </div>
    </div>
  )
}
