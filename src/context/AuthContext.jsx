import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, TABLES } from '../lib/supabase'

const AuthContext = createContext({})

// These emails always have admin access regardless of database role
const ADMIN_EMAILS = ['yeukai@kajidori.co.uk']

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  // loading stays true until BOTH session AND profile are fully resolved
  const [loading, setLoading] = useState(true)

  async function resolveSession(sessionUser) {
    if (!sessionUser) {
      setUser(null)
      setProfile(null)
      setLoading(false)
      return
    }

    setUser(sessionUser)

    // Admin email override — always set role to admin regardless of DB value
    if (ADMIN_EMAILS.includes(sessionUser.email?.toLowerCase())) {
      try {
        const { data, error } = await supabase
          .from(TABLES.USERS)
          .select('*')
          .eq('id', sessionUser.id)
          .maybeSingle()
        setProfile((!error && data) ? { ...data, role: 'admin' } : { id: sessionUser.id, email: sessionUser.email, role: 'admin' })
      } catch {
        setProfile({ id: sessionUser.id, email: sessionUser.email, role: 'admin' })
      }
      setLoading(false)
      return
    }

    // Regular user — fetch profile from portal_users table
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', sessionUser.id)
        .maybeSingle()

      if (!error && data) {
        setProfile(data)
      } else {
        // Profile not found in DB — use user_metadata as fallback
        const metaRole = sessionUser.user_metadata?.role || 'participant'
        const fullName = sessionUser.user_metadata?.full_name || ''
        setProfile({
          id: sessionUser.id,
          email: sessionUser.email,
          role: metaRole,
          first_name: fullName.split(' ')[0] || '',
          last_name: fullName.split(' ').slice(1).join(' ') || '',
        })
      }
    } catch (e) {
      console.error('Profile fetch error:', e)
      setProfile({
        id: sessionUser.id,
        email: sessionUser.email,
        role: sessionUser.user_metadata?.role || 'participant',
      })
    }

    setLoading(false)
  }

  useEffect(() => {
    // Get initial session — do NOT set loading=false until profile is resolved
    supabase.auth.getSession().then(({ data: { session } }) => {
      resolveSession(session?.user ?? null)
    })

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setLoading(true) // reset loading while we fetch the new profile
        resolveSession(session.user)
      } else {
        setUser(null)
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
