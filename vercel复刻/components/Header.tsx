'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container-max h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <svg height="26" viewBox="0 0 75 65" fill="black">
              <path d="M37.59.25l36.95 64H.64l36.95-64z"></path>
            </svg>
          </Link>
        </div>

        {/* 主导航 */}
        <nav className="hidden md:flex items-center space-x-8">
          <div className="relative">
            <button 
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-black transition-colors"
              onMouseEnter={() => setActiveDropdown('products')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <span>Products</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 9L3 6h6z"/>
              </svg>
            </button>
          </div>

          <div className="relative">
            <button 
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-black transition-colors"
              onMouseEnter={() => setActiveDropdown('solutions')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <span>Solutions</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 9L3 6h6z"/>
              </svg>
            </button>
          </div>

          <div className="relative">
            <button 
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-black transition-colors"
              onMouseEnter={() => setActiveDropdown('resources')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <span>Resources</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 9L3 6h6z"/>
              </svg>
            </button>
          </div>

          <Link href="/enterprise" className="text-sm text-gray-600 hover:text-black transition-colors">
            Enterprise
          </Link>

          <Link href="/docs" className="text-sm text-gray-600 hover:text-black transition-colors">
            Docs
          </Link>

          <Link href="/pricing" className="text-sm text-gray-600 hover:text-black transition-colors">
            Pricing
          </Link>
        </nav>

        {/* 右侧按钮 */}
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-sm text-gray-600 hover:text-black transition-colors">
            Log In
          </Link>
          <Link href="/contact" className="text-sm text-gray-600 hover:text-black transition-colors">
            Contact
          </Link>
          <Link 
            href="/signup" 
            className="px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  )
}