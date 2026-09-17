import { useState } from 'react'


const CHECKLIST_ITEMS = [
  'Your 7 mental health rights at work — most employers never mention them',
  'The signs of compassion fatigue (and what to do before it becomes burnout)',
  'How to raise a concern without fear of losing your job',
  'Your rights around sick leave, flexible working, and reasonable adjustments',
  'Step-by-step: what to do if your employer ignores your wellbeing',
  'Career rights every care worker deserves to know',
  'Crisis support contacts — for when things feel too heavy',
]

const SOCIAL_PROOF = [
  {
    quote: 'I had no idea I had the right to request supervision or a mental health risk assessment. This checklist changed how I see my job.',
    name: 'Domiciliary Care Worker',
    org: 'Birmingham',
  },
  {
    quote: 'I was on the verge of leaving care work entirely. Reading this reminded me that I matter too. Thank you, Yeukai.',
    name: 'Support Worker',
    org: 'London',
  },
  {
    quote: 'Shared this with my whole team. We used it to have a conversation with our manager about supervision. It actually worked.',
    name: 'Senior Carer',
    org: 'Leeds',
  },
]

export default function CareWorkerChecklist() {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Send the lead to Make (emails Yeukai the new sign-up)
    try {
      await fetch('https://hook.eu1.make.com/q1kftkq4u8w4sodx7n8k1esos1wam7rj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: firstName,
          email: email,
          organisation_name: '',
          phone: '',
          message: 'Checklist download',
          source: 'care-worker-checklist-download',
        }),
      })
    } catch (_) {
      // PDF still downloads even if the lead capture call fails
    }

    setLoading(false)
    setSubmitted(true)

    // Trigger immediate PDF download
    const link = document.createElement('a')
    link.href = '/Care_Worker_Mental_Health_Rights_Checklist.pdf'
    link.download = 'Care_Worker_Mental_Health_Rights_Checklist.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Redirect to Mental Health Training booking after 5 seconds
    setTimeout(() => {
      window.location.href = '/reclaim-wellbeing'
    }, 5000)
  }

  return (
    <div className="min-h-screen font-sans overflow-x-hidden" style={{ backgroundColor: '#0a2463' }}>

      {/* ── HEADER ── */}
      <header style={{ backgroundColor: '#081a4e', borderBottom: '1px solid rgba(255,255,255,0.08)' }} className="px-5 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-base leading-none shrink-0"
              style={{ backgroundColor: '#facc15', color: '#0a2463' }}
            >
              K
            </div>
            <span className="font-bold text-sm text-white tracking-wide">The Kajidori Collective</span>
          </div>
          <a
            href="https://tfft.io/DvNRyJs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#facc15', color: '#0a2463' }}
          >
            Book Free Call
          </a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="px-5 pt-12 pb-8" style={{ backgroundColor: '#0a2463' }}>
        <div className="max-w-2xl mx-auto text-center">

          <div
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: 'rgba(250,204,21,0.15)', border: '1px solid rgba(250,204,21,0.35)', color: '#facc15' }}
          >
            Free Download &middot; Instant Access
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-5 text-white">
            You care for everyone else.<br />
            <span style={{ color: '#facc15' }}>Who is caring for you?</span>
          </h1>

          <p className="text-blue-200 text-base leading-relaxed mb-8 max-w-lg mx-auto">
            Get your free <strong className="text-white">Care Worker Mental Health Rights &amp; Wellbeing Checklist</strong> — 25 things every carer deserves to know, written by a mental health consultant with 20 years in health and social care.
          </p>

          {/* What's inside */}
          <div className="rounded-2xl p-6 mb-8 text-left" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#facc15' }}>What's inside this checklist</p>
            <ul className="space-y-3">
              {CHECKLIST_ITEMS.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-blue-100 text-sm leading-snug">
                  <span className="font-bold shrink-0 mt-0.5" style={{ color: '#facc15' }}>&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* ── OPT-IN FORM ── */}
      <section className="px-5 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-3xl shadow-2xl p-7 sm:p-8" style={{ backgroundColor: '#ffffff' }}>

            {submitted ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-extrabold mb-3" style={{ color: '#0a2463' }}>
                  {firstName ? `${firstName}, your checklist is on its way!` : 'Your checklist is downloading now!'}
                </h2>
                <p className="text-slate-500 text-sm mb-6">
                  Your PDF has started downloading automatically. Check your Downloads folder.
                </p>
                <div className="rounded-2xl p-5 mb-5" style={{ backgroundColor: '#f0f4ff' }}>
                  <p className="font-bold text-sm mb-2" style={{ color: '#0a2463' }}>One more step</p>
                  <p className="text-slate-600 text-xs mb-4 leading-relaxed">
                    If the checklist resonated with you, Yeukai offers a free 20-minute conversation to talk through what you are experiencing and what support might look like.
                  </p>
                  <a
                    href="https://tfft.io/DvNRyJs"
                    className="block w-full text-center py-3.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#0a2463', color: '#facc15' }}
                  >
                    Book My Free Conversation
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
                  <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Redirecting you in a moment...
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div
                    className="inline-block text-xs font-extrabold uppercase tracking-widest px-4 py-2 rounded-full mb-4"
                    style={{ backgroundColor: '#facc15', color: '#0a2463' }}
                  >
                    Free &middot; Instant Download
                  </div>
                  <h2 className="text-xl font-extrabold leading-snug mb-2" style={{ color: '#0a2463' }}>
                    Get your free checklist now
                  </h2>
                  <p className="text-slate-500 text-sm">Enter your details below — your PDF downloads instantly.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="cw-firstname" className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#475569' }}>
                      First Name
                    </label>
                    <input
                      id="cw-firstname"
                      type="text"
                      required
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="e.g. Sarah"
                      className="w-full rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 placeholder-slate-400"
                      style={{ border: '1.5px solid #e2e8f0', color: '#0a2463', backgroundColor: '#ffffff' }}
                    />
                  </div>
                  <div>
                    <label htmlFor="cw-email" className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#475569' }}>
                      Email Address
                    </label>
                    <input
                      id="cw-email"
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 placeholder-slate-400"
                      style={{ border: '1.5px solid #e2e8f0', color: '#0a2463', backgroundColor: '#ffffff' }}
                    />
                  </div>

                  {error && (
                    <p className="text-red-600 text-xs">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl font-extrabold text-base transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ backgroundColor: '#facc15', color: '#0a2463' }}
                  >
                    {loading ? 'Sending your checklist...' : 'Send Me the Free Checklist'}
                  </button>

                  <p className="text-center text-slate-400 text-xs leading-relaxed">
                    No spam. No selling. Just the checklist — and occasional wellbeing tips from Yeukai.
                    Unsubscribe any time.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="px-5 pb-12" style={{ backgroundColor: '#081a4e' }}>
        <div className="max-w-2xl mx-auto pt-10">
          <p className="text-center text-xs font-bold uppercase tracking-widest mb-6" style={{ color: '#facc15' }}>
            What care workers are saying
          </p>
          <div className="space-y-4">
            {SOCIAL_PROOF.map((t, i) => (
              <div key={i} className="rounded-2xl p-5" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-blue-100 text-sm leading-relaxed mb-3 italic">"{t.quote}"</p>
                <p className="text-xs font-bold" style={{ color: '#facc15' }}>{t.name}</p>
                <p className="text-blue-300 text-xs">{t.org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT YEUKAI ── */}
      <section className="px-5 py-12" style={{ backgroundColor: '#0a2463' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-extrabold text-2xl mx-auto mb-5"
            style={{ backgroundColor: '#facc15', color: '#0a2463' }}
          >
            Y
          </div>
          <h3 className="text-xl font-extrabold text-white mb-3">About Yeukai Kajidori</h3>
          <p className="text-blue-200 text-sm leading-relaxed mb-6 max-w-md mx-auto">
            Yeukai is a mental health consultant, podcast host, and former registered manager with over 20 years in health and social care. He created this checklist because he has lived what you are living — and he knows that the people who care for others deserve to be cared for too.
          </p>
          <a
            href="https://tfft.io/DvNRyJs"
            className="inline-block px-8 py-4 rounded-xl font-extrabold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#facc15', color: '#0a2463' }}
          >
            Book a Free Conversation with Yeukai
          </a>
        </div>
      </section>

      {/* ── INSTAGRAM CTA ── */}
      <section className="px-5 py-8" style={{ backgroundColor: '#081a4e', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-blue-300 text-xs leading-relaxed">
            Follow <strong className="text-white">@yeukaik</strong> on Instagram for weekly tips on mental health, rights, and career growth in care.
            <br />
            Comment <strong style={{ color: '#facc15' }}>CHECKLIST</strong> on any post to receive this guide directly in your DMs.
          </p>
        </div>
      </section>

    </div>
  )
}
