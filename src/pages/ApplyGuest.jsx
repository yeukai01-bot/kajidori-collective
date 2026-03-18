import { Link } from 'react-router-dom'

const tiers = [
  {
    name: 'The Essential',
    price: '£97',
    duration: '1 hour',
    tagline: 'Share your expertise. Build your profile.',
    description: 'A professional recorded interview on Kajidori Collective Conversations, published across all major podcast platforms.',
    features: [
      '1-hour recorded interview with Yeukai Kajidori',
      'Episode published on Spotify, Apple Podcasts & all major platforms',
      'Shareable episode link for your own promotion',
      'Digital guest badge for your LinkedIn and website',
      'Google Meet session — no travel required',
    ],
    cta: 'Book The Essential',
    url: 'https://ybs.trafft.com/services/kcc-guest-appearance-the-essential',
    highlight: false,
    badge: null,
    color: 'border-gray-200',
    btnClass: 'bg-blue-900 hover:bg-blue-800 text-white',
    priceColor: 'text-blue-900',
  },
  {
    name: 'The Featured',
    price: '£197',
    duration: '1 hour',
    tagline: 'Stand out as a sector leader.',
    description: 'Everything in The Essential, plus enhanced promotion and a dedicated episode feature that positions you as a recognised authority in UK care.',
    features: [
      'Everything in The Essential',
      'Featured episode with extended show notes and bio',
      'Social media promotion across KCC channels',
      'Episode highlight clip for your own social media',
      'Listed as a Featured Guest on the KCC website',
      'Priority scheduling within 4 weeks',
    ],
    cta: 'Book The Featured',
    url: 'https://ybs.trafft.com/services/kcc-guest-appearance-the-featured',
    highlight: true,
    badge: 'Most Popular',
    color: 'border-yellow-400',
    btnClass: 'bg-yellow-400 hover:bg-yellow-300 text-blue-900',
    priceColor: 'text-blue-900',
  },
  {
    name: 'The Authority',
    price: '£397',
    duration: '1.5 hours',
    tagline: 'The complete authority experience.',
    description: 'The premium guest package — designed for CEOs and senior care leaders who want to maximise the impact of their appearance and build a lasting relationship with the KCC community.',
    features: [
      'Everything in The Featured',
      '30-minute pre-interview strategy session with Yeukai',
      'Personalised episode introduction positioning you as a sector authority',
      'Full episode transcript delivered to you',
      'Personal introduction to Yeukai\'s consulting and training network',
      'Priority scheduling within 2 weeks',
      'Invitation to KCC\'s private sector leaders network',
    ],
    cta: 'Book The Authority',
    url: 'https://ybs.trafft.com/services/kcc-guest-appearance-the-authority',
    highlight: false,
    badge: 'Premium',
    color: 'border-blue-900',
    btnClass: 'bg-blue-900 hover:bg-blue-800 text-white',
    priceColor: 'text-blue-900',
  },
]

const faqs = [
  {
    q: 'Who is this for?',
    a: 'Kajidori Collective Conversations is for registered managers, care group CEOs, commissioners, and senior leaders in UK health and social care who want to share their expertise, build their professional profile, and connect with a sector-wide audience.',
  },
  {
    q: 'Why is there a fee?',
    a: 'The fee covers production, editing, distribution, and promotion costs — and it ensures that every guest is genuinely committed to delivering a high-quality conversation. Guests who invest in their appearance consistently show up better prepared and deliver more value to our listeners.',
  },
  {
    q: 'What happens after I book?',
    a: 'You will receive a confirmation email with your Google Meet link and calendar invite. Yeukai will send you a brief pre-interview guide to help you prepare. The session is recorded via Google Meet and professionally edited before publication.',
  },
  {
    q: 'How long until my episode is published?',
    a: 'Episodes are typically published within 4–6 weeks of recording. Featured and Authority guests receive priority scheduling and earlier publication.',
  },
  {
    q: 'Can I share the episode?',
    a: 'Absolutely — and we encourage it. You will receive a shareable link and, for Featured and Authority guests, a highlight clip optimised for LinkedIn and social media.',
  },
]

