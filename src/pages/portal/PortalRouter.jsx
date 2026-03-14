import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function PortalRouter() {
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getRole() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setRole('none')
        setLoading(false)
        return
      }

      // Query using the authenticated user's JWT (bypasses RLS issues)
      const { data, error } = await supabase
        .from('portal_users_1741860000000')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle()

      if (error) {
        console.error('PortalRouter role fetch error:', error)
      }

      // If we got a role from the DB, use it
      if (data?.role) {
        setRole(data.role)
        setLoading(false)
        return
      }

      // Fallback: check user_metadata (set during registration)
      const metaRole = session.user.user_metadata?.role
      if (metaRole) {
        setRole(metaRole)
        setLoading(false)
        return
      }

      // Last resort: check email against known admin
      // This ensures admin access even if DB row is missing
      const adminEmails = ['yeukai@kajidori.co.uk']
      if (adminEmails.includes(session.user.email)) {
        setRole('admin')
        setLoading(false)
        return
      }

      setRole('participant')
      setLoading(false)
    }

    getRole()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-blue-200 text-sm">Loading your portal...</p>
        </div>
      </div>
    )
  }

  if (role === 'none') return <Navigate to="/portal/login" replace />
  if (role === 'admin') return <Navigate to="/portal/admin" replace />
  if (role === 'manager') return <Navigate to="/portal/manager" replace />
  return <Navigate to="/portal/participant" replace />
}
