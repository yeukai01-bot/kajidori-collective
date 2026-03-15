import { Link } from 'react-router-dom'

const cases = [
  {
    tag: 'Operations & Growth',
    tagColour: 'bg-purple-100 text-purple-800',
    org: 'Proactive Life South',
    location: 'Berkshire, England',
    period: '2022 – Present',
    service: 'Strategic Consulting & Operations Leadership',
    challenge: 'A specialist supported living provider for mental health service users with complex needs needed to scale rapidly while maintaining CQC compliance and securing long-term local authority contracts.',
    approach: 'Led the full strategic expansion of the business — from service design and stakeholder engagement to recruitment, training, and regulatory alignment. Built relationships with local council commissioners and designed specialised programmes for individuals with complex needs.',
    results: [
      { metric: '2×', label: 'Revenue and profitability doubled within two years' },
      { metric: '5', label: 'New supported living facilities opened in under 24 months' },
      { metric: '£2.5M+', label: 'Long-term contracts secured annually with local authority commissioners' },
      { metric: '95%', label: 'Occupancy achieved within the first eight months of new service launch' },
      { metric: '40', label: 'High-calibre healthcare professionals recruited, including internationally sponsored staff (Tier 2 UK Government sponsorship awarded)' },
      { metric: '20%', label: 'Improvement in staff retention following implementation of training and development programmes' },
    ],
    quote: 'The combination of operational leadership, stakeholder management, and workforce development transformed this organisation from a single-site provider into a multi-site operation with a strong reputation across Berkshire.',
  },
  {
    tag: 'CQC Compliance',
    tagColour: 'bg-green-100 text-green-800',
    org: 'Support Horizons CIC',
    location: 'Wokingham, England',
    period: '2019 – 2022',
    service: 'CQC Compliance, Quality Improvement & Leadership Development',
    challenge: 'A CQC-registered community interest company supporting over 100 vulnerable individuals across three supported living facilities needed to improve operational efficiency, reduce costs, and achieve Tier 1 Preferred Provider status with the local authority.',
    approach: 'Joined as a senior manager and led a comprehensive programme of process reengineering, technology adoption (Care Planner), person-centred care implementation, and staff development. Managed the full Annual Quality Assurance process with Wokingham Borough Council and maintained active CQC oversight.',
    results: [
      { metric: '15%', label: 'Increase in operational efficiency through process reengineering and technology adoption' },
      { metric: '10%', label: 'Reduction in operational costs through resource optimisation' },
      { metric: '30%', label: 'Improvement in patient satisfaction scores through person-centred care initiatives' },
      { metric: 'Tier 1', label: 'Preferred Provider status achieved with Wokingham Borough Council — zero deficiencies in Annual Quality Assurance' },
      { metric: 'Good', label: 'CQC rating maintained throughout tenure' },
      { metric: '100+', label: 'Vulnerable individuals supported across community and residential settings' },
    ],
    quote: 'Achieving zero deficiencies in a local authority quality audit while simultaneously improving patient satisfaction and reducing costs demonstrates what is possible when leadership, systems, and culture are aligned.',
  },
  {
    tag: 'Start-Up & Registration',
    tagColour: 'bg-yellow-100 text-yellow-800',
    org: 'MT Supported Living Ltd',
    location: 'Swindon, England',
    period: '2019 – 2020',
    service: 'CQC Registration, Governance & Quality Systems',
    challenge: 'A newly established supported living agency needed to register with the Care Quality Commission, build its governance infrastructure from scratch, and establish a credible presence in the Swindon market — all within a compressed timeline.',
    approach: 'Joined as Interim Operations Manager and led the end-to-end CQC registration process, designed quality control systems, established recruitment infrastructure, and built relationships with local external agencies to expand the organisation\'s reach.',
    results: [
      { metric: '100%', label: 'CQC registration achieved with full compliance in the first audit' },
      { metric: '95%', label: 'Customer satisfaction rate achieved through robust quality control systems' },
      { metric: '15%', label: 'Increase in repeat business through quality-driven service delivery' },
      { metric: 'Full', label: 'Governance infrastructure built from zero — policies, procedures, quality systems, and regulatory compliance all established' },
    ],
    quote: 'Taking an organisation from zero to CQC-registered and fully compliant in a single audit cycle requires precision, experience, and an intimate knowledge of what regulators expect. This is exactly the work The Kajidori Collective was built to do.',
  },
  {
    tag: 'Long-Term Partnership',
    tagColour: 'bg-blue-100 text-blue-800',
    org: 'Home Angels Health Care Services Ltd',
    location: 'England',
    period: '2011 – 2019',
    service: 'Operations Management, CQC Compliance & Business Expansion',
    challenge: 'A domiciliary care provider needed sustained operational leadership across nearly a decade — covering branch expansion, CQC compliance, staff development, and the delivery of high-volume billable care hours.',
    approach: 'Served as Operations Manager and Registered CQC Healthcare Manager, reporting directly to the CEO. Led the opening of two new branches, designed staff training and professional development strategies, managed operational budgets, and oversaw CQC inspection preparation across multiple inspection cycles.',
    results: [
      { metric: '2', label: 'New branches planned and successfully opened' },
      { metric: '3,000', label: 'Weekly billable care hours delivered at the local branch' },
      { metric: '2×', label: 'Good CQC rating achieved across two separate inspection cycles' },
      { metric: '8 years', label: 'Sustained operational excellence and leadership continuity' },
    ],
    quote: 'Achieving a Good CQC rating once is an achievement. Achieving it twice, across different inspection frameworks and different inspection teams, is evidence of a culture and a system that works — not just a one-off performance.',
  },
]

