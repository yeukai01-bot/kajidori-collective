import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, TABLES } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const TABS = ['Overview', 'Organisations', 'Users', 'Programmes', 'Certificates', 'Settings']

export default function AdminDashboard() {
  const [tab, setTab] = useState('Overview')
  const { user, signOut } = useAuth()
  const [orgs, setOrgs] = useState([])
  const [users, setUsers] = useState([])
  const [programmes, setProgrammes] = useState([])
  const [certificates, setCertificates] = useState([])
  const [attendance, setAttendance] = useState([])
  const [mentoring, setMentoring] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [issuingCert, setIssuingCert] = useState(null)
  const [selectedOrg, setSelectedOrg] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { if (user) loadData() }, [user])

  const loadData = async () => {
    if (!user) return
    const [{ data: o }, { data: u }, { data: p }, { data: c }, { data: a }, { data: m }] = await Promise.all([
      supabase.from(TABLES.ORGANISATIONS).select('*').order('created_at', { ascending: false }),
      supabase.from(TABLES.USERS).select('*, organisations_1741860000000(name)').order('created_at', { ascending: false }),
      supabase.from(TABLES.PROGRAMMES).select('*').order('name'),
      supabase.from(TABLES.CERTIFICATES).select('*').order('created_at', { ascending: false }),
      supabase.from(TABLES.ATTENDANCE).select('*').order('created_at', { ascending: false }),
      supabase.from(TABLES.MENTORING).select('*').order('week_number'),
    ])
    setOrgs(o || [])
    setUsers(u || [])
    setProgrammes(p || [])
    setCertificates(c || [])
    setAttendance(a || [])
    setMentoring(m || [])
    setLoading(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/portal/login')
  }

  const handleFormChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSaveOrg = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    const { error } = await supabase.from(TABLES.ORGANISATIONS).insert([{
      name: formData.name,
      type: formData.type || 'care_provider',
      contact_name: formData.contact_name || null,
      contact_email: formData.contact_email || null,
      contact_phone: formData.contact_phone || null,
      staff_count: formData.staff_count ? parseInt(formData.staff_count) : null,
      contract_start_date: formData.contract_start_date || null,
      status: 'active',
    }])
    if (error) {
      setMsg(`❌ Error: ${error.message}`)
    } else {
      setMsg('✅ Organisation created successfully!')
      setModal(null)
      setFormData({})
      loadData()
    }
    setSaving(false)
  }

  const handleSaveProgramme = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    const { error } = await supabase.from(TABLES.PROGRAMMES).insert([{
      name: formData.name,
      description: formData.description || null,
      duration_weeks: formData.duration_weeks ? parseInt(formData.duration_weeks) : null,
    }])
    if (error) {
      setMsg(`❌ Error: ${error.message}`)
    } else {
      setMsg('✅ Programme created successfully!')
      setModal(null)
      setFormData({})
      loadData()
    }
    setSaving(false)
  }

  const handleUpdateUserRole = async (userId, newRole) => {
    const { error } = await supabase
      .from(TABLES.USERS)
      .update({ role: newRole })
      .eq('id', userId)
    if (!error) loadData()
  }

  // Generate a unique certificate reference number
  const generateRef = (firstName, lastName) => {
    const initials = `${(firstName || 'X')[0]}${(lastName || 'X')[0]}`.toUpperCase()
    const year = new Date().getFullYear()
    const rand = Math.floor(Math.random() * 9000) + 1000
    return `KC-${year}-${initials}-${rand}`
  }

  // Issue a certificate to a user for a programme
  const handleIssueCertificate = async (targetUser, programme) => {
    setIssuingCert(`${targetUser.id}-${programme.id}`)
    setMsg('')
    const existing = certificates.find(c => c.user_id === targetUser.id && c.programme_id === programme.id)
    if (existing) {
      // Update existing certificate to issued
      const { error } = await supabase
        .from(TABLES.CERTIFICATES)
        .update({
          status: 'issued',
          issue_date: new Date().toISOString().split('T')[0],
          progress_percent: 100,
        })
        .eq('id', existing.id)
      if (error) {
        setMsg(`❌ Error issuing certificate: ${error.message}`)
      } else {
        setMsg(`✅ Certificate issued to ${targetUser.first_name} ${targetUser.last_name}`)
        loadData()
      }
    } else {
      // Create new certificate record
      const ref = generateRef(targetUser.first_name, targetUser.last_name)
      const { error } = await supabase.from(TABLES.CERTIFICATES).insert([{
        user_id: targetUser.id,
        programme_id: programme.id,
        reference_number: ref,
        issue_date: new Date().toISOString().split('T')[0],
        status: 'issued',
        progress_percent: 100,
      }])
      if (error) {
        setMsg(`❌ Error issuing certificate: ${error.message}`)
      } else {
        setMsg(`✅ Certificate issued to ${targetUser.first_name} ${targetUser.last_name} — Ref: ${ref}`)
        loadData()
      }
    }
    setIssuingCert(null)
  }

  // Revoke a certificate
  const handleRevokeCertificate = async (certId) => {
    if (!window.confirm('Are you sure you want to revoke this certificate?')) return
    const { error } = await supabase
      .from(TABLES.CERTIFICATES)
      .update({ status: 'revoked' })
      .eq('id', certId)
    if (!error) {
      setMsg('Certificate revoked.')
      loadData()
    }
  }

  // Get user's completion data for a programme
  const getUserCompletion = (userId, programmeId) => {
    const userAttendance = attendance.filter(a => a.user_id === userId && a.programme_id === programmeId)
    const workshopSessions = userAttendance.filter(a => a.session_name?.startsWith('WORKSHOP:'))
    const userMentoring = mentoring.filter(m => m.user_id === userId && m.status === 'completed')
    const hasCert = certificates.find(c => c.user_id === userId && c.programme_id === programmeId && c.status === 'issued')
    return {
      workshopDays: workshopSessions.length,
      mentoringCompleted: userMentoring.length,
      totalAttendance: userAttendance.length,
      hasCertificate: !!hasCert,
      certificate: hasCert || null,
    }
  }

  const getProgrammeName = (id) => programmes.find(p => p.id === id)?.name || 'Unknown Programme'

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-500 text-sm">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  const participants = users.filter(u => u.role === 'participant' || u.role === 'manager')

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-blue-900 font-bold text-sm">K</span>
          </div>
          <div>
            <div className="font-semibold text-sm">Kajidori Collective</div>
            <div className="text-blue-300 text-xs">Admin Portal</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-blue-200 text-sm hidden sm:block">{user?.email}</span>
          <button onClick={handleSignOut} className="text-blue-300 hover:text-white text-sm transition-colors">Sign Out</button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex gap-0 max-w-6xl mx-auto overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => { setTab(t); setMsg('') }}
              className={`px-5 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                tab === t ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Global message */}
        {msg && (
          <div className={`mb-6 px-4 py-3 rounded-lg text-sm ${msg.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {msg}
          </div>
        )}

        {/* OVERVIEW TAB */}
        {tab === 'Overview' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">System Overview</h2>
            <p className="text-slate-500 mb-8 text-sm">Platform-wide summary.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Organisations', value: orgs.length, icon: '🏢' },
                { label: 'Users', value: users.length, icon: '👤' },
                { label: 'Programmes', value: programmes.length, icon: '📚' },
                { label: 'Certificates Issued', value: certificates.filter(c => c.status === 'issued').length, icon: '🏆' },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-bold text-blue-900">{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <h3 className="font-semibold text-blue-900 mb-3">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => { setTab('Organisations'); setModal('newOrg') }}
                  className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
                  🏢 New Organisation
                </button>
                <button onClick={() => { setTab('Programmes'); setModal('newProgramme') }}
                  className="bg-white text-blue-900 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                  📚 New Programme
                </button>
                <button onClick={() => setTab('Certificates')}
                  className="bg-white text-blue-900 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                  🏆 Issue Certificates
                </button>
                <button onClick={() => setTab('Users')}
                  className="bg-white text-blue-900 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                  👥 Manage Users
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ORGANISATIONS TAB */}
        {tab === 'Organisations' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-blue-900">Organisations</h2>
                <p className="text-slate-500 text-sm mt-1">{orgs.length} registered organisations</p>
              </div>
              <button onClick={() => { setModal('newOrg'); setFormData({}); setMsg('') }}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">
                + New Organisation
              </button>
            </div>

            {orgs.length === 0 ? (
              <div className="bg-white rounded-xl p-12 border border-slate-100 text-center">
                <div className="text-5xl mb-4">🏢</div>
                <h3 className="font-semibold text-slate-700 mb-2">No organisations yet</h3>
                <p className="text-slate-500 text-sm mb-4">Add your first client organisation to get started.</p>
                <button onClick={() => { setModal('newOrg'); setFormData({}) }}
                  className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">
                  Add Organisation
                </button>
              </div>
            ) : selectedOrg ? (
              // ORG DRILL-DOWN VIEW
              <div>
                <button onClick={() => setSelectedOrg(null)}
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-900 text-sm font-medium mb-6">
                  ← Back to all organisations
                </button>
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="bg-blue-900 text-white px-6 py-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-bold">{selectedOrg.name}</h2>
                        {selectedOrg.type && <p className="text-blue-300 text-sm mt-1">{selectedOrg.type.replace(/_/g, ' ')}</p>}
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        selectedOrg.status === 'active' ? 'bg-green-400 text-green-900' : 'bg-slate-400 text-white'
                      }`}>{selectedOrg.status || 'active'}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                      {selectedOrg.contact_name && <div><span className="text-blue-300">Contact</span><div className="font-medium">{selectedOrg.contact_name}</div></div>}
                      {selectedOrg.contact_email && <div><span className="text-blue-300">Email</span><div className="font-medium">{selectedOrg.contact_email}</div></div>}
                      {selectedOrg.contact_phone && <div><span className="text-blue-300">Phone</span><div className="font-medium">{selectedOrg.contact_phone}</div></div>}
                      {selectedOrg.staff_count && <div><span className="text-blue-300">Staff</span><div className="font-medium">{selectedOrg.staff_count}</div></div>}
                    </div>
                  </div>

                  {/* Email org contact */}
                  {selectedOrg.contact_email && (
                    <div className="px-6 py-3 bg-blue-50 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-sm text-slate-600">Organisation contact: <strong>{selectedOrg.contact_name || selectedOrg.contact_email}</strong></span>
                      <a href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(selectedOrg.contact_email)}&su=${encodeURIComponent(`Training Update — ${selectedOrg.name}`)}&body=${encodeURIComponent(`Dear ${selectedOrg.contact_name || 'Team'},\n\nI hope this message finds you well. I am writing to provide an update on the training progress for your team at ${selectedOrg.name}.\n\nPlease find the latest compliance summary below.\n\nKind regards,\nYeukai Kajidori\nThe Kajidori Collective`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="bg-blue-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors flex items-center gap-2">
                        ✉️ Email Organisation
                      </a>
                    </div>
                  )}

                  {/* Members table */}
                  <div className="p-6">
                    <h3 className="font-bold text-slate-800 mb-4">Team Members & Training Compliance</h3>
                    {(() => {
                      const orgUsers = users.filter(u => u.organisation_id === selectedOrg.id)
                      if (orgUsers.length === 0) return (
                        <div className="text-center py-8 text-slate-400">
                          <div className="text-3xl mb-2">👥</div>
                          <p className="text-sm">No team members registered for this organisation yet.</p>
                        </div>
                      )
                      return (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="text-left px-4 py-3 font-semibold text-slate-700">Name</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700">Role</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700">Workshop</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700">Mentoring</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700">Certificate</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orgUsers.map(u => {
                                const userAtt = attendance.filter(a => a.user_id === u.id)
                                const workshopDays = userAtt.filter(a => a.session_name?.startsWith('WORKSHOP:')).length
                                const mentoringDone = userAtt.filter(a => a.session_name?.startsWith('MENTORING:')).length
                                const hasCert = certificates.some(c => c.user_id === u.id && c.status === 'issued')
                                const isComplete = workshopDays > 0 && mentoringDone >= 10
                                const needsNudge = !isComplete
                                const fullName = [u.first_name, u.last_name].filter(Boolean).join(' ') || u.email
                                const nudgeBody = `Dear ${u.first_name || 'Team Member'},\n\nI hope you are well. I wanted to reach out regarding your training progress on the Compliance to Excellence programme.\n\n${workshopDays === 0 ? 'You have not yet attended the full-day workshop. ' : `You attended ${workshopDays} workshop day(s). `}${mentoringDone < 10 ? `You have completed ${mentoringDone} of 10 mentoring sessions. ` : 'You have completed all 10 mentoring sessions. '}\n\nPlease make yourself available to complete the remaining sessions at your earliest convenience.\n\nKind regards,\nYeukai Kajidori\nThe Kajidori Collective`
                                return (
                                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                      <div className="font-medium text-slate-800">{fullName}</div>
                                      <div className="text-xs text-slate-400">{u.email}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        u.role === 'manager' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                                      }`}>{u.role}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className={workshopDays > 0 ? 'text-green-600 font-semibold' : 'text-slate-400'}>
                                        {workshopDays > 0 ? `✅ ${workshopDays} day${workshopDays !== 1 ? 's' : ''}` : '⏳ Not attended'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className={mentoringDone >= 10 ? 'text-green-600 font-semibold' : mentoringDone > 0 ? 'text-amber-600 font-semibold' : 'text-slate-400'}>
                                        {mentoringDone}/10
                                      </span>
                                    </td>
                                    <td className="px-4 py-3">
                                      {hasCert
                                        ? <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">🏆 Issued</span>
                                        : <span className="text-xs text-slate-400">Not issued</span>}
                                    </td>
                                    <td className="px-4 py-3">
                                      {needsNudge && u.email && (
                                        <a href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(u.email)}&su=${encodeURIComponent('Training Reminder — Compliance to Excellence')}&body=${encodeURIComponent(nudgeBody)}`}
                                          target="_blank" rel="noopener noreferrer"
                                          className="text-xs bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg font-semibold hover:bg-amber-200 transition-colors whitespace-nowrap">
                                          📧 Send Reminder
                                        </a>
                                      )}
                                      {!needsNudge && (
                                        <span className="text-xs text-green-600 font-medium">✅ Complete</span>
                                      )}
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {orgs.map(org => {
                  const orgUserCount = users.filter(u => u.organisation_id === org.id).length
                  const orgCertCount = certificates.filter(c => users.find(u => u.id === c.user_id && u.organisation_id === org.id) && c.status === 'issued').length
                  return (
                  <div key={org.id}
                    onClick={() => setSelectedOrg(org)}
                    className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm cursor-pointer hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-blue-900">{org.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        org.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                      }`}>{org.status || 'active'}</span>
                    </div>
                    <div className="space-y-1 text-sm text-slate-500">
                      {org.type && <div>Type: {org.type.replace(/_/g, ' ')}</div>}
                      {org.contact_name && <div>Contact: {org.contact_name}</div>}
                      {org.contact_email && <div>Email: {org.contact_email}</div>}
                      {org.staff_count && <div>Staff: {org.staff_count}</div>}
                      {org.contract_start_date && (
                        <div>Contract from: {new Date(org.contract_start_date).toLocaleDateString('en-GB')}</div>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">{orgUserCount} registered user{orgUserCount !== 1 ? 's' : ''}</span>
                      {orgCertCount > 0 && <span className="text-yellow-700 font-semibold">🏆 {orgCertCount} certificate{orgCertCount !== 1 ? 's' : ''} issued</span>}
                      <span className="text-blue-600 font-semibold">View details →</span>
                    </div>
                  </div>
                  )
                })}
              </div>
            )}

            {/* New Organisation Modal */}
            {modal === 'newOrg' && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl max-h-screen overflow-y-auto">
                  <h3 className="text-xl font-bold text-blue-900 mb-6">New Organisation</h3>
                  <form onSubmit={handleSaveOrg} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Organisation Name *</label>
                      <input name="name" value={formData.name || ''} onChange={handleFormChange} required
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Sunrise Care Services" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                      <select name="type" value={formData.type || 'care_provider'} onChange={handleFormChange}
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="care_provider">Care Provider</option>
                        <option value="mental_health">Mental Health</option>
                        <option value="supported_living">Supported Living</option>
                        <option value="domiciliary">Domiciliary Care</option>
                        <option value="nhs">NHS</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Contact Name</label>
                        <input name="contact_name" value={formData.contact_name || ''} onChange={handleFormChange}
                          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Jane Smith" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                        <input name="contact_email" type="email" value={formData.contact_email || ''} onChange={handleFormChange}
                          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="jane@org.com" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                        <input name="contact_phone" value={formData.contact_phone || ''} onChange={handleFormChange}
                          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="07700 900000" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Staff Count</label>
                        <input name="staff_count" type="number" value={formData.staff_count || ''} onChange={handleFormChange}
                          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="25" min="1" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Contract Start Date</label>
                      <input name="contract_start_date" type="date" value={formData.contract_start_date || ''} onChange={handleFormChange}
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="submit" disabled={saving}
                        className="flex-1 bg-blue-900 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50">
                        {saving ? 'Saving...' : 'Create Organisation'}
                      </button>
                      <button type="button" onClick={() => { setModal(null); setMsg('') }}
                        className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {tab === 'Users' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-blue-900">Users</h2>
                <p className="text-slate-500 text-sm mt-1">{users.length} registered users</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Organisation</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Role</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {[u.first_name, u.last_name].filter(Boolean).join(' ') || '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{u.email}</td>
                      <td className="px-4 py-3 text-slate-500">
                        {u.organisations_1741860000000?.name || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          u.role === 'admin' ? 'bg-red-100 text-red-700' :
                          u.role === 'manager' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>{u.role}</span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          onChange={e => handleUpdateUserRole(u.id, e.target.value)}
                          className="border border-slate-200 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                          <option value="participant">Participant</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROGRAMMES TAB */}
        {tab === 'Programmes' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-blue-900">Training Programmes</h2>
                <p className="text-slate-500 text-sm mt-1">{programmes.length} programmes</p>
              </div>
              <button onClick={() => { setModal('newProgramme'); setFormData({}); setMsg('') }}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">
                + New Programme
              </button>
            </div>

            {programmes.length === 0 ? (
              <div className="bg-white rounded-xl p-12 border border-slate-100 text-center">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="font-semibold text-slate-700 mb-2">No programmes yet</h3>
                <p className="text-slate-500 text-sm mb-4">Create your first training programme.</p>
                <button onClick={() => { setModal('newProgramme'); setFormData({}) }}
                  className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">
                  Create Programme
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {programmes.map(p => (
                  <div key={p.id} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-blue-900 mb-2">{p.name}</h3>
                    {p.description && <p className="text-slate-500 text-sm mb-3">{p.description}</p>}
                    {p.duration_weeks && (
                      <div className="text-xs text-slate-400">Duration: {p.duration_weeks} weeks</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* New Programme Modal */}
            {modal === 'newProgramme' && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                  <h3 className="text-xl font-bold text-blue-900 mb-6">New Training Programme</h3>
                  <form onSubmit={handleSaveProgramme} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Programme Name *</label>
                      <input name="name" value={formData.name || ''} onChange={handleFormChange} required
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Mental Health Excellence Programme" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                      <textarea name="description" value={formData.description || ''} onChange={handleFormChange} rows={3}
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Brief description of the programme..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Duration (weeks)</label>
                      <input name="duration_weeks" type="number" value={formData.duration_weeks || ''} onChange={handleFormChange}
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 10" min="1" />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="submit" disabled={saving}
                        className="flex-1 bg-blue-900 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50">
                        {saving ? 'Saving...' : 'Create Programme'}
                      </button>
                      <button type="button" onClick={() => { setModal(null); setMsg('') }}
                        className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CERTIFICATES TAB */}
        {tab === 'Certificates' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Certificate Management</h2>
              <p className="text-slate-500 text-sm">
                Issue certificates to participants and managers who have completed their training programme.
                Once issued, the certificate will automatically appear in their dashboard.
              </p>
            </div>

            {programmes.length === 0 ? (
              <div className="bg-white rounded-xl p-12 border border-slate-100 text-center">
                <div className="text-5xl mb-4">📚</div>
                <p className="text-slate-500">Create a training programme first before issuing certificates.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {programmes.map(programme => {
                  const eligible = participants.filter(u => u.role === 'participant' || u.role === 'manager')
                  return (
                    <div key={programme.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                      <div className="bg-blue-900 text-white px-6 py-4">
                        <h3 className="font-bold text-lg">{programme.name}</h3>
                        {programme.description && (
                          <p className="text-blue-200 text-sm mt-1">{programme.description}</p>
                        )}
                      </div>

                      {eligible.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-sm">
                          No participants or managers registered yet.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="text-left px-5 py-3 font-semibold text-slate-700">Name</th>
                                <th className="text-left px-5 py-3 font-semibold text-slate-700">Organisation</th>
                                <th className="text-left px-5 py-3 font-semibold text-slate-700">Role</th>
                                <th className="text-left px-5 py-3 font-semibold text-slate-700">Workshop Days</th>
                                <th className="text-left px-5 py-3 font-semibold text-slate-700">Mentoring</th>
                                <th className="text-left px-5 py-3 font-semibold text-slate-700">Certificate</th>
                                <th className="text-left px-5 py-3 font-semibold text-slate-700">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {eligible.map(u => {
                                const comp = getUserCompletion(u.id, programme.id)
                                const isIssuing = issuingCert === `${u.id}-${programme.id}`
                                return (
                                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4">
                                      <div className="font-medium text-slate-800">
                                        {[u.first_name, u.last_name].filter(Boolean).join(' ') || u.email}
                                      </div>
                                      <div className="text-xs text-slate-400">{u.email}</div>
                                    </td>
                                    <td className="px-5 py-4 text-slate-500 text-xs">
                                      {u.organisations_1741860000000?.name || '—'}
                                    </td>
                                    <td className="px-5 py-4">
                                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        u.role === 'manager' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                                      }`}>{u.role}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                      <span className={`font-semibold ${comp.workshopDays > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                                        {comp.workshopDays} day{comp.workshopDays !== 1 ? 's' : ''}
                                      </span>
                                    </td>
                                    <td className="px-5 py-4">
                                      <span className={`font-semibold ${comp.mentoringCompleted >= 10 ? 'text-green-600' : comp.mentoringCompleted > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                                        {comp.mentoringCompleted}/10
                                      </span>
                                    </td>
                                    <td className="px-5 py-4">
                                      {comp.hasCertificate ? (
                                        <div>
                                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">✅ Issued</span>
                                          {comp.certificate?.issue_date && (
                                            <div className="text-xs text-slate-400 mt-1">
                                              {new Date(comp.certificate.issue_date).toLocaleDateString('en-GB')}
                                            </div>
                                          )}
                                          {comp.certificate?.reference_number && (
                                            <div className="text-xs text-slate-400">Ref: {comp.certificate.reference_number}</div>
                                          )}
                                        </div>
                                      ) : (
                                        <span className="text-xs text-slate-400">Not issued</span>
                                      )}
                                    </td>
                                    <td className="px-5 py-4">
                                      {comp.hasCertificate ? (
                                        <button
                                          onClick={() => handleRevokeCertificate(comp.certificate.id)}
                                          className="text-xs text-red-500 hover:text-red-700 underline">
                                          Revoke
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleIssueCertificate(u, programme)}
                                          disabled={isIssuing}
                                          className="bg-yellow-400 text-blue-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50 whitespace-nowrap">
                                          {isIssuing ? 'Issuing...' : '🏆 Issue Certificate'}
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === 'Settings' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">System Settings</h2>
            <p className="text-slate-500 mb-8 text-sm">Platform configuration and administration.</p>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-bold text-blue-900 mb-4">Platform Information</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-500 mb-1">Platform</div>
                    <div className="font-medium text-slate-800">The Kajidori Collective Portal</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Database</div>
                    <div className="font-medium text-slate-800">Supabase (vsdkurupmcazzwrbeldh)</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Total Users</div>
                    <div className="font-medium text-slate-800">{users.length}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Total Organisations</div>
                    <div className="font-medium text-slate-800">{orgs.length}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-bold text-blue-900 mb-4">User Role Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { role: 'admin', label: 'Admins', color: 'text-red-700' },
                    { role: 'manager', label: 'Managers', color: 'text-blue-700' },
                    { role: 'participant', label: 'Participants', color: 'text-slate-600' },
                  ].map(r => (
                    <div key={r.role} className="text-center">
                      <div className={`text-2xl font-bold ${r.color} mb-1`}>
                        {users.filter(u => u.role === r.role).length}
                      </div>
                      <div className="text-xs text-slate-500">{r.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-bold text-blue-900 mb-4">Database Management</h3>
                <p className="text-slate-500 text-sm mb-4">Manage the database directly in Supabase for advanced operations.</p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://supabase.com/dashboard/project/vsdkurupmcazzwrbeldh/editor" target="_blank" rel="noopener noreferrer"
                    className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                    SQL Editor
                  </a>
                  <a href="https://supabase.com/dashboard/project/vsdkurupmcazzwrbeldh/auth/users" target="_blank" rel="noopener noreferrer"
                    className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                    Auth Users
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
