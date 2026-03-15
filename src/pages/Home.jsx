import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const PHOTO_SEATED = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663231528991/iICOqSmlpYSarXZX.jpeg'
const PHOTO_SMILING = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663231528991/jPaHykWfLrMYEDWA.jpeg'

const stats = [
  { stat: '20+', label: 'Years in Health & Social Care' },
  { stat: '£2.5M+', label: 'Contracts Secured Annually' },
  { stat: '550+', label: 'Global Leaders Interviewed' },
  { stat: '5', label: 'New Facilities Launched in 2 Years' },
]

const sectorStats = [
  { value: '1.71M', label: 'Social care workers in England', source: 'Skills for Care 2024/25' },
  { value: '24.7%', label: 'Annual staff turnover rate', source: 'Skills for Care 2024/25' },
  { value: '21,000+', label: 'CQC-registered care locations', source: 'CQC State of Care 2024' },
  { value: '38%', label: 'Workers with relevant qualifications (down from 48%)', source: 'Skills for Care 2024/25' },
]

const services = [
  {
    title: 'Strategic Consulting',
    icon: '🏛️',
    tagline: 'Virtual Compliance & Development Director',
    desc: 'Yeukai partners with health and social care providers to navigate CQC compliance, drive service improvements, and implement robust strategies for organisational growth — providing the strategic oversight needed to build resilient, future-proof services.',
    link: '/contact?type=consulting',
    price: 'From £1,200/day',
    highlight: false,
  },
  {
    title: 'Mental Health & Complex Needs Training',
    icon: '🧠',
    tagline: 'Flagship Certified Group Programme',
    desc: 'Certified, group-based training for professionals working in the mental health and complex needs space. Combining digital accessibility with cutting-edge content, the programme equips teams across the country with the skills to deliver outstanding care.',
    link: '/contact?type=training',
    price: 'From £2,500/day',
    highlight: true,
  },
  {
    title: 'Leadership Mentoring',
    icon: '🎯',
    tagline: 'For CEOs, Registered Managers & Operations Directors',
    desc: 'A structured coaching and mentoring programme designed specifically for the leaders who shape the sector — providing practical wisdom and personalised guidance to cultivate the critical leadership qualities needed to inspire teams and drive operational excellence.',
    link: '/contact?type=mentoring',
    price: '£950 per participant',
    highlight: false,
  },
  {
    title: 'AI Integration for Social Care',
    icon: '🤖',
    tagline: 'New for 2026 — First Mover Advantage',
    desc: 'Half-day and full-day workshops helping care providers understand, evaluate, and implement AI tools responsibly. Covers AI for care documentation, CQC inspection readiness, responsible AI governance, and staff wellbeing applications.',
    link: '/contact?type=consulting',
    price: 'From £1,600',
    highlight: false,
    isNew: true,
  },
]

const credentials = [
  'MBA — Change Management',
  'Level 7 Strategic Management & Leadership',
  'Level 7 Health & Social Care Management',
  'CQC Registered Manager',
  'Amazon Bestselling Author',
]

const pricingRows = [
  { service: 'Mental Health & Safeguarding Training', format: 'Full day, up to 20 delegates', price: '£2,500' },
  { service: 'Mental Health & Safeguarding Training', format: 'Half day, up to 20 delegates', price: '£1,400' },
  { service: 'Open Cohort Training Day', format: 'Per person, open enrolment', price: '£195 pp' },
  { service: 'CQC Readiness Intensive', format: 'Two days, up to 20 delegates', price: '£4,500' },
  { service: 'The Kajidori Leadership Programme', format: '10-week group programme', price: '£950 pp' },
  { service: '1:1 Executive Mentoring', format: 'Monthly retainer (2 sessions)', price: '£1,200/mo' },
  { service: 'Strategic Consulting', format: 'Per day', price: 'From £1,200' },
  { service: 'Retained Consulting Partner', format: 'Monthly retainer', price: 'From £2,500/mo' },
  { service: 'AI Integration Workshop', format: 'Half day, up to 15 delegates', price: '£1,600' },
  { service: 'AI Integration Workshop', format: 'Full day, up to 15 delegates', price: '£2,400' },
]

