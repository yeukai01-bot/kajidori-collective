import { Link } from 'react-router-dom'

const PHOTO_SEATED = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663231528991/iICOqSmlpYSarXZX.jpeg'
const PHOTO_SMILING = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663231528991/jPaHykWfLrMYEDWA.jpeg'

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <p className="text-yellow-400 font-semibold text-sm uppercase tracking-widest mb-4">The Kajidori Collective</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              The UK's Premier Partner in<br />
              <span className="text-yellow-400">Health &amp; Social Care Excellence.</span>
            </h1>
            <p className="text-blue-100 text-xl font-medium max-w-xl mb-3 leading-snug">
              Compliance. Leadership. Transformation.
            </p>
            <p className="text-blue-200 text-base max-w-xl mb-10 leading-relaxed">
              We equip health and social care organisations across the UK with the training, mentoring, and strategic leadership needed to meet CQC standards, retain top talent, and deliver outstanding care — one leader at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/contact" className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors">
                Work With Us
              </Link>
              <Link to="/portal/login" className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-900 transition-colors">
                Client Portal
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-yellow-400 py-8 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { stat: '20+', label: 'Years in Health & Social Care' },
            { stat: '£2.5M+', label: 'Contracts Secured Annually' },
            { stat: '550+', label: 'Global Leaders Interviewed' },
            { stat: '5', label: 'New Facilities Launched in 2 Years' },
          ].map(item => (
            <div key={item.label}>
              <div className="text-3xl font-bold text-blue-900">{item.stat}</div>
              <div className="text-blue-800 text-sm font-medium mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About / Bio */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-14">
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            <div className="w-64 h-72 rounded-2xl overflow-hidden shadow-xl border-4 border-blue-100">
              <img
                src={PHOTO_SMILING}
                alt="Yeukai Kajidori"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="text-center">
              <p className="font-bold text-blue-900 text-lg">Yeukai Kajidori</p>
              <p className="text-slate-500 text-sm">Founder, The Kajidori Collective</p>
              <p className="text-slate-500 text-sm">MBA | Level 7 Leadership & HSC</p>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-yellow-500 font-semibold text-sm uppercase tracking-widest mb-3">Meet Your Expert</p>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6 leading-snug">
              A Rare 360° Perspective — From the Frontline to the Boardroom
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
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
            <div className="mt-8 flex flex-wrap gap-3">
              {['MBA — Change Management', 'Level 7 Strategic Management & Leadership', 'Level 7 Health & Social Care Management', 'CQC Registered Manager', 'Amazon Bestselling Author'].map(q => (
                <span key={q} className="bg-blue-50 text-blue-800 text-xs font-semibold px-3 py-2 rounded-full border border-blue-100">{q}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <p className="text-yellow-500 font-semibold text-sm uppercase tracking-widest text-center mb-3">What We Offer</p>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-4">Three Signature Services</h2>
          <p className="text-center text-slate-600 mb-14 max-w-2xl mx-auto leading-relaxed">
            Recognising that sustainable success is built on expert knowledge and inspired leadership, The Kajidori Collective offers three specialist services designed to transform your organisation from the inside out.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Strategic Consulting',
                icon: '🏛️',
                tagline: 'Virtual Compliance & Development Director',
                desc: 'Yeukai partners with health and social care providers to navigate CQC compliance, drive service improvements, and implement robust strategies for organisational growth. He provides the strategic oversight and expert guidance needed to build resilient, future-proof services.',
                link: '/contact?type=consulting',
              },
              {
                title: 'Mental Health & Complex Needs Training',
                icon: '🧠',
                tagline: 'Flagship Certified Group Programme',
                desc: 'This flagship programme delivers certified, group-based training for professionals working in the mental health and complex needs space. Combining digital accessibility with cutting-edge content, the training equips teams across the country with the skills to deliver outstanding care.',
                link: '/contact?type=training',
              },
              {
                title: 'Leadership Mentoring',
                icon: '🎯',
                tagline: 'For CEOs, Registered Managers & Operations Directors',
                desc: 'A structured coaching and mentoring programme designed specifically for the leaders who shape the sector. This programme goes beyond theory, providing practical wisdom and personalised guidance to cultivate the critical leadership qualities needed to inspire teams and drive operational excellence.',
                link: '/contact?type=mentoring',
              },
            ].map(s => (
              <div key={s.title} className="bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-xl transition-shadow flex flex-col">
                <div className="text-4xl mb-4">{s.icon}</div>
                <p className="text-yellow-500 text-xs font-bold uppercase tracking-wider mb-2">{s.tagline}</p>
                <h3 className="text-xl font-bold text-blue-900 mb-3">{s.title}</h3>
                <p className="text-slate-600 mb-6 text-sm leading-relaxed flex-1">{s.desc}</p>
                <Link to={s.link} className="text-blue-700 font-semibold text-sm hover:text-blue-900 flex items-center gap-1 mt-auto">
                  Find Out More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Thought leadership */}
      <section className="py-16 px-4 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <p className="text-yellow-500 font-semibold text-sm uppercase tracking-widest mb-3">Thought Leadership</p>
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">Globally Recognised. Locally Impactful.</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Yeukai is the host of the <strong className="text-blue-900">Yeukai Business Show</strong> — a globally-ranked podcast where he has interviewed over 550 of the world's most successful business leaders. He is also the co-author of the international Amazon bestseller <em>Eight Qualities for Great Leadership</em>, cementing his status as a forward-thinking authority in his field.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="bg-blue-50 rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-bold text-blue-900">550+</div>
                <div className="text-xs text-slate-500 mt-1">Podcast Interviews</div>
              </div>
              <div className="bg-yellow-50 rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-bold text-blue-900">Amazon</div>
                <div className="text-xs text-slate-500 mt-1">International Bestseller</div>
              </div>
              <div className="bg-blue-50 rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-bold text-blue-900">Global</div>
                <div className="text-xs text-slate-500 mt-1">Top-Ranked Podcast</div>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-56 h-64 rounded-2xl overflow-hidden shadow-lg border-4 border-yellow-400">
            <img
              src={PHOTO_SEATED}
              alt="Yeukai Kajidori — Thought Leader"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-900 text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Elevate Your Service?</h2>
          <p className="text-blue-200 mb-8 text-lg leading-relaxed">
            If you are ready to elevate your service, empower your leaders, and build a legacy of excellence — The Kajidori Collective is your trusted partner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors inline-block">
              Get Started Today
            </Link>
            <Link to="/portal/login" className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-900 transition-colors inline-block">
              Client Portal Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
