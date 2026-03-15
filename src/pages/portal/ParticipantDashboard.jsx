import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase, TABLES } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const TABS = ['Overview', 'Check-In', 'Certificates', 'Mentoring', 'Feedback', 'Leave a Review', 'My Profile']

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

export default function ParticipantDashboard() {
  const [tab, setTab] = useState('Overview')
  const { user, profile, signOut } = useAuth()
  const [programmes, setProgrammes] = useState([])
  const [attendance, setAttendance] = useState([])
  const [certificates, setCertificates] = useState([])
  const [mentoring, setMentoring] = useState([])
  const [loading, setLoading] = useState(true)
  // Feedback state
  const [feedbackForm, setFeedbackForm] = useState({ overall_rating: 5, content_rating: 5, delivery_rating: 5, would_recommend: true, most_useful: '', improvements: '', additional_comments: '' })
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false)
  const [feedbackDone, setFeedbackDone] = useState(false)
  // Review state
  const [reviewForm, setReviewForm] = useState({ rating: 5, headline: '', review_text: '', service_type: 'training' })
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewDone, setReviewDone] = useState(false)

  // Profile photo state
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [avatarMsg, setAvatarMsg] = useState('')
  // Workshop check-in state
  const [workshopProgramme, setWorkshopProgramme] = useState('')
  const [workshopDate, setWorkshopDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedModules, setSelectedModules] = useState({})
  const [workshopMsg, setWorkshopMsg] = useState('')
  const [workshopLoading, setWorkshopLoading] = useState(false)

  // Mentoring sign-off state
  const [mentoringSignOffWeek, setMentoringSignOffWeek] = useState(null)
  const [mentoringMsg, setMentoringMsg] = useState('')
  const [mentoringLoading, setMentoringLoading] = useState(false)

  const navigate = useNavigate()

  const displayName = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') || profile.email
    : user?.email || ''

  useEffect(() => {
    if (user) loadData()
  }, [user])

  const loadData = async () => {
    if (!user) return

    const { data: p } = await supabase.from(TABLES.PROGRAMMES).select('*').order('name')
    setProgrammes(p || [])

    const { data: a } = await supabase
      .from(TABLES.ATTENDANCE)
      .select('*')
      .eq('user_id', user.id)
      .order('check_in_time', { ascending: false })
    setAttendance(a || [])

    const { data: c } = await supabase
      .from(TABLES.CERTIFICATES)
      .select('*')
      .eq('user_id', user.id)
      .order('issue_date', { ascending: false })
    setCertificates(c || [])

    const { data: m } = await supabase
      .from(TABLES.MENTORING)
      .select('*')
      .eq('user_id', user.id)
      .order('week_number', { ascending: true })
    setMentoring(m || [])

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

    // Check for duplicate workshop record on same date
    const { data: existing } = await supabase
      .from(TABLES.ATTENDANCE)
      .select('id')
      .eq('user_id', user.id)
      .eq('programme_id', workshopProgramme)
      .ilike('session_name', 'WORKSHOP:%')
      .gte('check_in_time', workshopDate + 'T00:00:00')
      .lte('check_in_time', workshopDate + 'T23:59:59')

    if (existing && existing.length > 0) {
      setWorkshopMsg('ℹ️ You have already submitted a workshop check-in for this date. Contact your trainer to amend it.')
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

    // Check if a mentoring session exists for this week
    const existing = mentoring.find(m => m.week_number === weekNumber)

    if (existing) {
      // Update status to completed
      const { error } = await supabase
        .from(TABLES.MENTORING)
        .update({ status: 'completed' })
        .eq('id', existing.id)

      if (error) {
        setMentoringMsg(`❌ Could not sign off Week ${weekNumber}. Please try again.`)
      } else {
        setMentoringMsg(`✅ Week ${weekNumber} mentoring session signed off successfully.`)
        loadData()
      }
    } else {
      // Create a new mentoring record for this week
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
        setMentoringMsg(`❌ Could not sign off Week ${weekNumber}. Please try again.`)
      } else {
        setMentoringMsg(`✅ Week ${weekNumber} mentoring session signed off successfully.`)
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

  // Parse workshop records from attendance
  const workshopRecords = attendance.filter(a => a.session_name?.startsWith('WORKSHOP:'))
  const mentoringAttendance = attendance.filter(a => a.session_name?.startsWith('MENTORING:'))

  // Get programme name from programmes list
  const getProgrammeName = (progId) => programmes.find(p => p.id === progId)?.name || 'Training Programme'

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
            <p className="text-slate-500 mb-8 text-sm">Here is a summary of your training progress.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Workshop Days', value: workshopRecords.length, icon: '🏫' },
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
                  📋 Log Workshop Attendance
                </button>
                <button onClick={() => setTab('Mentoring')} className="bg-white text-blue-900 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                  🎯 Mentoring Tracker
                </button>
                <button onClick={() => setTab('Certificates')} className="bg-white text-blue-900 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                  🏆 View Certificates
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CHECK-IN TAB */}
        {tab === 'Check-In' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Full-Day Workshop Check-In</h2>
            <p className="text-slate-500 mb-8 text-sm">
              Tick every session you attended during the full-day workshop. Your trainer will confirm your attendance.
              This record is used for CQC compliance evidence.
            </p>

            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm mb-8">
              <form onSubmit={handleWorkshopCheckIn} className="space-y-5">

                {/* Programme selector */}
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

                {/* Workshop date */}
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

                {/* Session tick boxes */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Sessions Attended</label>
                  <p className="text-xs text-slate-400 mb-3">Tick every session you attended during the workshop day.</p>
                  <div className="space-y-2">
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
                          <div className="text-sm font-medium text-slate-800">{session.label}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-400">{session.duration}</span>
                            {!session.core && (
                              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Optional</span>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    {Object.values(selectedModules).filter(Boolean).length} of {WORKSHOP_SESSIONS.length} sessions selected
                  </p>
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
                  className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50">
                  {workshopLoading ? 'Submitting...' : 'Submit Workshop Attendance'}
                </button>
              </form>
            </div>

            {/* Workshop history */}
            {workshopRecords.length > 0 && (
              <div>
                <h3 className="font-semibold text-blue-900 mb-4">Your Workshop History</h3>
                <div className="space-y-3">
                  {workshopRecords.map(a => {
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
              </div>
            )}
          </div>
        )}

        {/* CERTIFICATES TAB */}
        {tab === 'Certificates' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">My Certificates</h2>
            <p className="text-slate-500 mb-8 text-sm">
              Certificates are issued by your administrator upon completing a training programme.
              Once issued, you can print or save your certificate as a PDF.
            </p>

            {certificates.filter(c => c.status === 'issued').length === 0 ? (
              <div className="bg-white rounded-xl p-12 border border-slate-100 text-center">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="font-semibold text-slate-700 mb-2">No certificates issued yet</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                  Your administrator will issue your certificate once you have completed your full-day workshop
                  and mentoring programme. Keep logging your attendance and mentoring sessions.
                </p>
                <div className="mt-6 flex gap-3 justify-center">
                  <button onClick={() => setTab('Check-In')}
                    className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
                    📋 Log Workshop Attendance
                  </button>
                  <button onClick={() => setTab('Mentoring')}
                    className="bg-white text-blue-900 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                    🎯 Mentoring Tracker
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {certificates.filter(c => c.status === 'issued').map(cert => (
                  <div key={cert.id}>
                    {/* Download / Print button */}
                    <div className="flex justify-end mb-3 gap-3">
                      <Link
                        to={`/portal/certificate/${cert.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors flex items-center gap-2">
                        🖨️ Download / Print Certificate
                      </Link>
                    </div>

                    {/* Certificate design */}
                    <div
                      id={`certificate-${cert.id}`}
                      className="bg-white border-8 border-double border-blue-900 rounded-2xl p-10 shadow-xl text-center relative overflow-hidden print:shadow-none print:break-inside-avoid"
                      style={{ fontFamily: 'Georgia, serif' }}>

                      {/* Decorative top bar */}
                      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-900 via-yellow-400 to-blue-900"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-900 via-yellow-400 to-blue-900"></div>

                      {/* Logo / org name */}
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
                          {getProgrammeName(cert.programme_id)}
                        </h3>
                        <p className="text-slate-500 text-sm">
                          including the Full-Day Workshop and 10-Week Mentoring & Coaching Programme
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-6 text-center mb-6">
                        <div>
                          <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Date of Issue</div>
                          <div className="text-slate-700 font-semibold text-sm">
                            {cert.issue_date
                              ? new Date(cert.issue_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                              : '—'}
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

                      {/* Signature line */}
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
        )}

        {/* MENTORING TAB */}
        {tab === 'Mentoring' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">10-Week Mentoring & Coaching Programme</h2>
            <p className="text-slate-500 mb-6 text-sm">
              Your trainer will visit your workplace each week for one-to-one mentoring, observation, and coaching
              on the topics covered during the full-day workshop. Sign off each session once your visit is complete.
            </p>

            {/* Progress bar */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-700">Overall Progress</span>
                <span className="text-sm font-bold text-blue-900">
                  {mentoring.filter(m => m.status === 'completed').length} / 10 sessions completed
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div
                  className="bg-blue-900 h-3 rounded-full transition-all"
                  style={{ width: `${(mentoring.filter(m => m.status === 'completed').length / 10) * 100}%` }}
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

            <div className="space-y-3">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(num => {
                const session = mentoring.find(m => m.week_number === num)
                const isCompleted = session?.status === 'completed'
                const isScheduled = session?.status === 'scheduled'
                const isSigningOff = mentoringSignOffWeek === num && mentoringLoading

                return (
                  <div key={num} className={`bg-white rounded-xl p-5 border ${
                    isCompleted ? 'border-green-200' : 'border-slate-100'
                  } shadow-sm`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          isCompleted ? 'bg-green-100 text-green-700' :
                          isScheduled ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-400'
                        }`}>
                          {isCompleted ? '✓' : num}
                        </div>
                        <div>
                          <div className="font-medium text-slate-800 text-sm">Week {num} — Workplace Visit</div>
                          {session?.session_date && (
                            <div className="text-slate-500 text-xs mt-0.5">
                              {new Date(session.session_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                          )}
                          {session?.goal && (
                            <div className="text-slate-500 text-xs mt-0.5 max-w-md">{session.goal}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isCompleted ? (
                          <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
                            Signed Off
                          </span>
                        ) : isScheduled ? (
                          <button
                            onClick={() => handleMentoringSignOff(num)}
                            disabled={mentoringLoading}
                            className="bg-blue-900 text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-blue-800 transition-colors disabled:opacity-50">
                            {isSigningOff ? 'Signing off...' : 'Sign Off Visit'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMentoringSignOff(num)}
                            disabled={mentoringLoading}
                            className="bg-slate-100 text-slate-600 text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-slate-200 transition-colors disabled:opacity-50">
                            {isSigningOff ? 'Signing off...' : 'Log This Visit'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* FEEDBACK TAB */}
        {tab === 'Feedback' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Leave Feedback</h2>
            <p className="text-slate-500 text-sm mb-6">Your feedback helps us improve the training. All responses go directly to Yeukai at The Kajidori Collective.</p>
            {feedbackDone ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <div className="text-4xl mb-3">🙏</div>
                <h3 className="font-bold text-green-800 mb-2">Thank you for your feedback!</h3>
                <p className="text-green-700 text-sm">Your response has been received and will help shape future training.</p>
              </div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault(); setFeedbackSubmitting(true)
                const { error } = await supabase.from('feedback_kajidori').insert([{
                  user_name: [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || user?.email,
                  user_role: profile?.role || 'participant',
                  organisation: profile?.organisations_1741860000000?.name || null,
                  overall_rating: feedbackForm.overall_rating,
                  content_rating: feedbackForm.content_rating,
                  delivery_rating: feedbackForm.delivery_rating,
                  would_recommend: feedbackForm.would_recommend,
                  most_useful: feedbackForm.most_useful || null,
                  improvements: feedbackForm.improvements || null,
                  additional_comments: feedbackForm.additional_comments || null,
                }])
                setFeedbackSubmitting(false)
                if (!error) setFeedbackDone(true)
              }} className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Overall Rating</label>
                  <div className="flex gap-2">{[1,2,3,4,5].map(s => <button key={s} type="button" onClick={() => setFeedbackForm(f => ({...f, overall_rating: s}))} className={`text-2xl ${s <= feedbackForm.overall_rating ? 'text-yellow-400' : 'text-slate-200'}`}>★</button>)}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Content Quality</label>
                    <div className="flex gap-1">{[1,2,3,4,5].map(s => <button key={s} type="button" onClick={() => setFeedbackForm(f => ({...f, content_rating: s}))} className={`text-xl ${s <= feedbackForm.content_rating ? 'text-yellow-400' : 'text-slate-200'}`}>★</button>)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Delivery Quality</label>
                    <div className="flex gap-1">{[1,2,3,4,5].map(s => <button key={s} type="button" onClick={() => setFeedbackForm(f => ({...f, delivery_rating: s}))} className={`text-xl ${s <= feedbackForm.delivery_rating ? 'text-yellow-400' : 'text-slate-200'}`}>★</button>)}</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Would you recommend this training?</label>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setFeedbackForm(f => ({...f, would_recommend: true}))} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${feedbackForm.would_recommend ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-600 border-slate-200'}`}>✅ Yes</button>
                    <button type="button" onClick={() => setFeedbackForm(f => ({...f, would_recommend: false}))} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${!feedbackForm.would_recommend ? 'bg-red-500 text-white border-red-500' : 'bg-white text-slate-600 border-slate-200'}`}>❌ No</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">What did you find most useful?</label>
                  <textarea value={feedbackForm.most_useful} onChange={e => setFeedbackForm(f => ({...f, most_useful: e.target.value}))} rows={3} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="e.g. The safeguarding module, the group discussions..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">How could we improve?</label>
                  <textarea value={feedbackForm.improvements} onChange={e => setFeedbackForm(f => ({...f, improvements: e.target.value}))} rows={3} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Any suggestions for improvement..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Any other comments?</label>
                  <textarea value={feedbackForm.additional_comments} onChange={e => setFeedbackForm(f => ({...f, additional_comments: e.target.value}))} rows={3} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Anything else you'd like to share..." />
                </div>
                <button type="submit" disabled={feedbackSubmitting} className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold text-sm hover:bg-blue-800 transition-colors disabled:opacity-50">{feedbackSubmitting ? 'Submitting...' : 'Submit Feedback'}</button>
              </form>
            )}
          </div>
        )}

        {/* MY PROFILE TAB */}
        {tab === 'My Profile' && (
          <div className="max-w-lg">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">My Profile</h2>
            <p className="text-slate-500 text-sm mb-6">Upload a profile photo. It will appear alongside any approved reviews on our website.</p>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <div className="flex flex-col items-center gap-4">
                {(avatarUrl || profile?.avatar_url) ? (
                  <img src={avatarUrl || profile?.avatar_url} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 shadow" />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-900">
                    {(profile?.first_name?.[0] || user?.email?.[0] || '?').toUpperCase()}
                  </div>
                )}
                <div className="text-center">
                  <p className="font-semibold text-slate-800">{[profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || user?.email}</p>
                  <p className="text-sm text-slate-500 capitalize">{profile?.role || 'Participant'} &middot; {profile?.organisations_1741860000000?.name || 'No organisation'}</p>
                </div>
                <label className="cursor-pointer">
                  <span className="inline-block bg-blue-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">
                    {avatarUploading ? 'Uploading...' : 'Upload Photo'}
                  </span>
                  <input type="file" accept="image/*" className="hidden" disabled={avatarUploading} onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file || !user) return
                    setAvatarUploading(true); setAvatarMsg('')
                    const ext = file.name.split('.').pop()
                    const path = `${user.id}/avatar.${ext}`
                    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
                    if (upErr) { setAvatarMsg('Upload failed: ' + upErr.message); setAvatarUploading(false); return }
                    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
                    const { error: dbErr } = await supabase.from('portal_users_1741860000000').update({ avatar_url: publicUrl }).eq('id', user.id)
                    if (dbErr) { setAvatarMsg('Saved photo but could not update profile: ' + dbErr.message) }
                    else { setAvatarUrl(publicUrl); setAvatarMsg('Profile photo updated!') }
                    setAvatarUploading(false)
                  }} />
                </label>
                {avatarMsg && <p className={`text-sm ${avatarMsg.startsWith('Profile') ? 'text-green-600' : 'text-red-500'}`}>{avatarMsg}</p>}
                <p className="text-xs text-slate-400 text-center">Accepted formats: JPG, PNG, GIF. Max 5MB.<br/>Your photo will appear on approved reviews on our website.</p>
              </div>
            </div>
          </div>
        )}
        {/* LEAVE A REVIEW TAB */}
        {tab === 'Leave a Review' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Leave a Review</h2>
            <p className="text-slate-500 text-sm mb-6">Share your experience to help others. Approved reviews may be featured on our website as testimonials.</p>
            {reviewDone ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <div className="text-4xl mb-3">⭐</div>
                <h3 className="font-bold text-green-800 mb-2">Thank you for your review!</h3>
                <p className="text-green-700 text-sm">Your review has been submitted and will appear on our website once approved by Yeukai.</p>
              </div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault(); setReviewSubmitting(true)
                const { error } = await supabase.from('reviews_kajidori').insert([{
                  reviewer_name: [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || user?.email,
                  reviewer_role: profile?.role || 'participant',
                  organisation: profile?.organisations_1741860000000?.name || null,
                  service_type: reviewForm.service_type,
                  rating: reviewForm.rating,
                  headline: reviewForm.headline || null,
                  review_text: reviewForm.review_text,
                  approved: false,
                  user_id: user?.id || null,
                  reviewer_avatar: profile?.avatar_url || avatarUrl || null,
                }])
                setReviewSubmitting(false)
                if (!error) setReviewDone(true)
              }} className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Which service are you reviewing?</label>
                  <div className="flex flex-wrap gap-2">
                    {[{id:'training',label:'🧠 Mental Health Training'},{id:'consulting',label:'🏛️ Strategic Consulting'},{id:'mentoring',label:'🎯 Leadership Mentoring'}].map(s => (
                      <button key={s.id} type="button" onClick={() => setReviewForm(f => ({...f, service_type: s.id}))} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${reviewForm.service_type === s.id ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-slate-600 border-slate-200'}`}>{s.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Your Rating</label>
                  <div className="flex gap-2">{[1,2,3,4,5].map(s => <button key={s} type="button" onClick={() => setReviewForm(f => ({...f, rating: s}))} className={`text-3xl ${s <= reviewForm.rating ? 'text-yellow-400' : 'text-slate-200'}`}>★</button>)}</div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Review Headline <span className="text-red-500">*</span></label>
                  <input required value={reviewForm.headline} onChange={e => setReviewForm(f => ({...f, headline: e.target.value}))} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Transformative training that changed how I work" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Your Review <span className="text-red-500">*</span></label>
                  <textarea required value={reviewForm.review_text} onChange={e => setReviewForm(f => ({...f, review_text: e.target.value}))} rows={5} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Share your experience in detail — what you learned, how it helped you, what stood out..." />
                </div>
                <button type="submit" disabled={reviewSubmitting} className="w-full bg-yellow-400 text-blue-900 py-3 rounded-lg font-bold text-sm hover:bg-yellow-300 transition-colors disabled:opacity-50">{reviewSubmitting ? 'Submitting...' : '⭐ Submit Review'}</button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
