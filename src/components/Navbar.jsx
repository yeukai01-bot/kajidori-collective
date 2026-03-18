import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const active = (path) => loc.pathname === path ? 'text-yellow-400 font-semibold' : 'text-white hover:text-yellow-300'

  return (
    <nav className="bg-blue-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-blue-900 font-bold text-lg">K</span>
            </div>
            <span className="text-white font-bold text-lg hidden sm:block">The Kajidori Collective</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm transition-colors ${active('/')}`}>Home</Link>
            <Link to="/about" className={`text-sm transition-colors ${active('/about')}`}>About</Link>
            <Link to="/services" className={`text-sm transition-colors ${active('/services')}`}>Services</Link>
            <Link to="/case-studies" className={`text-sm transition-colors ${active('/case-studies')}`}>Case Studies</Link>
            <HashLink smooth to="/#pricing" className="text-sm text-white hover:text-yellow-300 transition-colors">Pricing</HashLink>
            <Link to="/apply-to-be-a-guest" className={`text-sm font-semibold transition-colors ${active('/apply-to-be-a-guest') || 'text-yellow-300 hover:text-yellow-200'}`}>Be a Guest</Link>
            <Link to="/contact" className={`text-sm transition-colors ${active('/contact')}`}>Work With Us</Link>
            <Link to="/portal/login" className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-300 transition-colors">
              Client Portal
            </Link>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setOpen(!open)} className="md:hidden text-white p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 space-y-2">
            {[['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/case-studies', 'Case Studies'], ['/apply-to-be-a-guest', 'Be a Guest'], ['/contact', 'Work With Us']].map(([path, label]) => (
              <Link key={path} to={path} onClick={() => setOpen(false)} className="block text-white hover:text-yellow-300 py-2 px-2 text-sm">{label}</Link>
            ))}
            <HashLink smooth to="/#pricing" onClick={() => setOpen(false)} className="block text-white hover:text-yellow-300 py-2 px-2 text-sm">Pricing</HashLink>
            <Link to="/portal/login" onClick={() => setOpen(false)} className="block bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg text-sm font-semibold text-center mt-2">Client Portal</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