const stats = [
  { value: '20+', label: 'Years in health and social care leadership' },
  { value: '£2.5M+', label: 'Annual contracts secured for a single client' },
  { value: '4×', label: 'Good CQC ratings achieved across different organisations' },
  { value: '100+', label: 'Vulnerable individuals supported simultaneously' },
]

export default function CaseStudies() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-blue-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Results That Speak for Themselves</h1>
        <p className="text-blue-200 max-w-2xl mx-auto text-lg">Every engagement below is drawn from Yeukai Kajidori's direct leadership experience. These are not case studies from a training manual — they are the outcomes of real decisions, real teams, and real organisations.</p>
      </div>

      {/* Stats bar */}
      <div className="bg-yellow-400 py-8 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-blue-900">{s.value}</div>
              <div className="text-blue-900 text-sm mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Case studies */}
      <div className="max-w-5xl mx-auto py-16 px-4 space-y-16">
        {cases.map((c, i) => (
          <div key={c.org} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
            {/* Header */}
            <div className="bg-blue-900 px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${c.tagColour} inline-block mb-2`}>{c.tag}</span>
                <h2 className="text-2xl font-bold text-white">{c.org}</h2>
                <p className="text-blue-300 text-sm">{c.location} · {c.period}</p>
              </div>
              <div className="text-right">
                <p className="text-yellow-400 font-semibold text-sm">{c.service}</p>
              </div>
            </div>

            <div className="p-8">
              {/* Challenge & Approach */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">The Challenge</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{c.challenge}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">The Approach</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{c.approach}</p>
                </div>
              </div>

              {/* Results */}
              <div className="border-t border-slate-100 pt-8 mb-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Measurable Results</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {c.results.map(r => (
                    <div key={r.label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="text-2xl font-extrabold text-blue-900 mb-1">{r.metric}</div>
                      <div className="text-slate-600 text-xs leading-snug">{r.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <blockquote className="border-l-4 border-yellow-400 pl-5 italic text-slate-500 text-sm leading-relaxed">
                "{c.quote}"
                <footer className="mt-2 text-xs font-semibold text-blue-900 not-italic">— Yeukai Kajidori, The Kajidori Collective</footer>
              </blockquote>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-blue-900 text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-extrabold mb-4">Could Your Organisation Be the Next Success Story?</h2>
        <p className="text-blue-200 max-w-xl mx-auto mb-8">Whether you are preparing for a CQC inspection, scaling your operations, or developing your leadership team — the results above show what is possible. Let's have a conversation about your organisation.</p>
        <Link to="/contact" className="bg-yellow-400 text-blue-900 px-10 py-4 rounded-xl font-bold text-base hover:bg-yellow-300 transition-colors inline-block">
          Book a Free Discovery Call
        </Link>
      </div>
    </div>
  )
}
