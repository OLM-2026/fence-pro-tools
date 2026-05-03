'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-navy text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="font-display font-bold text-xl tracking-wide text-gold"
          >
            PRO FENCE TOOLS
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-gold transition-colors">
              Directory
            </Link>
            <Link
              href="/compare/jobber-vs-housecall-pro"
              className="text-sm font-medium hover:text-gold transition-colors"
            >
              Compare
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-gold transition-colors">
              About
            </Link>
          </div>

          <button
            className="md:hidden p-2 space-y-1.5"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-0.5 bg-white" />
            <span className="block w-5 h-0.5 bg-white" />
            <span className="block w-5 h-0.5 bg-white" />
          </button>
        </div>

        {open && (
          <div className="md:hidden py-4 border-t border-white/10 flex flex-col gap-4 pb-5">
            <Link href="/" className="text-sm hover:text-gold transition-colors" onClick={() => setOpen(false)}>
              Directory
            </Link>
            <Link
              href="/compare/jobber-vs-housecall-pro"
              className="text-sm hover:text-gold transition-colors"
              onClick={() => setOpen(false)}
            >
              Compare
            </Link>
            <Link href="/about" className="text-sm hover:text-gold transition-colors" onClick={() => setOpen(false)}>
              About
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
