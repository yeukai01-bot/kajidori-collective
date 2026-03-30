import { useState } from 'react'

const PHOTO_SMILING = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663231528991/jPaHykWfLrMYEDWA.jpeg'

const FIVE_KEYS = [
  { key: 'Safe', icon: '🛡️', desc: 'Medication management, safeguarding, risk assessments, incident reporting' },
  { key: 'Effective', icon: '📊', desc: 'Care planning, staff training, evidence-based practice, outcomes' },
  { key: 'Caring', icon: '❤️', desc: 'Dignity, person-centred care, emotional support, involvement' },
  { key: 'Responsive', icon: '⚡', desc: 'Complaints handling, care reviews, meeting individual needs' },
  { key: 'Well-led', icon: '🏛️', desc: 'Governance, culture, leadership quality, continuous improvement' },
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

export default function CQCChecklist() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Submit to Brevo via the embedded form action
    try {
      await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, listIds: [2], updateEnabled: true }),
      })
    } catch (_) {}
    setLoading(false)
    setSubmitted(true)
    setTimeout(() => {
      window.location.href = 'https://tfft.io/CRIkyvF'
    }, 4000)
  }

  return (
    <div className="min-h-screen bg-[#0a1628] text-white overflow-x-hidden font-sans">

      {/* ── HEADER ── */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center">
              <span className="text-blue-900 font-extrabold text-lg leading-none">K</span>
            </div>
            <span className="font-bold text-sm tracking-wide text-white/90">The Kajidori Collective</span>
          </div>
          <a
            href="https://tfft.io/CRIkyvF"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block bg-yellow-400 text-blue-900 text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-yellow-300 transition-colors"
          >
            Book Free Strategy Call →
          </a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="px-6 pt-16 pb-12">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* Left — copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Free Resource · 2026 Edition
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.1] mb-6">
              Is Your Service Ready<br />
              <span className="text-yellow-400">for a CQC Inspection?</span>
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
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-yellow-400 font-extrabold text-xl mb-1">{s.value}</div>
                  <div className="text-blue-300 text-xs leading-snug">{s.label}</div>
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
                  <span className="text-yellow-400 font-bold mt-0.5 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — opt-in card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-slate-800">
            {submitted ? (
              <div className="text-center py-6">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-extrabold text-blue-900 mb-3">Your checklist is on its way!</h3>
                <p className="text-slate-600 text-sm mb-4">Check your inbox — and your junk folder just in case.</p>
                <div className="bg-blue-50 rounded-2xl p-5 mb-4">
                  <p className="text-blue-900 font-bold text-sm mb-1">One more step →</p>
                  <p className="text-slate-600 text-xs mb-3">While you wait, book your free 30-minute CQC Strategy Call with Yeukai. He'll review your specific service and tell you exactly what to fix first.</p>
                  <a
                    href="https://tfft.io/CRIkyvF"
                    className="block w-full bg-blue-900 text-white text-center py-3 rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors"
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
                  <div className="inline-block bg-yellow-400 text-blue-900 text-xs font-extrabold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
                    Free · Instant Download
                  </div>
                  <h2 className="text-2xl font-extrabold text-blue-900 leading-tight mb-2">
                    Get the 2026 CQC<br />Compliance Checklist
                  </h2>
                  <p className="text-slate-500 text-sm">Enter your email and we'll send it straight to your inbox.</p>
                </div>

                {/* Brevo iframe form — most reliable embed method */}
                <div className="overflow-hidden rounded-2xl border border-slate-100">
                  <iframe
                    width="100%"
                    height="280"
                    src="https://4d7710d7.sibforms.com/serve/MUIFAOg--2t3JsWa_5_C2bZZk5ZEsaWqWVeuqP9FUb0hcUY6eInEU_U2cjkUpmPf4E2YVkF7_lnoIadohZ4rbG111ya3U66V_iEHikRSUHXk--oPdhB5i3DiUhrCVQEDRGZOOUkpM3f42W_udlqv8DQ2hODTcgDg-DG-SDRELOBvLWVbfTKuzKkyZq8_8c-USjFZBCHwSqH_TpEC"
                    frameBorder="0"
                    scrolling="auto"
                    allowFullScreen
                    style={{ display: 'block' }}
                    title="Download Your Free 2026 CQC Compliance Checklist"
                  />
                </div>

                <p className="text-xs text-slate-400 text-center mt-4">
                  No spam. No sales pitch. Just the checklist — and a follow-up from Yeukai personally.
                </p>

                <div className="mt-5 pt-5 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-500 mb-3">Or skip straight to booking:</p>
                  <a
                    href="https://tfft.io/CRIkyvF"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-yellow-400 text-blue-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-yellow-300 transition-colors"
                  >
                    Book My Free 30-Min Strategy Call →
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INSIDE ── */}
      <section className="px-6 py-16 bg-white/5 border-y border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-3">What's Inside</p>
            <h2 className="text-3xl md:text-4xl font-extrabold">
              The Checklist Covers Every CQC Key Question
            </h2>
            <p className="text-blue-200 mt-4 max-w-2xl mx-auto text-base">
              CQC inspectors assess your service across five domains. This checklist gives you a structured self-assessment for each one — so nothing gets missed.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {FIVE_KEYS.map((k) => (
              <div key={k.key} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-yellow-400/40 transition-colors">
                <div className="text-3xl mb-3">{k.icon}</div>
                <div className="font-extrabold text-yellow-400 text-lg mb-2">{k.key}</div>
                <p className="text-blue-200 text-xs leading-relaxed">{k.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUTHORITY / ABOUT YEUKAI ── */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-2 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 rounded-3xl overflow-hidden border-4 border-yellow-400/30 shadow-2xl">
                <img
                  src={PHOTO_SMILING}
                  alt="Yeukai Kajidori"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-blue-900 rounded-2xl px-4 py-3 shadow-xl">
                <div className="font-extrabold text-sm">20+ Years</div>
                <div className="text-xs font-medium">Sector Experience</div>
              </div>
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-4">Written By</p>
            <h2 className="text-3xl font-extrabold mb-4">Yeukai Kajidori</h2>
            <p className="text-blue-200 text-base leading-relaxed mb-4">
              Yeukai is a <strong className="text-white">CQC Registered Manager, MBA-qualified strategist, and Amazon bestselling author</strong> with over 20 years in health and social care leadership. He has launched five new care facilities in two years, secured over £2.5M in contracts annually, and interviewed 584+ global leaders on the Yeukai Business Show.
            </p>
            <p className="text-blue-200 text-base leading-relaxed mb-6">
              This checklist is not a generic template. It is built from real inspection experience — the kind that comes from sitting on both sides of the table.
            </p>
            <div className="flex flex-wrap gap-2">
              {['MBA — Change Management', 'Level 7 Strategic Leadership', 'CQC Registered Manager', 'Amazon Bestselling Author'].map(c => (
                <span key={c} className="bg-white/10 text-blue-200 text-xs px-3 py-1.5 rounded-full border border-white/10">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="px-6 py-16 bg-white/5 border-y border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-3">What Others Are Saying</p>
            <h2 className="text-3xl font-extrabold">Care Providers Across the UK Trust This Resource</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {SOCIAL_PROOF.map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-yellow-400 text-2xl mb-4">"</div>
                <p className="text-blue-100 text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div>
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="text-blue-400 text-xs">{t.org}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            Free · No Commitment · Instant Access
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Don't Wait for the Inspector<br />
            <span className="text-yellow-400">to Tell You What's Wrong.</span>
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Download the checklist today. Know exactly where you stand. Then book a free call with Yeukai and get a personalised action plan for your service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#top"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="bg-yellow-400 text-blue-900 px-10 py-5 rounded-xl font-extrabold text-base hover:bg-yellow-300 transition-colors"
            >
              Get the Free Checklist →
            </a>
            <a
              href="https://tfft.io/CRIkyvF"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white/30 text-white px-10 py-5 rounded-xl font-bold text-base hover:border-yellow-400 hover:text-yellow-400 transition-colors"
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
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
              <span className="text-blue-900 font-extrabold text-xs">K</span>
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
