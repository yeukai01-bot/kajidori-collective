import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const [portalType, setPortalType] = useState('participant') // 'participant' | 'management'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      // Navigate to portal — PortalRedirect will route by role
      navigate('/portal')
    }
  }

  const isManagement = portalType === 'management'

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
      isManagement
        ? 'bg-gradient-to-br from-slate-900 to-slate-700'
        : 'bg-gradient-to-br from-blue-900 to-blue-700'
    }`}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Portal type selector */}
        <div className="grid grid-cols-2 border-b border-slate-100">
          <button
            onClick={() => { setPortalType('participant'); setError('') }}
            className={`py-4 text-sm font-semibold transition-colors ${
              !isManagement
                ? 'bg-blue-900 text-white'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            Participant Portal
          </button>
          <button
            onClick={() => { setPortalType('management'); setError('') }}
            className={`py-4 text-sm font-semibold transition-colors ${
              isManagement
                ? 'bg-slate-900 text-white'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            Senior Management
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isManagement ? 'bg-slate-900' : 'bg-blue-900'
            }`}>
              <span className="text-yellow-400 font-bold text-2xl">K</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isManagement ? 'Management Portal' : 'Client Portal'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {isManagement
                ? 'Sign in to access team compliance and reporting'
                : 'Sign in to access your training and certificates'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            <div className="text-right">
              <Link to="/portal/forgot-password" className="text-blue-700 text-sm hover:underline">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 ${
                isManagement
                  ? 'bg-slate-900 hover:bg-slate-800'
                  : 'bg-blue-900 hover:bg-blue-800'
              }`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Compliance notice for management */}
          {isManagement && (
            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-800">
              <strong>Compliance Notice:</strong> All management logins are logged for CQC audit and quality assurance purposes.
            </div>
          )}

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link
              to={portalType === 'management' ? '/portal/register?role=manager' : '/portal/register?role=participant'}
              className="text-blue-700 font-medium hover:underline"
            >
              Register here
            </Link>
          </p>
          <p className="text-center text-sm text-slate-400 mt-3">
            <Link to="/" className="hover:underline">← Back to website</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
