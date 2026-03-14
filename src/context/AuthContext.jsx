import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, TABLES } from '../lib/supabase'

const AuthContext = createContext({})

// These emails always have admin access regardless of database role
const ADMIN_EMAILS = ['yeukai@kajidori.co.uk']

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchProfile(userId, userEmail) {
    // Admin email override — always set role to admin regardless of DB value
    if (userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
      setProfile(prev => ({ ...(prev || {}), role: 'admin', email: userEmail }))
      // Still fetch full profile for name/org data but force role
      try {
        const { data, error } = await supabase
          .from(TABLES.USERS)
          .select('*')
          .eq('id', userId)
          .maybeSingle()
        if (!error && data) setProfile({ ...data, role: 'admin' })
        else setProfile({ id: userId, email: userEmail, role: 'admin' })
      } catch (e) {
        setProfile({ id: userId, email: userEmail, role: 'admin' })
      }
      return
    }
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      if (!error && data) setProfile(data)
    } catch (e) {
      console.error('Profile fetch error:', e)
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id, session.user.email)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email)
      } else {
        setProfile(null)
      }
      setLoading(false)
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
