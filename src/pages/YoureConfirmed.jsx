import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const YEUKAI_PHOTO = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663231528991/jPaHykWfLrMYEDWA.jpeg'

const mediaLogos = [
  { name: 'BBC', style: 'font-bold text-lg tracking-tight' },
  { name: 'ITV', style: 'font-bold text-lg tracking-tight' },
  { name: 'Sky News', style: 'font-bold text-base tracking-tight' },
  { name: 'Bloomberg', style: 'font-bold text-base tracking-tight' },
  { name: 'Forbes', style: 'font-bold italic text-lg tracking-tight' },
]

const guestQuotes = [
  {
    quote: "Yeukai asks the questions that get to the heart of what you actually do. It was one of the most genuine conversations I've had on a podcast.",
    name: 'Care Group CEO',
    title: 'Outstanding-rated provider, South East England',
  },
  {
    quote: "I came in thinking it was a standard interview. I left with a clearer picture of my own leadership story. Highly recommend.",
    name: 'Registered Manager',
    title: 'NHS-commissioned residential service',
  },
  {
    quote: "The production team made everything effortless. The recording we received was professional enough to share at our board meeting.",
    name: 'Operations Director',
    title: 'National care group, 14 locations',
  },
]

const whatToExpect = [
  {
    icon: '🎙️',
    title: 'A relaxed, candid conversation',
    desc: 'No script, no trick questions. Yeukai leads a genuine dialogue about your work, your leadership journey, and what the sector needs to hear.',
  },
  {
    icon: '🎬',
    title: 'We handle all production',
    desc: 'Audio, editing, show notes, and distribution — fully managed. You show up and talk. We do the rest.',
  },
  {
    icon: '📦',
    title: 'You receive the full recording',
    desc: 'After broadcast, you receive the edited audio file and a set of social media assets ready to share with your own network.',
  },
]

