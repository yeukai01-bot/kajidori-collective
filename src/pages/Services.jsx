import { Link } from 'react-router-dom'

const services = [
  {
    id: 'consulting',
    icon: '🏛️',
    title: 'Strategic Consulting',
    subtitle: 'Virtual Compliance & Development Director',
    description: 'Expert strategic guidance for health and social care providers navigating CQC requirements, service improvement, and organisational change. We work alongside your leadership team to develop robust systems, policies, and cultures that deliver outstanding care.',
    features: ['CQC inspection preparation', 'Quality improvement planning', 'Policy and procedure development', 'Governance framework review', 'Post-inspection action planning'],
    cta: 'Request a Strategic Consultation',
    link: '/contact?type=consulting',
    price: 'From £1,200/day',
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
    price: 'From £2,500/day (up to 20 delegates)',
    popular: true,
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
    price: '£950 per participant',
  },
  {
    id: 'ai',
    icon: '🤖',
    title: 'AI Integration for Social Care',
    subtitle: 'New for 2026 — First Mover Advantage',
    description: 'Half-day and full-day workshops helping care providers understand, evaluate, and implement AI tools responsibly. Covers AI for care documentation, CQC inspection readiness, responsible AI governance, and staff wellbeing applications — delivered by someone who understands both the technology and the regulatory environment.',
    features: [
      'AI for care documentation (save 5+ hours/week)',
      'AI for CQC self-assessment and inspection readiness',
      'Responsible AI governance and GDPR compliance',
      'AI tools for staff wellbeing and retention',
      'Practical tool evaluation and implementation roadmap',
    ],
    cta: 'Register Your Interest',
    link: '/contact?type=consulting',
    price: 'From £1,600 (half day)',
    isNew: true,
  },
]

export default function Services() {
  return (
    <div className="min-h-screen">
      <div className="bg-blue-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-blue-200 max-w-2xl mx-auto">Specialist programmes designed for health and social care organisations — grounded in 20+ years of real-world sector experience.</p>
      </div>
      <div className="max-w-5xl mx-auto py-16 px-4 space-y-16">
        {services.map((s, i) => (
          <div key={s.id} className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-10 items-center`}>
            <div className="flex-1">
              {s.isNew && (
                <span className="bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3 inline-block">New 2026</span>
              )}
              {s.popular && (
                <span className="bg-blue-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3 inline-block">Most Popular</span>
              )}
              <div className="text-5xl mb-4">{s.icon}</div>
              <p className="text-yellow-600 font-semibold text-sm uppercase tracking-wide mb-2">{s.subtitle}</p>
              <h2 className="text-3xl font-bold text-blue-900 mb-4">{s.title}</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">{s.description}</p>
              <div className="text-2xl font-extrabold text-blue-900 mb-6">{s.price}</div>
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

      {/* CTA */}
      <div className="bg-blue-900 text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-extrabold mb-4">Not Sure Which Service Is Right for You?</h2>
        <p className="text-blue-200 max-w-xl mx-auto mb-8">Book a complimentary 30-minute discovery call. We'll listen, understand your situation, and recommend the right approach — with no obligation.</p>
        <Link to="/contact" className="bg-yellow-400 text-blue-900 px-10 py-4 rounded-xl font-bold text-base hover:bg-yellow-300 transition-colors inline-block">
          Book a Discovery Call
        </Link>
      </div>
    </div>
  )
}
