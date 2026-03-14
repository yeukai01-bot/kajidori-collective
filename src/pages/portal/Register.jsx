import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', organisation: '', role: 'participant' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)

    try {
      // Try the handle_registration_v4 function that exists in Supabase
      const { data, error: fnError } = await supabase.rpc('handle_registration_v4', {
        p_email: form.email,
        p_password: form.password,
        p_full_name: form.fullName,
        p_organisation_name: form.organisation || null,
        p_role: form.role,
      })

      if (fnError) {
        // Fallback: try direct auth signup
        const { error: authError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.fullName, organisation: form.organisation, role: form.role },
          },
        })
        if (authError) throw authError
      }

      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 text-center max-w-md shadow-xl">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-blue-900 mb-3">Registration Successful!</h2>
          <p className="text-slate-600 mb-6">Your account has been created. You can now sign in to access the portal.</p>
          <Link to="/portal/login" className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors inline-block">
            Sign In Now
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-yellow-400 font-bold text-2xl">K</span>
          </div>
          <h1 className="text-2xl font-bold text-blue-900">Create Account</h1>
          <p className="text-slate-500 text-sm mt-1">Register for the Kajidori Client Portal</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your full name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address <span className="text-red-500">*</span></label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Organisation</label>
            <input type="text" name="organisation" value={form.organisation} onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your organisation name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">I am registering as</label>
            <select name="role" value={form.role} onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="participant">Training Participant</option>
              <option value="manager">Manager / Team Lead</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password <span className="text-red-500">*</span></label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="At least 8 characters" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Repeat your password" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/portal/login" className="text-blue-700 font-medium hover:underline">Sign in here</Link>
        </p>
      </div>
    </div>
  )
}
