import { Link } from 'react-router-dom'

const services = [
  {
    id: 'consulting',
    icon: '🏛️',
    title: 'Strategic Consulting',
    subtitle: 'Organisational Development & CQC Compliance',
    description: 'Expert strategic guidance for health and social care providers navigating CQC requirements, service improvement, and organisational change. We work alongside your leadership team to develop robust systems, policies, and cultures that deliver outstanding care.',
    features: ['CQC inspection preparation', 'Quality improvement planning', 'Policy and procedure development', 'Governance framework review', 'Post-inspection action planning'],
    cta: 'Request a Strategic Consultation',
    link: '/contact?type=consulting',
  },
  {
    id: 'training',
    icon: '🧠',
    title: 'Mental Health & Complex Needs Training',
    subtitle: 'The Excellence Programme',
    description: 'Our flagship training programme equips frontline care staff with the knowledge, skills, and confidence to support people with mental health conditions and complex needs. Delivered to groups across the country, with digital attendance tracking and automated certificate generation.',
    features: ['Evidence-based curriculum', 'Digital attendance register', 'Automated certificate delivery', 'CQC-compliant training records', 'Multi-site delivery across the UK'],
    cta: 'Apply for the Training Programme',
    link: '/contact?type=training',
  },
  {
    id: 'mentoring',
    icon: '🎯',
    title: 'Leadership Mentoring & Coaching',
    subtitle: '10-Week Structured Programme',
    description: 'A structured 10-week coaching and mentoring programme designed for care leaders at all levels. Each session is tracked through our digital portal, with goal-setting, progress notes, and completion certificates — giving both mentees and their organisations a clear record of development.',
    features: ['10 structured weekly sessions', 'Goal-setting and progress tracking', 'Private session notes', 'Completion certificate', 'Ongoing access to resources'],
    cta: 'Apply for Leadership Mentoring',
    link: '/contact?type=mentoring',
  },
]

export default function Services() {
  return (
    <div className="min-h-screen">
      <div className="bg-blue-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-blue-200 max-w-2xl mx-auto">Specialist programmes designed for health and social care organisations.</p>
      </div>
      <div className="max-w-5xl mx-auto py-16 px-4 space-y-16">
        {services.map((s, i) => (
          <div key={s.id} className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-10 items-center`}>
            <div className="flex-1">
              <div className="text-5xl mb-4">{s.icon}</div>
              <p className="text-yellow-600 font-semibold text-sm uppercase tracking-wide mb-2">{s.subtitle}</p>
              <h2 className="text-3xl font-bold text-blue-900 mb-4">{s.title}</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">{s.description}</p>
              <Link to={s.link} className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors inline-block">
                {s.cta}
              </Link>
            </div>
            <div className="flex-1 bg-slate-50 rounded-2xl p-8 border border-slate-100">
              <h3 className="font-bold text-blue-900 mb-4">What's included:</h3>
              <ul className="space-y-3">
                {s.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-slate-700 text-sm">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