const faqs = [
  {
    q: 'Do you deliver training in-person or online?',
    a: 'Both. In-person delivery is available across England for groups of 8 or more. Online delivery via Zoom or Teams is available for smaller groups and remote teams. All programmes are designed to be equally effective in both formats.',
  },
  {
    q: 'Are your programmes accredited?',
    a: 'Our programmes are designed to meet CQC Regulation 18 requirements and are aligned with Skills for Care workforce development standards. All participants receive a certificate of completion, and our digital portal provides audit-ready records for CQC inspections.',
  },
  {
    q: 'Can you train our trainers to deliver your programmes?',
    a: 'Yes. We offer a Train the Trainer option for organisations that want to embed our frameworks internally. This includes full programme materials, facilitation guides, and ongoing quality assurance support.',
  },
  {
    q: 'What is the difference between your training and other providers?',
    a: 'Most training providers deliver content. We deliver transformation. Our programmes are designed by someone with an MBA, Level 7 qualifications in health and social care and strategic management, and 20+ years of sector experience — including senior leadership. We understand the regulatory, operational, and human dimensions of care simultaneously.',
  },
  {
    q: 'Do you work with NHS organisations as well as independent providers?',
    a: 'Yes. We work with NHS mental health trusts, integrated care boards, local authority provider networks, and independent care providers. Our experience spans the full spectrum of health and social care.',
  },
  {
    q: 'Should we show your pricing to our board before booking?',
    a: 'Absolutely. All pricing is transparent and shown on this page. We are happy to provide a formal written proposal for board approval — simply complete the enquiry form and request a proposal in the message field.',
  },
]