export default function YoureConfirmed() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-white min-h-screen">

      {/* ── HERO CONFIRMATION BANNER ── */}
      <section className="bg-blue-900 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Checkmark */}
          <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-yellow-400 font-semibold text-sm uppercase tracking-widest mb-3">You're confirmed</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Your session is booked.
          </h1>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            Check your inbox — a calendar invitation and Google Meet link are on their way. Everything you need is below.
          </p>
        </div>
      </section>

      {/* ── CALENDAR ACTION BANNER ── */}
      <section className="bg-yellow-400 py-6 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="text-4xl flex-shrink-0">📅</div>
          <div className="flex-1">
            <p className="font-bold text-blue-900 text-lg leading-snug">
              Do this now — before you close this page.
            </p>
            <p className="text-blue-900 text-sm mt-1">
              Open your email and click the calendar invite to add your session to your diary. It takes 10 seconds. Guests who do this almost never miss their session.
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-blue-900 text-yellow-400 px-5 py-3 rounded-lg font-bold text-sm text-center leading-tight">
              📧 Check your inbox now
              <span className="block text-xs font-normal text-blue-300 mt-1">Look for the calendar invite email</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT HAPPENS NEXT ── */}
      <section className="py-14 px-4 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-blue-900 text-center mb-10">What happens next</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Check your email', desc: 'A confirmation email with your Google Meet link and calendar invite has been sent. Add it to your diary now so it doesn’t get lost.' },
              { step: '2', title: 'No preparation needed', desc: 'Just show up as yourself. Yeukai will guide the conversation — there are no wrong answers and no script to follow.' },
              { step: '3', title: 'Receive your assets', desc: 'Within 5–7 working days of recording, you\'ll receive the edited episode and social media graphics to share with your network.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="w-10 h-10 bg-yellow-400 text-blue-900 rounded-full flex items-center justify-center font-bold text-lg mb-4 flex-shrink-0">
                  {step}
                </div>
                <h3 className="font-semibold text-blue-900 text-base mb-2">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT TO EXPECT ── */}
      <section className="py-14 px-4 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-blue-900 text-center mb-2">What to expect on the day</h2>
          <p className="text-slate-500 text-center text-sm mb-10">Kajidori Collective Conversations is designed to be the easiest yes you make all week.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {whatToExpect.map(({ icon, title, desc }) => (
              <div key={title} className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-semibold text-blue-900 text-base mb-2">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT THE SHOW ── */}
      <section className="py-14 px-4 bg-blue-900 text-white border-b border-blue-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-10">
            <div className="flex-shrink-0">
              <img
                src={YEUKAI_PHOTO}
                alt="Yeukai Kajidori"
                className="w-40 h-40 rounded-full object-cover object-top border-4 border-yellow-400 shadow-xl"
              />
            </div>
            <div>
              <p className="text-yellow-400 font-semibold text-xs uppercase tracking-widest mb-2">About your host</p>
              <h2 className="font-display text-2xl font-bold mb-3">Yeukai Kajidori</h2>
              <p className="text-blue-200 text-sm leading-relaxed mb-4">
                Yeukai is a CQC Registered Manager, MBA-qualified strategist, and Amazon bestselling author with over 20 years in UK health and social care. Since 2016 he has hosted the Yeukai Business Show — one of the UK's leading business podcasts — interviewing more than 584 global leaders across nine years.
              </p>
              <p className="text-blue-200 text-sm leading-relaxed">
                Kajidori Collective Conversations is his dedicated platform for the care sector: a space where registered managers, care group CEOs, and commissioners share the real story behind outstanding care.
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-10 border-t border-blue-800">
            {[
              { stat: '584+', label: 'Episodes recorded' },
              { stat: '9', label: 'Years on air' },
              { stat: '20+', label: 'Years in social care' },
              { stat: '#3', label: 'iTunes UK Business ranking' },
            ].map(({ stat, label }) => (
              <div key={label} className="text-center">
                <div className="text-yellow-400 font-bold text-2xl">{stat}</div>
                <div className="text-blue-300 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Media logos */}
          <div className="mt-8 pt-8 border-t border-blue-800">
            <p className="text-blue-400 text-xs uppercase tracking-widest text-center mb-4">Featured in</p>
            <div className="flex flex-wrap justify-center gap-6 items-center">
              {mediaLogos.map(({ name, style }) => (
                <span key={name} className={`text-blue-200 opacity-70 ${style}`}>{name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GUEST QUOTES ── */}
      <section className="py-14 px-4 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-blue-900 text-center mb-2">What previous guests say</h2>
          <p className="text-slate-500 text-center text-sm mb-10">You are in good company.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {guestQuotes.map(({ quote, name, title }) => (
              <div key={name} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <svg className="w-6 h-6 text-yellow-400 mb-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-slate-700 text-sm leading-relaxed mb-4 italic">"{quote}"</p>
                <div>
                  <p className="font-semibold text-blue-900 text-sm">{name}</p>
                  <p className="text-slate-500 text-xs">{title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHILE YOU WAIT — SERVICES PRE-FRAME ── */}
      <section className="py-14 px-4 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-yellow-500 font-semibold text-xs uppercase tracking-widest mb-2">While you wait</p>
          <h2 className="font-display text-2xl font-bold text-blue-900 mb-4">
            How The Kajidori Collective works with care organisations
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-xl mx-auto">
            Many of our guests tell us that the conversation sparked ideas about their own team's training, compliance, and leadership development. If that resonates with you, take a look at how we work with care providers across the UK.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left mb-8">
            {[
              { icon: '🏛️', title: 'Strategic Consulting', desc: 'CQC compliance, service improvement, and organisational growth — virtual or on-site.' },
              { icon: '🧠', title: 'Mental Health Training', desc: 'Certified group training for professionals in mental health and complex needs settings.' },
              { icon: '🎯', title: 'Leadership Mentoring', desc: 'Structured coaching for CEOs, Registered Managers, and Operations Directors.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-2xl mb-2">{icon}</div>
                <h3 className="font-semibold text-blue-900 text-sm mb-1">{title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <Link
            to="/services"
            className="inline-block bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold text-sm hover:bg-blue-800 transition-colors"
          >
            Explore how we work with care providers →
          </Link>
        </div>
      </section>

      {/* ── LINKEDIN CTA ── */}
      <section className="py-12 px-4 bg-blue-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-xl font-bold mb-3">Stay connected between now and your session</h2>
          <p className="text-blue-200 text-sm mb-6">
            Follow Yeukai on LinkedIn for sector insights, episode releases, and leadership perspectives from across UK health and social care.
          </p>
          <a
            href="https://www.linkedin.com/in/yeukai-kajidori/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 px-6 py-3 rounded-lg font-semibold text-sm hover:bg-yellow-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Follow Yeukai on LinkedIn
          </a>
        </div>
      </section>

    </div>
  )
}
