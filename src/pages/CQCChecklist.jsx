import { useState } from 'react'

const PHOTO_SMILING = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663231528991/jPaHykWfLrMYEDWA.jpeg'

const FIVE_KEYS = [
  { key: 'Safe', num: '01', desc: 'Medication management, safeguarding, risk assessments, incident reporting' },
  { key: 'Effective', num: '02', desc: 'Care planning, staff training, evidence-based practice, outcomes' },
  { key: 'Caring', num: '03', desc: 'Dignity, person-centred care, emotional support, involvement' },
  { key: 'Responsive', num: '04', desc: 'Complaints handling, care reviews, meeting individual needs' },
  { key: 'Well-led', num: '05', desc: 'Governance, culture, leadership quality, continuous improvement' },
]

const SOCIAL_PROOF = [
  { quote: 'After working with Yeukai, we went from Requires Improvement to Good in under 6 months. The checklist alone identified 14 gaps we had no idea existed.', name: 'Registered Manager', org: 'Residential Care Home, West Midlands' },
  { quote: 'I wish I had found this resource before our last inspection. Straightforward, practical, and written by someone who actually understands the sector.', name: 'Operations Director', org: 'Domiciliary Care Provider, London' },
  { quote: 'We used the checklist as a team exercise. It opened conversations we had been avoiding for months. Highly recommend.', name: 'Deputy Manager', org: 'Supported Living, Yorkshire' },
]

const URGENCY_STATS = [
  { value: '38%', label: 'of CQC-registered services rated Requires Improvement or Inadequate', source: 'CQC State of Care 2024' },
  { value: '72hrs', label: 'average notice before a CQC inspection — are you ready?', source: 'CQC Guidance 2024' },
  { value: '£0', label: 'cost to download — but the cost of being unprepared is enormous', source: '' },
]

// Brand colours matching kajidoricollective.co.uk exactly:
// Primary navy:  #1e3a8a  (blue-800)
// Darker navy:   #172554  (blue-950)
// Yellow accent: #facc15  (yellow-400)
// White sections: #f8fafc (slate-50)

