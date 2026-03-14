import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

// These emails always route to the Admin dashboard regardless of DB or metadata
const ADMIN_EMAILS = ['yeukai@kajidori.co.uk']

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

      // PRIORITY 1: Hardcoded admin emails always win — no DB or metadata override possible
      if (ADMIN_EMAILS.includes(session.user.email?.toLowerCase())) {
        setRole('admin')
        setLoading(false)
        return
      }

      // PRIORITY 2: Query the portal_users table for the stored role
      const { data, error } = await supabase
        .from('portal_users_1741860000000')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle()

      if (error) {
        console.error('PortalRouter role fetch error:', error)
      }

      if (data?.role) {
        setRole(data.role)
        setLoading(false)
        return
      }

      // PRIORITY 3: Fallback to user_metadata set during registration
      const metaRole = session.user.user_metadata?.role
      if (metaRole && ['admin', 'manager', 'participant'].includes(metaRole)) {
        setRole(metaRole)
        setLoading(false)
        return
      }

      // Default: treat as participant
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