export default function ApplyGuest() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-blue-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-yellow-400 text-blue-900 text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-6">
            Now Accepting Applications
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Apply to be a Guest on<br />
            <span className="text-yellow-400">Kajidori Collective Conversations</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Join 584+ business leaders who have shared their expertise on one of the UK's leading care sector podcasts. Choose the package that fits your goals.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-200">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Google Meet — no travel required
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Published on Spotify, Apple Podcasts & more
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Hosted by Yeukai Kajidori, MBA
            </span>
          </div>
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Choose Your Guest Package</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Every package includes a professionally produced episode. The tier you choose determines the depth of your feature and the level of promotion.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative bg-white rounded-2xl border-2 ${tier.color} shadow-sm flex flex-col ${tier.highlight ? 'shadow-xl scale-105' : ''}`}
              >
                {tier.badge && (
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 ${tier.highlight ? 'bg-yellow-400 text-blue-900' : 'bg-blue-900 text-white'} text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full`}>
                    {tier.badge}
                  </div>
                )}
                <div className="p-8 flex flex-col flex-1">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-blue-900 mb-1">{tier.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{tier.tagline}</p>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className={`text-4xl font-extrabold ${tier.priceColor}`}>{tier.price}</span>
                      <span className="text-gray-400 text-sm">one-time</span>
                    </div>
                    <p className="text-xs text-gray-400">{tier.duration} session</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">{tier.description}</p>
                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={tier.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block text-center py-3 px-6 rounded-xl font-semibold text-sm transition-colors ${tier.btnClass}`}
                  >
                    {tier.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-8">
            All payments are processed securely. You will receive a confirmation email with your Google Meet link and calendar invite immediately after booking.
          </p>
        </div>
      </section>

      {/* Social proof / About host */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-yellow-500 font-semibold text-sm uppercase tracking-widest">Your Host</span>
              <h2 className="text-3xl font-bold text-blue-900 mt-2 mb-4">Yeukai Kajidori</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                CQC Registered Manager, MBA-qualified strategist, and Amazon bestselling author with over 20 years in UK health and social care. Since 2016, he has hosted the Yeukai Business Show — one of the UK's leading business podcasts — interviewing more than 584 global leaders across nine years.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Kajidori Collective Conversations is his dedicated platform for the care sector: a space where registered managers, care group CEOs, and commissioners share the real story behind outstanding care.
              </p>
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-blue-900">584+</div>
                  <div className="text-xs text-gray-500 mt-1">Episodes recorded</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-blue-900">9</div>
                  <div className="text-xs text-gray-500 mt-1">Years on air</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-blue-900">20+</div>
                  <div className="text-xs text-gray-500 mt-1">Years in care</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663231528991/jPaHykWfLrMYEDWA.jpeg"
                alt="Yeukai Kajidori"
                className="w-72 h-72 rounded-2xl object-cover object-top shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What guests say / trust signals */}
      <section className="py-16 px-4 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Why Care Leaders Choose to Appear on KCC</h2>
          <p className="text-blue-200 mb-12 max-w-2xl mx-auto">
            A guest appearance on Kajidori Collective Conversations is more than a podcast interview. It is a positioning statement — a signal to your peers, your team, and the wider sector that you are a leader worth listening to.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🎙️', title: 'Reach a targeted audience', body: 'Your episode reaches registered managers, care group leaders, and commissioners across the UK who are actively looking for insight and inspiration.' },
              { icon: '🏆', title: 'Build your authority', body: 'Being featured on a sector podcast with 584+ episodes signals credibility. Use your episode link on LinkedIn, in bids, and in your professional bio.' },
              { icon: '🤝', title: 'Connect with Yeukai\'s network', body: 'Featured and Authority guests gain direct access to Yeukai\'s consulting and training network — opening doors to collaboration, referrals, and new opportunities.' },
            ].map((item) => (
              <div key={item.title} className="bg-blue-800 rounded-xl p-6 text-left">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-blue-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-yellow-400">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Ready to share your story?</h2>
          <p className="text-blue-800 mb-8 text-lg">
            Choose your package above and book your session today. Slots are limited — Yeukai records a maximum of 8 episodes per month.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://ybs.trafft.com/services/kcc-guest-appearance-the-essential"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-900 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors"
            >
              Book Essential — £97
            </a>
            <a
              href="https://ybs.trafft.com/services/kcc-guest-appearance-the-featured"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-900 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors"
            >
              Book Featured — £197
            </a>
            <a
              href="https://ybs.trafft.com/services/kcc-guest-appearance-the-authority"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-900 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors"
            >
              Book Authority — £397
            </a>
          </div>
          <p className="text-blue-700 text-xs mt-6">
            Not sure which package is right for you?{' '}
            <Link to="/contact" className="underline font-semibold">Get in touch</Link> and we will help you decide.
          </p>
        </div>
      </section>
    </div>
  )
}
