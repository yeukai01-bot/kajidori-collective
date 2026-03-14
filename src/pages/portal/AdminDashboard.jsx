import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, TABLES } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const TABS = ['Overview', 'Organisations', 'Users', 'Programmes', 'Settings']

export default function AdminDashboard() {
  const [tab, setTab] = useState('Overview')
  const { user, signOut } = useAuth()
  const [orgs, setOrgs] = useState([])
  const [users, setUsers] = useState([])
  const [programmes, setProgrammes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  useEffect(() => { if (user) loadData() }, [user])

  const loadData = async () => {
    if (!user) return
    const [{ data: o }, { data: u }, { data: p }] = await Promise.all([
      supabase.from(TABLES.ORGANISATIONS).select('*').order('created_at', { ascending: false }),
      supabase.from(TABLES.USERS).select('*, organisations_1741860000000(name)').order('created_at', { ascending: false }),
      supabase.from(TABLES.PROGRAMMES).select('*').order('name'),
    ])
    setOrgs(o || [])
    setUsers(u || [])
    setProgrammes(p || [])
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
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                tab === t ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

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
                { label: 'Admins', value: users.filter(u => u.role === 'admin').length, icon: '🔑' },
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

            {msg && (
              <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {msg}
              </div>
            )}

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
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {orgs.map(org => (
                  <div key={org.id} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-blue-900">{org.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        org.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                      }`}>{org.status || 'active'}</span>
                    </div>
                    <div className="space-y-1 text-sm text-slate-500">
                      {org.type && <div>Type: {org.type.replace('_', ' ')}</div>}
                      {org.contact_name && <div>Contact: {org.contact_name}</div>}
                      {org.contact_email && <div>Email: {org.contact_email}</div>}
                      {org.staff_count && <div>Staff: {org.staff_count}</div>}
                      {org.contract_start_date && (
                        <div>Contract from: {new Date(org.contract_start_date).toLocaleDateString('en-GB')}</div>
                      )}
                    </div>
                    <div className="mt-3 text-xs text-slate-400">
                      {users.filter(u => u.organisation_id === org.id).length} users
                    </div>
                  </div>
                ))}
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
                    {msg && (
                      <div className={`px-4 py-3 rounded-lg text-sm ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {msg}
                      </div>
                    )}
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

            {msg && (
              <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {msg}
              </div>
            )}

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
                    {msg && (
                      <div className={`px-4 py-3 rounded-lg text-sm ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {msg}
                      </div>
                    )}
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

        {/* SETTINGS TAB */}
        {tab === 'Settings' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">System Settings</h2>
            <p className="text-slate-500 mb-8 text-sm">Platform configuration and administration.</p>

            <div className="space-y-6">
              {/* Platform info */}
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

              {/* Role summary */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-bold text-blue-900 mb-4">User Role Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { role: 'admin', label: 'Admins', color: 'bg-red-100 text-red-700' },
                    { role: 'manager', label: 'Managers', color: 'bg-blue-100 text-blue-700' },
                    { role: 'participant', label: 'Participants', color: 'bg-slate-100 text-slate-600' },
                  ].map(r => (
                    <div key={r.role} className="text-center">
                      <div className={`text-2xl font-bold ${r.color.split(' ')[1]} mb-1`}>
                        {users.filter(u => u.role === r.role).length}
                      </div>
                      <div className="text-xs text-slate-500">{r.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supabase links */}
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
                  <a href="https://supabase.com/dashboard/project/vsdkurupmcazzwrbeldh/auth/providers" target="_blank" rel="noopener noreferrer"
                    className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                    Auth Settings
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
