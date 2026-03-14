import { Link } from 'react-router-dom'

const PHOTO_SEATED = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663231528991/iICOqSmlpYSarXZX.jpeg'
const PHOTO_SMILING = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663231528991/jPaHykWfLrMYEDWA.jpeg'

const stats = [
  { stat: '20+', label: 'Years in Health & Social Care' },
  { stat: '£2.5M+', label: 'Contracts Secured Annually' },
  { stat: '550+', label: 'Global Leaders Interviewed' },
  { stat: '5', label: 'New Facilities Launched in 2 Years' },
]

const services = [
  {
    title: 'Strategic Consulting',
    icon: '🏛️',
    tagline: 'Virtual Compliance & Development Director',
    desc: 'Yeukai partners with health and social care providers to navigate CQC compliance, drive service improvements, and implement robust strategies for organisational growth — providing the strategic oversight needed to build resilient, future-proof services.',
    link: '/contact?type=consulting',
  },
  {
    title: 'Mental Health & Complex Needs Training',
    icon: '🧠',
    tagline: 'Flagship Certified Group Programme',
    desc: 'Certified, group-based training for professionals working in the mental health and complex needs space. Combining digital accessibility with cutting-edge content, the programme equips teams across the country with the skills to deliver outstanding care.',
    link: '/contact?type=training',
  },
  {
    title: 'Leadership Mentoring',
    icon: '🎯',
    tagline: 'For CEOs, Registered Managers & Operations Directors',
    desc: 'A structured coaching and mentoring programme designed specifically for the leaders who shape the sector — providing practical wisdom and personalised guidance to cultivate the critical leadership qualities needed to inspire teams and drive operational excellence.',
    link: '/contact?type=mentoring',
  },
]

const credentials = [
  'MBA — Change Management',
  'Level 7 Strategic Management & Leadership',
  'Level 7 Health & Social Care Management',
  'CQC Registered Manager',
  'Amazon Bestselling Author',
]

