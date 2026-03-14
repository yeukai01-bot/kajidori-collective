import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, TABLES } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const TABS = ['Overview', 'Check-In', 'Certificates', 'Mentoring']

export default function ParticipantDashboard() {
  const [tab, setTab] = useState('Overview')
  const { user, profile, signOut } = useAuth()
  const [programmes, setProgrammes] = useState([])
  const [attendance, setAttendance] = useState([])
  const [certificates, setCertificates] = useState([])
  const [mentoring, setMentoring] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkInProgramme, setCheckInProgramme] = useState('')
  const [checkInSession, setCheckInSession] = useState('')
  const [checkInMsg, setCheckInMsg] = useState('')
  const [checkInLoading, setCheckInLoading] = useState(false)
  const navigate = useNavigate()

  const displayName = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') || profile.email
    : user?.email || ''

  useEffect(() => {
    if (user) loadData()
  }, [user])

  const loadData = async () => {
    if (!user) return

    // Load all programmes
    const { data: p } = await supabase
      .from(TABLES.PROGRAMMES)
      .select('*')
      .order('name')
    setProgrammes(p || [])

    // Load my attendance
    const { data: a } = await supabase
      .from(TABLES.ATTENDANCE)
      .select(`*, ${TABLES.PROGRAMMES}(name)`)
      .eq('user_id', user.id)
      .order('check_in_time', { ascending: false })
    setAttendance(a || [])

    // Load my certificates
    const { data: c } = await supabase
      .from(TABLES.CERTIFICATES)
      .select(`*, ${TABLES.PROGRAMMES}(name)`)
      .eq('user_id', user.id)
      .order('issue_date', { ascending: false })
    setCertificates(c || [])

    // Load my mentoring sessions
    const { data: m } = await supabase
      .from(TABLES.MENTORING)
      .select('*')
      .eq('user_id', user.id)
      .order('week_number', { ascending: true })
    setMentoring(m || [])

    setLoading(false)
  }

  const handleCheckIn = async (e) => {
    e.preventDefault()
    setCheckInLoading(true)
    setCheckInMsg('')

    if (!checkInProgramme || !checkInSession.trim()) {
      setCheckInMsg('❌ Please select a programme and enter the session name.')
      setCheckInLoading(false)
      return
    }

    // Check if already checked in for this programme + session
    const { data: existing } = await supabase
      .from(TABLES.ATTENDANCE)
      .select('id')
      .eq('user_id', user.id)
      .eq('programme_id', checkInProgramme)
      .eq('session_name', checkInSession.trim())
      .single()

    if (existing) {
      setCheckInMsg('ℹ️ You have already checked in for this session.')
      setCheckInLoading(false)
      return
    }

    // Record attendance
    const { error } = await supabase
      .from(TABLES.ATTENDANCE)
      .insert([{
        user_id: user.id,
        programme_id: checkInProgramme,
        session_name: checkInSession.trim(),
        check_in_time: new Date().toISOString(),
      }])

    if (error) {
      setCheckInMsg('❌ Check-in failed. Please try again.')
    } else {
      setCheckInMsg('✅ Successfully checked in! Your attendance has been recorded.')
      setCheckInProgramme('')
      setCheckInSession('')
      loadData()
    }
    setCheckInLoading(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/portal/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-500 text-sm">Loading your dashboard...</p>
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
            <div className="text-blue-300 text-xs">Participant Portal</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-blue-200 text-sm hidden sm:block">{displayName}</span>
          <button onClick={handleSignOut} className="text-blue-300 hover:text-white text-sm transition-colors">Sign Out</button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex gap-0 max-w-4xl mx-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
                tab === t ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* OVERVIEW TAB */}
        {tab === 'Overview' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">
              Welcome back{profile?.first_name ? `, ${profile.first_name}` : ''}!
            </h2>
            <p className="text-slate-500 mb-8 text-sm">Here's a summary of your training progress.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Sessions Attended', value: attendance.length, icon: '📋' },
                { label: 'Certificates Earned', value: certificates.filter(c => c.status === 'issued').length, icon: '🏆' },
                { label: 'Mentoring Completed', value: mentoring.filter(m => m.status === 'completed').length, icon: '🎯' },
                { label: 'Mentoring Progress', value: `${mentoring.filter(m => m.status === 'completed').length}/10`, icon: '📈' },
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
                <button onClick={() => setTab('Check-In')} className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
                  📋 Check In to a Session
                </button>
                <button onClick={() => setTab('Certificates')} className="bg-white text-blue-900 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                  🏆 View Certificates
                </button>
                <button onClick={() => setTab('Mentoring')} className="bg-white text-blue-900 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                  🎯 Mentoring Tracker
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CHECK-IN TAB */}
        {tab === 'Check-In' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Session Check-In</h2>
            <p className="text-slate-500 mb-8 text-sm">Select your programme and enter the session name provided by your trainer to record your attendance.</p>

            <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm max-w-md mb-8">
              <form onSubmit={handleCheckIn} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Programme</label>
                  <select
                    value={checkInProgramme}
                    onChange={e => setCheckInProgramme(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Select a programme...</option>
                    {programmes.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Session Name / Number</label>
                  <input
                    type="text"
                    value={checkInSession}
                    onChange={e => setCheckInSession(e.target.value)}
                    placeholder="e.g. Session 3 or Week 2"
                    required
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">Enter the session name exactly as shown by your trainer</p>
                </div>
                {checkInMsg && (
                  <div className={`px-4 py-3 rounded-lg text-sm ${checkInMsg.startsWith('✅') ? 'bg-green-50 text-green-700' : checkInMsg.startsWith('ℹ️') ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                    {checkInMsg}
                  </div>
                )}
                <button type="submit" disabled={checkInLoading}
                  className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50">
                  {checkInLoading ? 'Checking in...' : 'Record My Attendance'}
                </button>
              </form>
            </div>

            {attendance.length > 0 && (
              <div>
                <h3 className="font-semibold text-blue-900 mb-4">Your Attendance History</h3>
                <div className="space-y-3">
                  {attendance.map(a => (
                    <div key={a.id} className="bg-white rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-800 text-sm">
                          {a[TABLES.PROGRAMMES]?.name || 'Training Programme'}
                        </div>
                        <div className="text-slate-500 text-xs mt-0.5">
                          {a.session_name} •{' '}
                          {a.check_in_time
                            ? new Date(a.check_in_time).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                            : 'Date not set'}
                        </div>
                      </div>
                      <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Present</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CERTIFICATES TAB */}
        {tab === 'Certificates' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">My Certificates</h2>
            <p className="text-slate-500 mb-8 text-sm">Certificates are issued upon completing a training programme.</p>

            {certificates.length === 0 ? (
              <div className="bg-white rounded-xl p-12 border border-slate-100 text-center">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="font-semibold text-slate-700 mb-2">No certificates yet</h3>
                <p className="text-slate-500 text-sm">Complete a training programme to earn your first certificate.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {certificates.map(cert => (
                  <div key={cert.id} className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">🏆</div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        cert.status === 'issued' ? 'bg-yellow-100 text-yellow-800' :
                        cert.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {cert.status === 'issued' ? 'Certified' : cert.status === 'in_progress' ? 'In Progress' : cert.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-blue-900 mb-1">
                      {cert[TABLES.PROGRAMMES]?.name || 'Training Certificate'}
                    </h3>
                    {cert.progress_percent !== null && cert.progress_percent !== undefined && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Progress</span>
                          <span>{cert.progress_percent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-blue-900 h-2 rounded-full" style={{ width: `${cert.progress_percent}%` }}></div>
                        </div>
                      </div>
                    )}
                    <p className="text-slate-500 text-xs mb-2">
                      {cert.issue_date
                        ? `Issued: ${new Date(cert.issue_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
                        : 'Not yet issued'}
                    </p>
                    {cert.reference_number && (
                      <div className="text-xs text-slate-400">Ref: {cert.reference_number}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MENTORING TAB */}
        {tab === 'Mentoring' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">10-Week Mentoring Programme</h2>
            <p className="text-slate-500 mb-8 text-sm">Track your progress through the leadership mentoring programme.</p>

            {/* Progress bar */}
            {mentoring.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">Overall Progress</span>
                  <span className="text-sm font-bold text-blue-900">
                    {mentoring.filter(m => m.status === 'completed').length} / 10 sessions
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className="bg-blue-900 h-3 rounded-full transition-all"
                    style={{ width: `${(mentoring.filter(m => m.status === 'completed').length / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {mentoring.length === 0 ? (
              <div className="bg-white rounded-xl p-12 border border-slate-100 text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="font-semibold text-slate-700 mb-2">No mentoring sessions yet</h3>
                <p className="text-slate-500 text-sm">Your mentor will set up your 10-week programme. Contact Kajidori Collective to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Array.from({ length: 10 }, (_, i) => i + 1).map(num => {
                  const session = mentoring.find(m => m.week_number === num)
                  return (
                    <div key={num} className={`bg-white rounded-xl p-5 border ${session?.status === 'completed' ? 'border-green-200' : 'border-slate-100'} shadow-sm`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            session?.status === 'completed' ? 'bg-green-100 text-green-700' :
                            session?.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-400'
                          }`}>
                            {session?.status === 'completed' ? '✓' : num}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800 text-sm">Week {num}</div>
                            {session?.session_date && (
                              <div className="text-slate-500 text-xs">
                                {new Date(session.session_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                          session?.status === 'completed' ? 'bg-green-100 text-green-700' :
                          session?.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {session?.status === 'completed' ? 'Completed' :
                           session?.status === 'scheduled' ? 'Scheduled' : 'Pending'}
                        </span>
                      </div>
                      {session?.goal && (
                        <div className="mt-3 pl-11">
                          <div className="text-xs font-medium text-slate-500 mb-1">Goal</div>
                          <p className="text-sm text-slate-700">{session.goal}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
