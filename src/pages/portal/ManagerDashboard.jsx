import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase, TABLES } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const TABS = ['Overview', 'My Training', 'Team Compliance', 'Attendance', 'Reports']

// All 8 workshop sessions — 6 core + 2 optional
const WORKSHOP_SESSIONS = [
  { id: 's1', label: 'Session 1: What Is Mental Health?', duration: '60 min', core: true },
  { id: 's2', label: 'Session 2: The Conditions We Work With', duration: '75 min', core: true },
  { id: 's3', label: 'Session 3: Safeguarding & Whistleblowing', duration: '45 min', core: true },
  { id: 's4', label: 'Session 4: The Art of Active Support', duration: '75 min', core: true },
  { id: 's5', label: 'Session 5: Evidencing Your Work — Writing Notes That Matter', duration: '30 min', core: true },
  { id: 's6', label: 'Session 6: Reflection, Commitment & Close', duration: '30 min', core: true },
  { id: 's7', label: 'Session 7: Medication Management', duration: '60 min', core: false },
  { id: 's8', label: 'Session 8: Positive Behaviour Support', duration: '60 min', core: false },
]

export default function ManagerDashboard() {
  const [tab, setTab] = useState('Overview')
  const { user, profile, signOut } = useAuth()
  const [teamMembers, setTeamMembers] = useState([])
  const [programmes, setProgrammes] = useState([])
  const [allAttendance, setAllAttendance] = useState([])
  const [myAttendance, setMyAttendance] = useState([])
  const [myMentoring, setMyMentoring] = useState([])
  const [myCertificates, setMyCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // My Training — workshop check-in state
  const [workshopProgramme, setWorkshopProgramme] = useState('')
  const [workshopDate, setWorkshopDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedModules, setSelectedModules] = useState({})
  const [workshopMsg, setWorkshopMsg] = useState('')
  const [workshopLoading, setWorkshopLoading] = useState(false)

  // My Training — mentoring sign-off state
  const [mentoringSignOffWeek, setMentoringSignOffWeek] = useState(null)
  const [mentoringMsg, setMentoringMsg] = useState('')
  const [mentoringLoading, setMentoringLoading] = useState(false)

  const displayName = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') || profile.email
    : user?.email || ''

  useEffect(() => { if (user) loadData() }, [user])

  const loadData = async () => {
    if (!user) return

    // Load programmes
    const { data: p, error: progErr } = await supabase.from(TABLES.PROGRAMMES).select('*').order('name')
    if (progErr) console.error('Programmes query error:', progErr)
    const progList = p || []
    setProgrammes(progList)

    // Load team members — STRICT org isolation for data protection
    // Only show participants from the manager's own organisation
    const orgId = profile?.organisation_id
    let teamList = []
    if (orgId) {
      const { data: team, error: teamErr } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('role', 'participant')
        .eq('organisation_id', orgId)
        .order('last_name')
      if (teamErr) console.error('Team query error:', teamErr)
      teamList = team || []
    }
    // Also include managers from same org (for compliance tracking)
    if (orgId) {
      const { data: mgrs } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('role', 'manager')
        .eq('organisation_id', orgId)
        .neq('id', user.id) // exclude self
        .order('last_name')
      teamList = [...teamList, ...(mgrs || [])]
    }
    setTeamMembers(teamList)

    // Load all attendance for team
    const teamIds = teamList.map(m => m.id)
    if (teamIds.length > 0) {
      const { data: att, error: attErr } = await supabase
        .from(TABLES.ATTENDANCE)
        .select('*')
        .in('user_id', teamIds)
        .order('check_in_time', { ascending: false })
      if (attErr) console.error('Attendance query error:', attErr)
      const enriched = (att || []).map(a => ({
        ...a,
        _member: teamList.find(m => m.id === a.user_id),
        _programme: progList.find(pr => pr.id === a.programme_id),
      }))
      setAllAttendance(enriched)
    } else {
      setAllAttendance([])
    }

    // Load manager's own attendance
    const { data: myAtt } = await supabase
      .from(TABLES.ATTENDANCE)
      .select('*')
      .eq('user_id', user.id)
      .order('check_in_time', { ascending: false })
    setMyAttendance(myAtt || [])

    // Load manager's own mentoring sessions
    const { data: myMent } = await supabase
      .from(TABLES.MENTORING)
      .select('*')
      .eq('user_id', user.id)
      .order('week_number', { ascending: true })
    setMyMentoring(myMent || [])

    // Load manager's own certificates
    const { data: myCerts } = await supabase
      .from(TABLES.CERTIFICATES)
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'issued')
      .order('issue_date', { ascending: false })
    setMyCertificates(myCerts || [])

    setLoading(false)
  }

  const toggleModule = (id) => {
    setSelectedModules(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleWorkshopCheckIn = async (e) => {
    e.preventDefault()
    setWorkshopLoading(true)
    setWorkshopMsg('')

    const ticked = WORKSHOP_SESSIONS.filter(s => selectedModules[s.id])
    if (!workshopProgramme) {
      setWorkshopMsg('❌ Please select a programme.')
      setWorkshopLoading(false)
      return
    }
    if (ticked.length === 0) {
      setWorkshopMsg('❌ Please tick at least one session you attended.')
      setWorkshopLoading(false)
      return
    }

    const sessionName = 'WORKSHOP: ' + ticked.map(s => s.label).join(' | ')

    const { data: existing } = await supabase
      .from(TABLES.ATTENDANCE)
      .select('id')
      .eq('user_id', user.id)
      .eq('programme_id', workshopProgramme)
      .ilike('session_name', 'WORKSHOP:%')
      .gte('check_in_time', workshopDate + 'T00:00:00')
      .lte('check_in_time', workshopDate + 'T23:59:59')

    if (existing && existing.length > 0) {
      setWorkshopMsg('ℹ️ You have already submitted a workshop check-in for this date.')
      setWorkshopLoading(false)
      return
    }

    const { error } = await supabase
      .from(TABLES.ATTENDANCE)
      .insert([{
        user_id: user.id,
        programme_id: workshopProgramme,
        session_name: sessionName,
        check_in_time: new Date(workshopDate).toISOString(),
      }])

    if (error) {
      setWorkshopMsg('❌ Check-in failed. Please try again.')
    } else {
      setWorkshopMsg(`✅ Workshop attendance recorded! ${ticked.length} session${ticked.length > 1 ? 's' : ''} logged.`)
      setSelectedModules({})
      setWorkshopProgramme('')
      loadData()
    }
    setWorkshopLoading(false)
  }

  const handleMentoringSignOff = async (weekNumber) => {
    setMentoringLoading(true)
    setMentoringMsg('')
    setMentoringSignOffWeek(weekNumber)

    const existing = myMentoring.find(m => m.week_number === weekNumber)

    if (existing) {
      const { error } = await supabase
        .from(TABLES.MENTORING)
        .update({ status: 'completed' })
        .eq('id', existing.id)
      if (error) {
        setMentoringMsg(`❌ Could not sign off Week ${weekNumber}.`)
      } else {
        setMentoringMsg(`✅ Week ${weekNumber} signed off.`)
        loadData()
      }
    } else {
      const { error } = await supabase
        .from(TABLES.MENTORING)
        .insert([{
          user_id: user.id,
          week_number: weekNumber,
          session_date: new Date().toISOString(),
          goal: `Week ${weekNumber} workplace observation, mentoring and coaching visit`,
          status: 'completed',
        }])
      if (error) {
        setMentoringMsg(`❌ Could not sign off Week ${weekNumber}.`)
      } else {
        setMentoringMsg(`✅ Week ${weekNumber} signed off.`)
        loadData()
      }
    }
    setMentoringLoading(false)
    setMentoringSignOffWeek(null)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/portal/login')
  }

  // Build compliance matrix — includes both participants and manager
  const allTracked = [
    ...teamMembers,
    // Include the manager themselves if they have any attendance
    ...(myAttendance.length > 0 && profile ? [{ ...profile, id: user.id, _isManager: true }] : []),
  ]

  const complianceMatrix = allTracked.map(member => {
    const memberId = member.id
    const memberAtt = memberId === user.id
      ? myAttendance
      : allAttendance.filter(a => a.user_id === memberId)

    const workshopSessions = memberAtt.filter(a => a.session_name?.startsWith('WORKSHOP:'))
    const mentoringCompleted = memberId === user.id
      ? myMentoring.filter(m => m.status === 'completed').length
      : 0 // participants' mentoring tracked separately

    const byProgramme = {}
    programmes.forEach(p => {
      byProgramme[p.id] = memberAtt.filter(a => a.programme_id === p.id).length
    })

    return {
      member,
      byProgramme,
      total: memberAtt.length,
      workshopDays: workshopSessions.length,
      mentoringCompleted,
      isManager: !!member._isManager,
    }
  })

  const downloadComplianceCSV = () => {
    const headers = ['Staff Member', 'Role', 'Email', 'Job Title', 'Workshop Days', 'Mentoring (x/10)', ...programmes.map(p => p.name), 'Total Sessions']
    const rows = complianceMatrix.map(({ member, byProgramme, total, workshopDays, mentoringCompleted, isManager }) => [
      `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email,
      isManager ? 'Manager' : 'Participant',
      member.email,
      member.job_title || '',
      workshopDays,
      `${mentoringCompleted}/10`,
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

  const getProgrammeName = (progId) => programmes.find(p => p.id === progId)?.name || 'Training Programme'
  const myWorkshopRecords = myAttendance.filter(a => a.session_name?.startsWith('WORKSHOP:'))

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
            <div className="text-blue-300 text-xs">Senior Management Portal</div>
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
                { label: 'Team Check-Ins', value: allAttendance.length, icon: '✅' },
                { label: 'My Mentoring', value: `${myMentoring.filter(m => m.status === 'completed').length}/10`, icon: '🎯' },
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
                <button onClick={() => setTab('My Training')} className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
                  📋 Log My Training
                </button>
                <button onClick={() => setTab('Team Compliance')} className="bg-white text-blue-900 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                  📊 Team Compliance Matrix
                </button>
                <button onClick={downloadComplianceCSV} className="bg-white text-blue-900 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                  📥 Export CSV Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MY TRAINING TAB */}
        {tab === 'My Training' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">My Training Record</h2>
            <p className="text-slate-500 mb-8 text-sm">
              As a manager, your own training attendance is tracked for compliance purposes.
              Log your workshop attendance and sign off your mentoring visits here.
            </p>

            {/* Workshop Check-In */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-900 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Full-Day Workshop Attendance
              </h3>

              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm mb-4">
                <form onSubmit={handleWorkshopCheckIn} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Training Programme</label>
                      <select
                        value={workshopProgramme}
                        onChange={e => setWorkshopProgramme(e.target.value)}
                        required
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="">Select a programme...</option>
                        {programmes.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Workshop Date</label>
                      <input
                        type="date"
                        value={workshopDate}
                        onChange={e => setWorkshopDate(e.target.value)}
                        required
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Sessions Attended</label>
                    <div className="grid md:grid-cols-2 gap-2">
                      {WORKSHOP_SESSIONS.map(session => (
                        <label key={session.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedModules[session.id]
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                        }`}>
                          <input
                            type="checkbox"
                            checked={!!selectedModules[session.id]}
                            onChange={() => toggleModule(session.id)}
                            className="mt-0.5 w-4 h-4 rounded accent-blue-900"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-slate-800 leading-tight">{session.label}</div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-xs text-slate-400">{session.duration}</span>
                              {!session.core && (
                                <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Optional</span>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {workshopMsg && (
                    <div className={`px-4 py-3 rounded-lg text-sm ${
                      workshopMsg.startsWith('✅') ? 'bg-green-50 text-green-700' :
                      workshopMsg.startsWith('ℹ️') ? 'bg-blue-50 text-blue-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {workshopMsg}
                    </div>
                  )}

                  <button type="submit" disabled={workshopLoading}
                    className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50">
                    {workshopLoading ? 'Submitting...' : 'Submit Workshop Attendance'}
                  </button>
                </form>
              </div>

              {myWorkshopRecords.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-600">My Workshop History</h4>
                  {myWorkshopRecords.map(a => {
                    const modulesStr = a.session_name.replace('WORKSHOP: ', '')
                    const modules = modulesStr.split(' | ')
                    return (
                      <div key={a.id} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium text-slate-800 text-sm">{getProgrammeName(a.programme_id)}</div>
                            <div className="text-slate-500 text-xs mt-0.5">
                              {a.check_in_time
                                ? new Date(a.check_in_time).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                                : 'Date not set'}
                              {' · '}{modules.length} session{modules.length > 1 ? 's' : ''} attended
                            </div>
                          </div>
                          <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Attended</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {modules.map((m, i) => (
                            <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                              {m.split(':')[0]}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* 10-Week Mentoring Sign-Off */}
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-900 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                10-Week Mentoring Programme
              </h3>
              <p className="text-slate-500 text-sm mb-4">Sign off each workplace visit once your mentoring session is complete.</p>

              <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">Progress</span>
                  <span className="text-sm font-bold text-blue-900">
                    {myMentoring.filter(m => m.status === 'completed').length} / 10 completed
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className="bg-blue-900 h-2.5 rounded-full transition-all"
                    style={{ width: `${(myMentoring.filter(m => m.status === 'completed').length / 10) * 100}%` }}
                  ></div>
                </div>
              </div>

              {mentoringMsg && (
                <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
                  mentoringMsg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {mentoringMsg}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-3">
                {Array.from({ length: 10 }, (_, i) => i + 1).map(num => {
                  const session = myMentoring.find(m => m.week_number === num)
                  const isCompleted = session?.status === 'completed'
                  const isSigningOff = mentoringSignOffWeek === num && mentoringLoading

                  return (
                    <div key={num} className={`bg-white rounded-xl p-4 border ${
                      isCompleted ? 'border-green-200' : 'border-slate-100'
                    } shadow-sm flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          isCompleted ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {isCompleted ? '✓' : num}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-800">Week {num}</div>
                          {session?.session_date && (
                            <div className="text-xs text-slate-400">
                              {new Date(session.session_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          )}
                        </div>
                      </div>
                      {isCompleted ? (
                        <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Done</span>
                      ) : (
                        <button
                          onClick={() => handleMentoringSignOff(num)}
                          disabled={mentoringLoading}
                          className="bg-blue-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-blue-800 transition-colors disabled:opacity-50">
                          {isSigningOff ? '...' : 'Sign Off'}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* My Certificates section */}
            <div className="mt-10">
              <h3 className="text-xl font-bold text-blue-900 mb-2">My Certificates</h3>
              <p className="text-slate-500 text-sm mb-6">
                Certificates issued by your administrator appear here. You can print or save them as PDF.
              </p>
              {myCertificates.length === 0 ? (
                <div className="bg-white rounded-xl p-10 border border-slate-100 text-center">
                  <div className="text-4xl mb-3">🏆</div>
                  <p className="text-slate-500 text-sm">No certificates issued yet. Complete your training to earn your certificate.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {myCertificates.map(cert => (
                    <div key={cert.id}>
                      <div className="flex justify-end mb-3">
                        <Link
                          to={`/portal/certificate/${cert.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors flex items-center gap-2">
                          🖨️ Download / Print Certificate
                        </Link>
                      </div>
                      <div
                        className="bg-white border-8 border-double border-blue-900 rounded-2xl p-10 shadow-xl text-center relative overflow-hidden"
                        style={{ fontFamily: 'Georgia, serif' }}>
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-900 via-yellow-400 to-blue-900"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-900 via-yellow-400 to-blue-900"></div>
                        <div className="flex items-center justify-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-yellow-400 font-bold text-xl">K</span>
                          </div>
                          <div className="text-left">
                            <div className="text-blue-900 font-bold text-lg leading-tight">The Kajidori Collective</div>
                            <div className="text-slate-500 text-xs">Learning & Compliance Portal</div>
                          </div>
                        </div>
                        <div className="border-t border-b border-slate-200 py-6 mb-6">
                          <p className="text-slate-500 text-sm uppercase tracking-widest mb-3">Certificate of Completion</p>
                          <p className="text-slate-600 text-base mb-4">This is to certify that</p>
                          <h2 className="text-3xl font-bold text-blue-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                            {[profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || user?.email}
                          </h2>
                          <p className="text-slate-600 text-base mb-2">has successfully completed</p>
                          <h3 className="text-xl font-bold text-blue-900 mb-4">
                            {programmes.find(p => p.id === cert.programme_id)?.name || 'Training Programme'}
                          </h3>
                          <p className="text-slate-500 text-sm">
                            including the Full-Day Workshop and 10-Week Mentoring & Coaching Programme
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-6 text-center mb-6">
                          <div>
                            <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Date of Issue</div>
                            <div className="text-slate-700 font-semibold text-sm">
                              {cert.issue_date ? new Date(cert.issue_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Reference</div>
                            <div className="text-slate-700 font-semibold text-sm">{cert.reference_number || '—'}</div>
                          </div>
                          <div>
                            <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Issued By</div>
                            <div className="text-slate-700 font-semibold text-sm">Kajidori Collective</div>
                          </div>
                        </div>
                        <div className="flex justify-center gap-16 mt-4">
                          <div className="text-center">
                            <div className="border-t border-slate-400 pt-2 w-40">
                              <div className="text-xs text-slate-500">Authorised Signature</div>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="border-t border-slate-400 pt-2 w-40">
                              <div className="text-xs text-slate-500">Participant Signature</div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 text-xs text-slate-400">
                          This certificate is issued in accordance with CQC compliance standards and is valid as evidence of training completion.
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TEAM COMPLIANCE TAB */}
        {tab === 'Team Compliance' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-blue-900">Team Compliance Matrix</h2>
                <p className="text-slate-500 text-sm mt-1">Workshop attendance and mentoring progress per team member</p>
              </div>
              <button onClick={downloadComplianceCSV}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors flex items-center gap-2">
                📥 Export CSV
              </button>
            </div>

            {complianceMatrix.length === 0 ? (
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
                      <th className="text-center px-3 py-3 font-semibold text-slate-700 min-w-28">
                        <div className="text-xs leading-tight">🏫 Workshop Days</div>
                      </th>
                      <th className="text-center px-3 py-3 font-semibold text-slate-700 min-w-28">
                        <div className="text-xs leading-tight">🎯 Mentoring</div>
                      </th>
                      {programmes.map(p => (
                        <th key={p.id} className="text-center px-3 py-3 font-semibold text-slate-700 min-w-24">
                          <div className="text-xs leading-tight">{p.name}</div>
                        </th>
                      ))}
                      <th className="text-center px-3 py-3 font-semibold text-slate-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complianceMatrix.map(({ member, byProgramme, total, workshopDays, mentoringCompleted, isManager }) => (
                      <tr key={member.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">
                            {[member.first_name, member.last_name].filter(Boolean).join(' ') || member.email}
                          </div>
                          <div className="text-xs text-slate-400">
                            {isManager ? '👔 Manager' : member.job_title || member.email}
                          </div>
                        </td>
                        <td className="text-center px-3 py-3">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                            workshopDays > 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {workshopDays}
                          </span>
                        </td>
                        <td className="text-center px-3 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            mentoringCompleted >= 10 ? 'bg-green-100 text-green-700' :
                            mentoringCompleted > 0 ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-400'
                          }`}>
                            {mentoringCompleted}/10
                          </span>
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
                      <th className="text-left px-4 py-3 font-semibold text-slate-700">Session Type</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allAttendance.map(a => {
                      const isWorkshop = a.session_name?.startsWith('WORKSHOP:')
                      const isMentoring = a.session_name?.startsWith('MENTORING:')
                      return (
                        <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {a._member
                              ? `${a._member.first_name || ''} ${a._member.last_name || ''}`.trim() || a._member.email
                              : 'Unknown'}
                          </td>
                          <td className="px-4 py-3 text-slate-600">{a._programme?.name || '—'}</td>
                          <td className="px-4 py-3">
                            {isWorkshop ? (
                              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">🏫 Workshop</span>
                            ) : isMentoring ? (
                              <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full">🎯 Mentoring</span>
                            ) : (
                              <span className="text-slate-500 text-xs">{a.session_name}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {a.check_in_time
                              ? new Date(a.check_in_time).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                              : '—'}
                          </td>
                        </tr>
                      )
                    })}
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
                <p className="text-slate-500 text-sm mb-4">
                  Full compliance breakdown — workshop days, mentoring progress, and session counts per staff member.
                </p>
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
