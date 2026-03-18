import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import CaseStudies from './pages/CaseStudies'
import YoureConfirmed from './pages/YoureConfirmed'
import Login from './pages/portal/Login'
import Register from './pages/portal/Register'
import ForgotPassword from './pages/portal/ForgotPassword'
import ResetPassword from './pages/portal/ResetPassword'
import ParticipantDashboard from './pages/portal/ParticipantDashboard'
import ManagerDashboard from './pages/portal/ManagerDashboard'
import AdminDashboard from './pages/portal/AdminDashboard'
import CertificatePrint from './pages/portal/CertificatePrint'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// These emails always have admin access regardless of what is stored in the database
const ADMIN_EMAILS = ['yeukai@kajidori.co.uk']

function ProtectedRoute({ children, requiredRole }) {
  const { user, profile, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
    </div>
  )
  if (!user) return <Navigate to="/portal/login" replace />
  // Hardcoded admin emails always pass through regardless of DB role
  const isAdmin = ADMIN_EMAILS.includes(user.email?.toLowerCase())
  if (requiredRole && !isAdmin && profile?.role !== requiredRole && profile?.role !== 'admin') return <Navigate to="/portal/login" replace />
  return children
}

function PortalRedirect() {
  const { user, profile, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/portal/login" replace />
  // PRIORITY 1: Hardcoded admin emails always go to admin dashboard
  if (ADMIN_EMAILS.includes(user.email?.toLowerCase())) return <Navigate to="/portal/admin" replace />
  // PRIORITY 2: Use role from portal_users table
  if (profile?.role === 'admin') return <Navigate to="/portal/admin" replace />
  if (profile?.role === 'manager' || profile?.role === 'compliance') return <Navigate to="/portal/manager" replace />
  return <Navigate to="/portal/participant" replace />
}

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/case-studies" element={<PublicLayout><CaseStudies /></PublicLayout>} />
      <Route path="/youre-confirmed" element={<PublicLayout><YoureConfirmed /></PublicLayout>} />
      <Route path="/portal/login" element={<Login />} />
      <Route path="/portal/register" element={<Register />} />
      <Route path="/portal/forgot-password" element={<ForgotPassword />} />
      <Route path="/portal/reset-password" element={<ResetPassword />} />
      <Route path="/portal/participant/*" element={<ProtectedRoute><ParticipantDashboard /></ProtectedRoute>} />
      <Route path="/portal/manager/*" element={<ProtectedRoute requiredRole="manager"><ManagerDashboard /></ProtectedRoute>} />
      <Route path="/portal/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/portal/certificate/:certId" element={<ProtectedRoute><CertificatePrint /></ProtectedRoute>} />
      <Route path="/portal" element={<PortalRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