export default function Home() {
  const [approvedReviews, setApprovedReviews] = useState([])
  const [openFaq, setOpenFaq] = useState(null)
  const [enquiry, setEnquiry] = useState({ name: '', org: '', email: '', service: '', message: '' })
  const [enquiryLoading, setEnquiryLoading] = useState(false)
  const [enquiryDone, setEnquiryDone] = useState(false)

  useEffect(() => {
    supabase.from('reviews_kajidori').select('*').eq('approved', true).order('approved_at', { ascending: false }).limit(6)
      .then(({ data }) => setApprovedReviews(data || []))
  }, [])

  const handleEnquiry = async (e) => {
    e.preventDefault()
    setEnquiryLoading(true)
    try {
      await supabase.from('enquiries_kajidori').insert([{
        service_type: enquiry.service || 'general',
        full_name: enquiry.name,
        email: enquiry.email,
        organisation: enquiry.org,
        message: enquiry.message,
        status: 'new',
      }])
    } catch (_) {}
    setEnquiryLoading(false)
    setEnquiryDone(true)
  }

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white min-h-[90vh] flex items-center px-4 py-16">
        <div className="max-w-5xl mx-auto w-full text-center">
          <p className="text-yellow-400 font-bold text-xs uppercase tracking-[0.3em] mb-6">The Kajidori Collective</p>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-8">
            Transforming Health &amp; Social Care,<br />
            <span className="text-yellow-400">One Leader at a Time.</span>
          </h1>
          <p className="text-blue-200 text-xl leading-relaxed mb-12 max-w-3xl mx-auto">
            Your Partner in Compliance, Excellence, and Inspired Leadership — serving health and social care organisations across the UK.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#enquire" className="bg-yellow-400 text-blue-900 px-10 py-5 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors">
              Book a Discovery Call
            </a>
            <Link to="/portal/login" className="border-2 border-white text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-900 transition-colors">
              Client Portal
            </Link>
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

      {/* ── SECTOR URGENCY ───────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-blue-950 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-yellow-400 font-bold text-xs uppercase tracking-[0.2em] mb-3">The Reality of the Sector</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Why the Demand for Expert Training Has Never Been Greater</h2>
            <p className="text-blue-300 max-w-2xl mx-auto text-base">The workforce gap is widening. CQC scrutiny is intensifying. The organisations that invest in expert development now will be the ones that thrive.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sectorStats.map(s => (
              <div key={s.label} className="bg-blue-900/60 rounded-2xl p-6 text-center border border-blue-800">
                <div className="text-3xl md:text-4xl font-extrabold text-yellow-400 mb-2">{s.value}</div>
                <div className="text-sm text-blue-200 leading-snug mb-2">{s.label}</div>
                <div className="text-xs text-blue-400">{s.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-500 font-bold text-xs uppercase tracking-[0.2em] mb-4">What We Offer</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-5">Four Specialist Services</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Every programme is designed around the specific pressures, regulatory requirements, and workforce challenges facing health and social care providers in England today.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(s => (
              <div key={s.title} className={`bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow flex flex-col border ${s.highlight ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-100'} relative`}>
                {s.isNew && (
                  <span className="absolute top-4 right-4 bg-yellow-400 text-blue-900 text-xs font-bold px-2 py-1 rounded-full">NEW 2026</span>
                )}
                {s.highlight && (
                  <span className="absolute top-4 right-4 bg-blue-900 text-white text-xs font-bold px-2 py-1 rounded-full">Most Popular</span>
                )}
                <div className="text-4xl mb-5">{s.icon}</div>
                <p className="text-yellow-500 text-xs font-bold uppercase tracking-wider mb-2">{s.tagline}</p>
                <h3 className="text-lg font-extrabold text-blue-900 mb-3 leading-snug">{s.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-6">{s.desc}</p>
                <div className="border-t border-slate-100 pt-4">
                  <div className="text-xl font-extrabold text-blue-900 mb-3">{s.price}</div>
                  <a href="#enquire" className={`inline-flex items-center gap-2 font-bold text-sm ${s.highlight ? 'text-blue-700 hover:text-blue-900' : 'text-blue-600 hover:text-blue-900'}`}>
                    Enquire Now <span>→</span>
                  </a>
                </div>
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
                "Bespoke programmes tailored to your organisation's needs",
                'Ongoing support — not a one-off training day',
                'Led by a practitioner, not a theorist',
                'AI-forward approach — preparing your organisation for the future',
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
              { value: '£2.5M+', label: 'Contracts Secured for Clients', bg: 'bg-blue-800' },
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

      {/* ── PRICING TABLE ────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white" id="pricing">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-yellow-500 font-bold text-xs uppercase tracking-[0.2em] mb-4">Investment</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">Transparent Pricing. Exceptional Value.</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              All prices exclude VAT. Consulting and multi-day programme fees are tailored to your organisation's specific needs.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="text-left px-6 py-4 font-semibold">Service</th>
                  <th className="text-left px-6 py-4 font-semibold hidden md:table-cell">Format</th>
                  <th className="text-right px-6 py-4 font-semibold">Investment</th>
                </tr>
              </thead>
              <tbody>
                {pricingRows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-6 py-3.5 font-medium text-blue-900">{row.service}</td>
                    <td className="px-6 py-3.5 text-slate-500 hidden md:table-cell">{row.format}</td>
                    <td className="px-6 py-3.5 text-right font-bold text-blue-700">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-xs text-slate-400 mt-4">All prices exclude VAT. Local authority, NHS, and multi-site group rates available on request.</p>
          <div className="text-center mt-8">
            <a href="#enquire" className="bg-blue-900 text-white px-10 py-4 rounded-xl font-bold text-base hover:bg-blue-800 transition-colors inline-block">
              Request a Proposal
            </a>
          </div>
        </div>
      </section>

      {/* ── AI SECTION ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">New for 2026</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mt-5 mb-6 leading-tight">
              AI Integration for Social Care —<br />
              <span className="text-blue-600">Before Your Competitors Get There First</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-5">
              27% of care providers still use no technology at all. The ones who learn to use AI responsibly in the next 12 months will have a structural advantage in recruitment, compliance, and quality of care for years to come.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              Our AI integration workshops are designed specifically for the social care context — delivered by someone who understands both the technology and the regulatory environment.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'AI for care documentation — save 5+ hours per week',
                'AI for CQC inspection readiness and self-assessment',
                'Responsible AI governance and GDPR compliance',
                'AI tools for staff wellbeing and retention',
              ].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
            <a href="#enquire" className="bg-blue-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-800 transition-colors inline-block">
              Register Your Interest
            </a>
          </div>
          <div className="bg-blue-900 rounded-3xl p-8 text-white">
            <h3 className="text-xl font-extrabold mb-6">AI Workshop Options</h3>
            {[
              { title: 'AI for Documentation', duration: 'Half day (3.5 hrs)', price: '£1,600', desc: 'Practical session on using AI to draft care plans, risk assessments, and incident reports.' },
              { title: 'Responsible AI in Social Care', duration: 'Full day', price: '£2,400', desc: 'Comprehensive workshop covering tools, governance, GDPR, and CQC implications.' },
              { title: 'AI for CQC Readiness', duration: 'Full day', price: '£2,400', desc: 'Use AI as a self-assessment tool to identify compliance gaps before inspection.' },
            ].map(w => (
              <div key={w.title} className="border border-white/20 rounded-2xl p-5 mb-4 last:mb-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-white">{w.title}</div>
                  <div className="text-yellow-400 font-extrabold text-sm">{w.price}</div>
                </div>
                <div className="text-xs text-blue-300 mb-2">{w.duration} · Up to 15 delegates</div>
                <div className="text-sm text-blue-200">{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      {approvedReviews.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-yellow-500 font-bold text-xs uppercase tracking-[0.2em] mb-3">What People Say</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900">Voices From Our Community</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedReviews.map(rev => (
                <div key={rev.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col">
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map(s => <span key={s} className={s <= (rev.rating || 5) ? 'text-yellow-400 text-lg' : 'text-slate-200 text-lg'}>{String.fromCharCode(9733)}</span>)}
                  </div>
                  {rev.headline && <h3 className="font-bold text-blue-900 mb-2 text-sm">&ldquo;{rev.headline}&rdquo;</h3>}
                  <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-4">{rev.review_text}</p>
                  <div className="border-t border-slate-100 pt-3 flex items-center gap-3">
                    {rev.reviewer_avatar ? (
                      <img src={rev.reviewer_avatar} alt={rev.reviewer_name} className="w-11 h-11 rounded-full object-cover border-2 border-blue-100 flex-shrink-0" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                        {(rev.reviewer_name || '?')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-slate-800 text-sm truncate">{rev.reviewer_name}</div>
                      <div className="text-xs text-slate-500 truncate">{rev.reviewer_role ? rev.reviewer_role.charAt(0).toUpperCase() + rev.reviewer_role.slice(1) : ''}{rev.organisation ? ` · ${rev.organisation}` : ''}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-yellow-500 font-bold text-xs uppercase tracking-[0.2em] mb-3">Common Questions</p>
            <h2 className="text-4xl font-extrabold text-blue-900">Everything You Need to Know</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  className="w-full text-left px-6 py-5 flex justify-between items-center font-semibold text-blue-900 hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <span className={`text-slate-400 text-xl ml-4 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENQUIRY FORM ─────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-blue-900 text-white" id="enquire">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-yellow-400 font-bold text-xs uppercase tracking-[0.2em] mb-4">Get in Touch</p>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Let's Talk About What Your Organisation Needs
            </h2>
            <p className="text-blue-200 text-lg leading-relaxed mb-8">
              Every engagement begins with a complimentary 30-minute discovery call. No sales pitch — just a genuine conversation about where you are, where you want to be, and whether we're the right fit to help you get there.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center shrink-0">📧</div>
                <div>
                  <div className="text-xs text-blue-400">Email</div>
                  <div className="font-semibold">hello@kajidoricollective.co.uk</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center shrink-0">💼</div>
                <div>
                  <div className="text-xs text-blue-400">LinkedIn</div>
                  <div className="font-semibold">The Kajidori Collective</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center shrink-0">🎙️</div>
                <div>
                  <div className="text-xs text-blue-400">Podcast</div>
                  <div className="font-semibold">Yeukai Business Show</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 text-slate-800">
            {enquiryDone ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-extrabold text-blue-900 mb-2">Thank you, {enquiry.name || 'you'}!</h3>
                <p className="text-slate-600 text-sm">We'll be in touch within one business day to arrange your complimentary discovery call.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-extrabold text-blue-900 mb-6">Book a Discovery Call</h3>
                <form onSubmit={handleEnquiry} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Your Name *</label>
                      <input required type="text" value={enquiry.name} onChange={e => setEnquiry({...enquiry, name: e.target.value})}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Jane Smith" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Organisation *</label>
                      <input required type="text" value={enquiry.org} onChange={e => setEnquiry({...enquiry, org: e.target.value})}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Care Home / NHS Trust" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Email Address *</label>
                    <input required type="email" value={enquiry.email} onChange={e => setEnquiry({...enquiry, email: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="jane@organisation.co.uk" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Service of Interest</label>
                    <select value={enquiry.service} onChange={e => setEnquiry({...enquiry, service: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="">Select a service...</option>
                      <option>Mental Health &amp; Safeguarding Training</option>
                      <option>CQC Readiness Intensive</option>
                      <option>The Kajidori Leadership Programme</option>
                      <option>Strategic Consulting</option>
                      <option>AI Integration Workshop</option>
                      <option>1:1 Executive Mentoring</option>
                      <option>Not sure — I'd like to discuss</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Tell us about your organisation</label>
                    <textarea value={enquiry.message} onChange={e => setEnquiry({...enquiry, message: e.target.value})}
                      rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Number of staff, current CQC rating, what you're hoping to achieve..." />
                  </div>
                  <button type="submit" disabled={enquiryLoading}
                    className="w-full bg-blue-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors disabled:opacity-50">
                    {enquiryLoading ? 'Sending...' : 'Book My Discovery Call →'}
                  </button>
                  <p className="text-xs text-slate-400 text-center">No commitment required. We respond within one business day.</p>
                </form>
              </>
            )}
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
            <a href="#enquire" className="bg-blue-900 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors">
              Get Started Today
            </a>
            <Link to="/portal/login" className="border-2 border-blue-900 text-blue-900 px-10 py-5 rounded-xl font-bold text-lg hover:bg-blue-900 hover:text-white transition-colors">
              Client Portal Login
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
