import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, TABLES } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const TABS = ['Overview', 'Team Compliance', 'Attendance', 'Reports']

export default function ManagerDashboard() {
  const [tab, setTab] = useState('Overview')
  const { user, profile, signOut } = useAuth()
  const [teamMembers, setTeamMembers] = useState([])
  const [programmes, setProgrammes] = useState([])
  const [allAttendance, setAllAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const displayName = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') || profile.email
    : user?.email || ''

  useEffect(() => { if (user) loadData() }, [user])

  const loadData = async () => {
    if (!user) return

    // Load team members (same organisation)
    const orgId = profile?.organisation_id
    let teamQuery = supabase.from(TABLES.USERS).select('*').eq('role', 'participant')
    if (orgId) teamQuery = teamQuery.eq('organisation_id', orgId)
    const { data: team } = await teamQuery.order('last_name')
    setTeamMembers(team || [])

    // Load programmes
    const { data: p } = await supabase.from(TABLES.PROGRAMMES).select('*').order('name')
    setProgrammes(p || [])

    // Load all attendance for team
    const teamIds = (team || []).map(m => m.id)
    if (teamIds.length > 0) {
      const { data: att } = await supabase
        .from(TABLES.ATTENDANCE)
        .select(`*, ${TABLES.PROGRAMMES}(name), ${TABLES.USERS}(first_name, last_name, email)`)
        .in('user_id', teamIds)
        .order('check_in_time', { ascending: false })
      setAllAttendance(att || [])
    }

    setLoading(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/portal/login')
  }

  // Build compliance matrix: for each team member, how many sessions per programme?
  const complianceMatrix = teamMembers.map(member => {
    const memberAttendance = allAttendance.filter(a => a.user_id === member.id)
    const byProgramme = {}
    programmes.forEach(p => {
      byProgramme[p.id] = memberAttendance.filter(a => a.programme_id === p.id).length
    })
    const total = memberAttendance.length
    return { member, byProgramme, total }
  })

  const downloadComplianceCSV = () => {
    const headers = ['Staff Name', 'Email', 'Job Title', ...programmes.map(p => p.name), 'Total Sessions']
    const rows = complianceMatrix.map(({ member, byProgramme, total }) => [
      `${member.first_name || ''} ${member.last_name || ''}`.trim(),
      member.email,
      member.job_title || '',
      ...programmes.map(p => byProgramme[p.id] || 0),
      total,
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kajidori-compliance-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-500 text-sm">Loading dashboard...</p>
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
            <div className="text-blue-300 text-xs">Manager Portal</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-blue-200 text-sm hidden sm:block">{displayName}</span>
          <button onClick={handleSignOut} className="text-blue-300 hover:text-white text-sm transition-colors">Sign Out</button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex gap-0 max-w-5xl mx-auto overflow-x-auto">
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

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* OVERVIEW TAB */}
        {tab === 'Overview' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Manager Overview</h2>
            <p className="text-slate-500 mb-8 text-sm">Team training summary for your organisation.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Team Members', value: teamMembers.length, icon: '👥' },
                { label: 'Programmes', value: programmes.length, icon: '📚' },
                { label: 'Total Check-Ins', value: allAttendance.length, icon: '✅' },
                { label: 'Avg Sessions/Person', value: teamMembers.length > 0 ? (allAttendance.length / teamMembers.length).toFixed(1) : 0, icon: '📊' },
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
                <button onClick={() => setTab('Team Compliance')} className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
                  📊 View Compliance Matrix
                </button>
                <button onClick={downloadComplianceCSV} className="bg-white text-blue-900 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                  📥 Export CSV Report
                </button>
                <button onClick={() => setTab('Attendance')} className="bg-white text-blue-900 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                  📋 View Attendance Log
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TEAM COMPLIANCE TAB */}
        {tab === 'Team Compliance' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-blue-900">Team Compliance Matrix</h2>
                <p className="text-slate-500 text-sm mt-1">Sessions attended per programme for each team member</p>
              </div>
              <button onClick={downloadComplianceCSV}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors flex items-center gap-2">
                📥 Export CSV
              </button>
            </div>

            {teamMembers.length === 0 ? (
              <div className="bg-white rounded-xl p-12 border border-slate-100 text-center">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="font-semibold text-slate-700 mb-2">No team members found</h3>
                <p className="text-slate-500 text-sm">Team members from your organisation will appear here once they register.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-4 py-3 font-semibold text-slate-700 min-w-40">Staff Member</th>
                      {programmes.map(p => (
                        <th key={p.id} className="text-center px-3 py-3 font-semibold text-slate-700 min-w-28">
                          <div className="text-xs leading-tight">{p.name}</div>
                        </th>
                      ))}
                      <th className="text-center px-3 py-3 font-semibold text-slate-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complianceMatrix.map(({ member, byProgramme, total }) => (
                      <tr key={member.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">
                            {[member.first_name, member.last_name].filter(Boolean).join(' ') || member.email}
                          </div>
                          <div className="text-xs text-slate-400">{member.job_title || member.email}</div>
                        </td>
                        {programmes.map(p => (
                          <td key={p.id} className="text-center px-3 py-3">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                              byProgramme[p.id] > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'
                            }`}>
                              {byProgramme[p.id] || 0}
                            </span>
                          </td>
                        ))}
                        <td className="text-center px-3 py-3">
                          <span className="font-bold text-blue-900">{total}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {tab === 'Attendance' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Attendance Log</h2>
            <p className="text-slate-500 mb-6 text-sm">All check-ins from your team members.</p>

            {allAttendance.length === 0 ? (
              <div className="bg-white rounded-xl p-12 border border-slate-100 text-center">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="font-semibold text-slate-700 mb-2">No attendance records yet</h3>
                <p className="text-slate-500 text-sm">Team members' check-ins will appear here.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-4 py-3 font-semibold text-slate-700">Staff Member</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-700">Programme</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-700">Session</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allAttendance.map(a => (
                      <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {a[TABLES.USERS]
                            ? `${a[TABLES.USERS].first_name || ''} ${a[TABLES.USERS].last_name || ''}`.trim() || a[TABLES.USERS].email
                            : 'Unknown'}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{a[TABLES.PROGRAMMES]?.name || '—'}</td>
                        <td className="px-4 py-3 text-slate-600">{a.session_name}</td>
                        <td className="px-4 py-3 text-slate-500">
                          {a.check_in_time
                            ? new Date(a.check_in_time).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* REPORTS TAB */}
        {tab === 'Reports' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Reports</h2>
            <p className="text-slate-500 mb-8 text-sm">Download compliance reports for CQC audits and internal reviews.</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="font-bold text-blue-900 mb-2">Team Compliance Matrix</h3>
                <p className="text-slate-500 text-sm mb-4">Full compliance breakdown by staff member and programme.</p>
                <button onClick={downloadComplianceCSV}
                  className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">
                  Download CSV
                </button>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                <div className="text-3xl mb-4">📋</div>
                <h3 className="font-bold text-blue-900 mb-2">Attendance Summary</h3>
                <p className="text-slate-500 text-sm mb-4">
                  {teamMembers.length} team members · {allAttendance.length} total check-ins · {programmes.length} programmes
                </p>
                <button onClick={() => setTab('Attendance')}
                  className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors">
                  View Full Log
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