export default function Home() {
  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white min-h-[90vh] flex items-center px-4 py-16">
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">

          {/* Left: copy */}
          <div>
            <p className="text-yellow-400 font-bold text-xs uppercase tracking-[0.25em] mb-5">The Kajidori Collective</p>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] mb-6">
              Transforming Health &amp; Social Care,<br />
              <span className="text-yellow-400">One Leader at a Time.</span>
            </h1>
            <p className="text-blue-200 text-lg leading-relaxed mb-10 max-w-lg">
              Your Partner in Compliance, Excellence, and Inspired Leadership — serving health and social care organisations across the UK.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors text-center">
                Work With Us
              </Link>
              <Link to="/portal/login" className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-900 transition-colors text-center">
                Client Portal
              </Link>
            </div>
          </div>

          {/* Right: photo + floating stats */}
          <div className="relative flex justify-center">
            <div className="relative w-80 md:w-96">
              <div className="rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-2xl">
                <img
                  src={PHOTO_SMILING}
                  alt="Yeukai Kajidori — Founder, The Kajidori Collective"
                  className="w-full h-[520px] object-cover object-top"
                />
              </div>
              {/* Floating name card */}
              <div className="absolute -bottom-6 -left-6 bg-white text-blue-900 rounded-2xl px-5 py-4 shadow-xl">
                <p className="font-extrabold text-base leading-tight">Yeukai Kajidori</p>
                <p className="text-xs text-slate-500 mt-0.5">Founder &amp; Director</p>
                <p className="text-xs text-slate-500">The Kajidori Collective</p>
              </div>
              {/* Floating credential badge */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-blue-900 rounded-2xl px-4 py-3 shadow-xl text-center">
                <p className="font-extrabold text-sm">20+ Years</p>
                <p className="text-xs font-medium">HSC Expertise</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="bg-yellow-400 py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(item => (
            <div key={item.label} className="py-2">
              <div className="text-4xl font-extrabold text-blue-900">{item.stat}</div>
              <div className="text-blue-800 text-sm font-semibold mt-2 leading-snug">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT / BIO ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-16 items-start">

          {/* Photo column */}
          <div className="md:col-span-2 flex flex-col items-center md:items-start gap-6">
            <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-blue-50">
              <img
                src={PHOTO_SEATED}
                alt="Yeukai Kajidori"
                className="w-full h-[480px] object-cover object-top"
              />
            </div>
            <div className="bg-blue-900 text-white rounded-2xl px-6 py-5 w-full max-w-sm">
              <p className="font-extrabold text-lg">Yeukai Kajidori</p>
              <p className="text-blue-200 text-sm mt-1">Founder, The Kajidori Collective</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {credentials.map(c => (
                  <span key={c} className="bg-blue-800 text-blue-100 text-xs font-medium px-3 py-1 rounded-full">{c}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Bio column */}
          <div className="md:col-span-3">
            <p className="text-yellow-500 font-bold text-xs uppercase tracking-[0.2em] mb-4">Meet Your Expert</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-8 leading-tight">
              A Rare 360° Perspective —<br />From the Frontline to the Boardroom.
            </h2>
            <div className="space-y-5 text-slate-600 text-base leading-relaxed">
              <p>
                With over two decades of frontline and executive experience in the UK's health and social care sector, <strong className="text-blue-900">Yeukai Kajidori</strong> is a trusted authority on building compliant, high-performing, and compassionate care services. As the visionary founder of The Kajidori Collective, he brings a rare 360-degree perspective that bridges strategic vision with on-the-ground reality, empowering organisations to achieve sustainable excellence.
              </p>
              <p>
                His journey began in 2003, working hands-on across every facet of the industry — from children's homes and domiciliary care to learning disability services and complex mental health support. He rose through the ranks to become a <strong className="text-blue-900">CQC Registered Manager</strong> and, ultimately, an <strong className="text-blue-900">Operations Director</strong> for several successful organisations, where he wasn't just a leader; he was a catalyst for transformative growth.
              </p>
              <p>
                Yeukai has a proven track record of turning vision into reality. He has <strong className="text-blue-900">doubled business operations</strong>, secured contracts worth over <strong className="text-blue-900">£2.5 million annually</strong>, and successfully launched <strong className="text-blue-900">five new supported living facilities</strong> in just two years. His strategic leadership has consistently resulted in <strong className="text-blue-900">'Good' CQC ratings</strong> and a <strong className="text-blue-900">20% improvement in staff retention</strong>.
              </p>
              <p>
                As the host of the globally-ranked <strong className="text-blue-900">Yeukai Business Show</strong> podcast, he has interviewed over 550 global business leaders. He is also the co-author of the international Amazon bestseller, <em>Eight Qualities for Great Leadership</em>.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { value: '550+', label: 'Podcast Interviews' },
                { value: 'Amazon', label: 'International Bestseller' },
                { value: 'Global', label: 'Top-Ranked Podcast' },
              ].map(item => (
                <div key={item.label} className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-5 text-center">
                  <div className="text-2xl font-extrabold text-blue-900">{item.value}</div>
                  <div className="text-xs text-slate-500 mt-1 font-medium">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-500 font-bold text-xs uppercase tracking-[0.2em] mb-4">What We Offer</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-5">Three Signature Services</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Recognising that sustainable success is built on expert knowledge and inspired leadership, The Kajidori Collective offers three specialist services designed to transform your organisation from the inside out.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map(s => (
              <div key={s.title} className="bg-white rounded-3xl p-10 shadow-sm hover:shadow-xl transition-shadow flex flex-col border border-slate-100">
                <div className="text-5xl mb-6">{s.icon}</div>
                <p className="text-yellow-500 text-xs font-bold uppercase tracking-wider mb-3">{s.tagline}</p>
                <h3 className="text-xl font-extrabold text-blue-900 mb-4 leading-snug">{s.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-8">{s.desc}</p>
                <Link to={s.link} className="inline-flex items-center gap-2 text-blue-700 font-bold text-sm hover:text-blue-900 mt-auto">
                  Find Out More <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY KAJIDORI ─────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-yellow-400 font-bold text-xs uppercase tracking-[0.2em] mb-4">Why The Kajidori Collective</p>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-8">
              Not Just Consultants.<br />
              <span className="text-yellow-400">Partners in Your Success.</span>
            </h2>
            <p className="text-blue-200 text-lg leading-relaxed mb-8">
              Unlike generic training providers, we have lived the reality of health and social care leadership. Every service we offer is grounded in real-world experience — from managing CQC inspections to building high-performing teams and scaling operations.
            </p>
            <ul className="space-y-4">
              {[
                'Sector-specific expertise across all care settings',
                'Proven track record of Good and Outstanding CQC outcomes',
                'Bespoke programmes tailored to your organisation's needs',
                'Ongoing support — not a one-off training day',
                'Led by a practitioner, not a theorist',
              ].map(point => (
                <li key={point} className="flex items-start gap-3 text-blue-100">
                  <span className="text-yellow-400 font-bold text-lg leading-none mt-0.5">✓</span>
                  <span className="text-base leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { value: '20+', label: 'Years of Sector Experience', bg: 'bg-blue-800' },
              { value: '£2.5M+', label: 'Contracts Secured for Clients', bg: 'bg-yellow-400 text-blue-900' },
              { value: '100%', label: 'Bespoke Programmes', bg: 'bg-blue-800' },
              { value: 'Good+', label: 'CQC Outcomes Achieved', bg: 'bg-yellow-400 text-blue-900' },
            ].map(item => (
              <div key={item.label} className={`${item.bg} rounded-3xl p-8 flex flex-col justify-between min-h-[160px]`}>
                <div className={`text-4xl font-extrabold ${item.bg.includes('yellow') ? 'text-blue-900' : 'text-white'}`}>{item.value}</div>
                <div className={`text-sm font-semibold mt-3 leading-snug ${item.bg.includes('yellow') ? 'text-blue-800' : 'text-blue-200'}`}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-yellow-500 font-bold text-xs uppercase tracking-[0.2em] mb-4">Take the Next Step</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6 leading-tight">
            Ready to Elevate Your Service?
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            If you are ready to elevate your service, empower your leaders, and build a legacy of excellence — The Kajidori Collective is your trusted partner. Let's start the conversation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-blue-900 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors">
              Get Started Today
            </Link>
            <Link to="/portal/login" className="border-2 border-blue-900 text-blue-900 px-10 py-5 rounded-xl font-bold text-lg hover:bg-blue-900 hover:text-white transition-colors">
              Client Portal Login
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