export default function CQCChecklist() {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Submit to Brevo — list #2 (CQC Checklist Downloads), with first name attribute
    try {
      await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          attributes: { FIRSTNAME: firstName },
          listIds: [2],
          updateEnabled: true,
        }),
      })
    } catch (_) {}
    setLoading(false)
    setSubmitted(true)
    // Trigger immediate PDF download
    const link = document.createElement('a')
    link.href = '/CQC_Compliance_Checklist_2026.pdf'
    link.download = 'CQC_Compliance_Checklist_2026.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    // Redirect to booking page after 4 seconds
    setTimeout(() => {
      window.location.href = 'https://tfft.io/CRIkyvF'
    }, 4000)
  }

  return (
    <div className="min-h-screen text-white overflow-x-hidden font-sans" style={{ backgroundColor: '#1e3a8a' }}>

      {/* ── HEADER ── */}
      <header style={{ backgroundColor: '#172554', borderBottom: '1px solid rgba(255,255,255,0.1)' }} className="px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-lg leading-none" style={{ backgroundColor: '#facc15', color: '#172554' }}>
              K
            </div>
            <span className="font-bold text-sm tracking-wide text-white">The Kajidori Collective</span>
          </div>
          <a
            href="https://tfft.io/CRIkyvF"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block text-xs font-bold px-5 py-2.5 rounded-lg transition-colors"
            style={{ backgroundColor: '#facc15', color: '#172554' }}
          >
            Book Free Strategy Call →
          </a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="px-6 pt-16 pb-12" style={{ backgroundColor: '#1e3a8a' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* Left — copy */}
          <div>
            <div
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: 'rgba(250,204,21,0.15)', border: '1px solid rgba(250,204,21,0.4)', color: '#facc15' }}
            >
              Free Resource &middot; 2026 Edition
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.1] mb-6 text-white">
              Is Your Service Ready<br />
              <span style={{ color: '#facc15' }}>for a CQC Inspection?</span>
            </h1>
            <p className="text-blue-200 text-lg leading-relaxed mb-4">
              Most care providers only find out they're not inspection-ready <strong className="text-white">when the inspector is already at the door.</strong>
            </p>
            <p className="text-blue-200 text-base leading-relaxed mb-8">
              This free checklist shows you exactly where you stand — across all 5 CQC Key Questions — so you can fix the gaps <em>before</em> they become findings.
            </p>

            {/* Urgency stats */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {URGENCY_STATS.map((s, i) => (
                <div key={i} className="rounded-xl p-4 text-center" style={{ backgroundColor: 'rgba(23,37,84,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <div className="font-extrabold text-xl mb-1" style={{ color: '#facc15' }}>{s.value}</div>
                  <div className="text-blue-200 text-xs leading-snug">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Bullet benefits */}
            <ul className="space-y-3 mb-8">
              {[
                'Covers all 5 CQC Key Questions in full',
                'Practical action points you can act on today',
                'Instant download — no waiting, no gatekeeping',
                'Written by a 20-year sector expert and CQC Registered Manager',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-blue-100 text-sm">
                  <span className="font-bold mt-0.5 shrink-0 text-base leading-none" style={{ color: '#facc15' }}>&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — opt-in card */}
          <div className="rounded-3xl shadow-2xl p-8" style={{ backgroundColor: '#ffffff', color: '#172554' }}>
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-extrabold mb-3" style={{ color: '#172554' }}>
                  {firstName ? `${firstName}, your checklist is downloading!` : 'Your checklist is downloading now!'}
                </h3>
                <p className="text-slate-600 text-sm mb-4">Your PDF has started downloading automatically. Check your Downloads folder.</p>
                <div className="rounded-2xl p-5 mb-4" style={{ backgroundColor: '#f0f4ff' }}>
                  <p className="font-bold text-sm mb-1" style={{ color: '#172554' }}>One more step →</p>
                  <p className="text-slate-600 text-xs mb-3">While you wait, book your free 30-minute CQC Strategy Call with Yeukai. He'll review your specific service and tell you exactly what to fix first.</p>
                  <a
                    href="https://tfft.io/CRIkyvF"
                    className="block w-full text-white text-center py-3 rounded-xl font-bold text-sm transition-colors"
                    style={{ backgroundColor: '#1e3a8a' }}
                  >
                    Book My Free Strategy Call →
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
                  <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Redirecting you to book your call in a moment…
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div
                    className="inline-block text-xs font-extrabold uppercase tracking-widest px-4 py-2 rounded-full mb-4"
                    style={{ backgroundColor: '#facc15', color: '#172554' }}
                  >
                    Free &middot; Instant Download
                  </div>
                  <h2 className="text-2xl font-extrabold leading-tight mb-2" style={{ color: '#172554' }}>
                    Get the 2026 CQC<br />Compliance Checklist
                  </h2>
                  <p className="text-slate-500 text-sm">Enter your details below — your PDF downloads instantly.</p>
                </div>

                {/* Native React form — first name + email, triggers immediate PDF download */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="firstname-input" className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#475569' }}>First Name</label>
                    <input
                      id="firstname-input"
                      type="text"
                      required
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="e.g. Jane"
                      className="w-full rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 placeholder-slate-400"
                      style={{
                        border: '1px solid #e2e8f0',
                        color: '#172554',
                        backgroundColor: '#ffffff',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="email-input" className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#475569' }}>Work Email Address</label>
                    <input
                      id="email-input"
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@yourorganisation.co.uk"
                      className="w-full rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 placeholder-slate-400"
                      style={{
                        border: '1px solid #e2e8f0',
                        color: '#172554',
                        backgroundColor: '#ffffff',
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full text-white font-bold py-4 rounded-xl text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#1e3a8a' }}
                  >
                    {loading ? (
                      <><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Preparing your download…</>
                    ) : (
                      <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> Download Free Checklist Now</>
                    )}
                  </button>
                </form>

                <p className="text-xs text-center mt-4" style={{ color: '#94a3b8' }}>
                  No spam. No sales pitch. Just the checklist — and a follow-up from Yeukai personally.
                </p>

                <div className="mt-5 pt-5 text-center" style={{ borderTop: '1px solid #f1f5f9' }}>
                  <p className="text-xs mb-3" style={{ color: '#64748b' }}>Or skip straight to booking:</p>
                  <a
                    href="https://tfft.io/CRIkyvF"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 rounded-xl font-bold text-sm transition-colors"
                    style={{ backgroundColor: '#facc15', color: '#172554' }}
                  >
                    Book My Free 30-Min Strategy Call →
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── YELLOW DIVIDER BAR (matches main site) ── */}
      <div style={{ height: '6px', backgroundColor: '#facc15' }} />

      {/* ── WHAT'S INSIDE ── */}
      <section className="px-6 py-16" style={{ backgroundColor: '#172554' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-bold text-xs uppercase tracking-widest mb-3" style={{ color: '#facc15' }}>What's Inside</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              The Checklist Covers Every CQC Key Question
            </h2>
            <p className="text-blue-200 mt-4 max-w-2xl mx-auto text-base">
              CQC inspectors assess your service across five domains. This checklist gives you a structured self-assessment for each one — so nothing gets missed.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {FIVE_KEYS.map((k) => (
              <div key={k.key} className="rounded-2xl p-5 transition-colors" style={{ backgroundColor: 'rgba(30,58,138,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-xs font-bold tracking-widest mb-3" style={{ color: 'rgba(250,204,21,0.6)' }}>{k.num}</div>
                <div className="font-extrabold text-lg mb-2" style={{ color: '#facc15' }}>{k.key}</div>
                <p className="text-blue-200 text-xs leading-relaxed">{k.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUTHORITY / ABOUT YEUKAI ── */}
      <section className="px-6 py-16" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-2 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 rounded-3xl overflow-hidden shadow-2xl" style={{ border: '4px solid rgba(250,204,21,0.4)' }}>
                <img
                  src={PHOTO_SMILING}
                  alt="Yeukai Kajidori"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 rounded-2xl px-4 py-3 shadow-xl" style={{ backgroundColor: '#facc15', color: '#172554' }}>
                <div className="font-extrabold text-sm">20+ Years</div>
                <div className="text-xs font-medium">Sector Experience</div>
              </div>
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="font-bold text-xs uppercase tracking-widest mb-4" style={{ color: '#facc15' }}>Written By</p>
            <h2 className="text-3xl font-extrabold mb-4" style={{ color: '#172554' }}>Yeukai Kajidori</h2>
            <p className="text-slate-600 text-base leading-relaxed mb-4">
              Yeukai is a <strong style={{ color: '#172554' }}>CQC Registered Manager, MBA-qualified strategist, and Amazon bestselling author</strong> with over 20 years in health and social care leadership. He has launched five new care facilities in two years, secured over £2.5M in contracts annually, and interviewed 584+ global leaders on the Yeukai Business Show.
            </p>
            <p className="text-slate-600 text-base leading-relaxed mb-6">
              This checklist is not a generic template. It is built from real inspection experience — the kind that comes from sitting on both sides of the table.
            </p>
            <div className="flex flex-wrap gap-2">
              {['MBA — Change Management', 'Level 7 Strategic Leadership', 'CQC Registered Manager', 'Amazon Bestselling Author'].map(c => (
                <span key={c} className="text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: '#e0e7ff', color: '#1e3a8a', border: '1px solid #c7d2fe' }}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="px-6 py-16" style={{ backgroundColor: '#1e3a8a' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-bold text-xs uppercase tracking-widest mb-3" style={{ color: '#facc15' }}>What Others Are Saying</p>
            <h2 className="text-3xl font-extrabold text-white">Care Providers Across the UK Trust This Resource</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {SOCIAL_PROOF.map((t, i) => (
              <div key={i} className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(23,37,84,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-3xl font-serif leading-none mb-4 select-none" style={{ color: '#facc15' }}>&ldquo;</div>
                <p className="text-blue-100 text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div>
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="text-blue-300 text-xs">{t.org}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="px-6 py-20" style={{ backgroundColor: '#172554' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: 'rgba(250,204,21,0.15)', border: '1px solid rgba(250,204,21,0.4)', color: '#facc15' }}
          >
            Free · No Commitment · Instant Access
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-white">
            Don't Wait for the Inspector<br />
            <span style={{ color: '#facc15' }}>to Tell You What's Wrong.</span>
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Download the checklist today. Know exactly where you stand. Then book a free call with Yeukai and get a personalised action plan for your service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#top"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="px-10 py-5 rounded-xl font-extrabold text-base transition-colors"
              style={{ backgroundColor: '#facc15', color: '#172554' }}
            >
              Get the Free Checklist →
            </a>
            <a
              href="https://tfft.io/CRIkyvF"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 rounded-xl font-bold text-base transition-colors text-white"
              style={{ border: '2px solid rgba(255,255,255,0.3)' }}
            >
              Book Free Strategy Call
            </a>
          </div>
          <p className="text-blue-400 text-xs mt-6">
            Used by care providers across England · Written by a 20-year sector expert · 100% free
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 py-8" style={{ backgroundColor: '#172554', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-xs" style={{ backgroundColor: '#facc15', color: '#172554' }}>
              K
            </div>
            <span>© 2026 The Kajidori Collective · All rights reserved</span>
          </div>
          <div className="flex gap-6">
            <a href="https://kajidoricollective.co.uk" className="hover:text-white transition-colors">Main Website</a>
            <a href="https://tfft.io/CRIkyvF" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Book a Call</a>
            <a href="mailto:hello@kajidoricollective.co.uk" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
