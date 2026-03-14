import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-12 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-blue-900 font-bold text-sm">K</span>
            </div>
            <span className="font-bold text-sm">The Kajidori Collective</span>
          </div>
          <p className="text-blue-300 text-sm leading-relaxed">Specialist health and social care training and consultancy.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Quick Links</h4>
          <div className="space-y-2">
            {[
              { to: '/about', label: 'About Us' },
              { to: '/services', label: 'Services' },
              { to: '/case-studies', label: 'Case Studies' },
              { to: '/contact', label: 'Work With Us' },
            ].map(l => (
              <Link key={l.to} to={l.to} className="block text-blue-300 hover:text-white text-sm transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Client Portal</h4>
          <div className="space-y-2">
            <Link to="/portal/login" className="block text-blue-300 hover:text-white text-sm transition-colors">Sign In</Link>
            <Link to="/portal/register" className="block text-blue-300 hover:text-white text-sm transition-colors">Register</Link>
          </div>
          <div className="mt-6">
            <p className="text-blue-400 text-xs">© {new Date().getFullYear()} The Kajidori Collective. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
