import { useState } from 'react'
import { Link } from 'react-router-dom'

const TIERS = [
  {
    id: 'expert',
    name: 'Expert Interview',
    price: 'Free',
    tagline: 'Share your story. No cost.',
    features: [
      '90-min deep-dive recorded interview',
      'Published on all major podcast platforms',
      'Shareable episode link',
      'Digital guest badge',
    ],
    badge: null,
    highlight: false,
    color: 'border-gray-200',
    badgeClass: '',
  },
  {
    id: 'essential',
    name: 'The Essential',
    price: '£97',
    tagline: 'Build your profile in the sector.',
    features: [
      '1-hour recorded interview',
      'Professional audio production',
      'Episode published on all platforms',
      'LinkedIn post feature',
      'Instagram feature',
      'Shareable episode link',
    ],
    badge: 'Best Value',
    highlight: false,
    color: 'border-gray-300',
    badgeClass: 'bg-gray-700 text-white',
  },
  {
    id: 'featured',
    name: 'The Featured',
    price: '£197',
    tagline: 'Stand out as a sector leader.',
    features: [
      'Everything in The Essential',
      'Extended show notes & bio',
      '30-day social media promotion',
      'Episode highlight clip for your socials',
      'Listed as Featured Guest on KCC website',
      'Priority scheduling within 4 weeks',
    ],
    badge: 'Most Popular',
    highlight: true,
    color: 'border-yellow-400',
    badgeClass: 'bg-yellow-400 text-blue-900',
  },
  {
    id: 'authority',
    name: 'The Authority',
    price: '£397',
    tagline: 'The complete authority experience.',
    features: [
      'Everything in The Featured',
      '30-min pre-interview strategy session',
      'LinkedIn thought leadership article',
      'Full episode transcript delivered to you',
      'Backlink to your website from episode page',
      'Priority scheduling within 2 weeks',
      'Invitation to KCC private leaders network',
    ],
    badge: 'Premium',
    highlight: false,
    color: 'border-blue-900',
    badgeClass: 'bg-blue-900 text-white',
  },
]

const CRITERIA = [
  'You are a registered manager, care group CEO, operations director, commissioner, or senior leader in UK health and social care.',
  'You have a genuine insight, lesson, or story that would benefit the care sector.',
  'You are an authority in your field with a proven track record.',
  'You are committed to helping the sector find better, more compassionate ways to serve people.',
]

const TRAFFT_URLS = {
  expert: 'https://ybs.trafft.com/',
  essential: 'https://ybs.trafft.com/',
  featured: 'https://ybs.trafft.com/',
  authority: 'https://ybs.trafft.com/',
}

const FAQS = [
  {
    q: 'Who is this for?',
    a: 'Kajidori Collective Conversations is for registered managers, care group CEOs, commissioners, and senior leaders in UK health and social care who want to share their expertise, build their professional profile, and connect with a sector-wide audience.',
  },
  {
    q: 'Why is there a fee for some packages?',
    a: 'The fee covers professional production, editing, distribution, and promotion. It also ensures every guest is genuinely committed to delivering a high-quality conversation. Guests who invest consistently show up better prepared and deliver more value to our listeners.',
  },
  {
    q: 'What happens after I submit my application?',
    a: 'We review every application within 24 hours to ensure a strong fit for our audience. If approved, you will receive an email with a link to book your session on your chosen package. No payment is taken until you schedule your call.',
  },
  {
    q: 'How long until my episode is published?',
    a: 'Episodes are typically published within 4–6 weeks of recording. Featured and Authority guests receive priority scheduling and earlier publication.',
  },
  {
    q: 'Can I share the episode?',
    a: 'Absolutely — and we encourage it. You will receive a shareable link and, for Featured and Authority guests, a highlight clip optimised for LinkedIn and social media.',
  },
  {
    q: 'Is there a risk if I apply and am not selected?',
    a: 'There is zero risk. The application is completely free. If your application is not the right fit for our current audience, we will let you know respectfully and suggest an alternative way to connect.',
  },
]

export default function ApplyGuest() {
  const [selectedTier, setSelectedTier] = useState('featured')
  const [step, setStep] = useState(1) // 1 = form, 2 = submitted
  const [submitting, setSubmitting] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    organisation: '',
    website: '',
    linkedin: '',
    bio: '',
    topic1: '',
    topic2: '',
    topic3: '',
    callToAction: '',
    heardAbout: '',
    tier: 'featured',
    agreeTerms: false,
  })
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleTierSelect(tierId) {
    setSelectedTier(tierId)
    setForm(prev => ({ ...prev, tier: tierId }))
  }

  function validate() {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.jobTitle.trim()) e.jobTitle = 'Required'
    if (!form.organisation.trim()) e.organisation = 'Required'
    if (!form.bio.trim() || form.bio.trim().length < 50) e.bio = 'Please write at least 50 characters'
    if (!form.topic1.trim()) e.topic1 = 'Please provide at least one topic'
    if (!form.callToAction.trim()) e.callToAction = 'Required'
    if (!form.agreeTerms) e.agreeTerms = 'You must agree to continue'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      const firstErr = document.querySelector('[data-error="true"]')
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setSubmitting(true)
    // Simulate submission — in production this would POST to a backend or email service
    await new Promise(r => setTimeout(r, 1200))
    setSubmitting(false)
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const selectedTierData = TIERS.find(t => t.id === selectedTier)

  if (step === 2) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="max-w-xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Application Received</h1>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Thank you, <strong>{form.firstName}</strong>. Your application for <strong>{selectedTierData?.name}</strong> has been submitted successfully.
          </p>
          <p className="text-gray-600 mb-8 leading-relaxed">
            We review every application personally to ensure a strong fit for our audience. You will hear from us within <strong>24 hours</strong>. If approved, we will send you a direct booking link — no payment is taken until you schedule your session.
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-left mb-8">
            <h3 className="font-bold text-blue-900 mb-3">What happens next</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-3"><span className="w-6 h-6 rounded-full bg-yellow-400 text-blue-900 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>We review your application (within 24 hours)</li>
              <li className="flex items-start gap-3"><span className="w-6 h-6 rounded-full bg-yellow-400 text-blue-900 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>You receive a personalised booking invitation by email</li>
              <li className="flex items-start gap-3"><span className="w-6 h-6 rounded-full bg-yellow-400 text-blue-900 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>You select your date and complete your booking (payment taken here)</li>
              <li className="flex items-start gap-3"><span className="w-6 h-6 rounded-full bg-yellow-400 text-blue-900 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">4</span>You receive a pre-interview guide and your Google Meet link</li>
              <li className="flex items-start gap-3"><span className="w-6 h-6 rounded-full bg-yellow-400 text-blue-900 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">5</span>We record, produce, and publish your episode</li>
            </ol>
          </div>
          <Link to="/" className="inline-block bg-blue-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

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
            Join 584+ leaders who have shared their expertise on one of the UK's leading care sector podcasts. We review every application personally — no payment is taken until you are approved and ready to book.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-200">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              No payment until approved
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Response within 24 hours
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Maximum 8 episodes per month
            </span>
          </div>
        </div>
      </section>

      {/* Qualification criteria */}
      <section className="py-14 px-4 bg-gray-50 border-b border-gray-200">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">To qualify as a guest, you must:</h2>
          <p className="text-gray-500 text-center text-sm mb-8">We carefully review every application to ensure the right fit for our audience.</p>
          <ul className="space-y-4">
            {CRITERIA.map((c, i) => (
              <li key={i} className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <span className="w-7 h-7 rounded-full bg-yellow-400 text-blue-900 font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-gray-700 text-sm leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tier selector */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Choose Your Package</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">Select the package you are applying for. You can change this before your final booking if approved.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TIERS.map(tier => (
              <button
                key={tier.id}
                type="button"
                onClick={() => handleTierSelect(tier.id)}
                className={`relative text-left rounded-2xl border-2 p-5 transition-all focus:outline-none ${
                  selectedTier === tier.id
                    ? `${tier.color} shadow-lg ring-2 ring-offset-2 ${tier.id === 'featured' ? 'ring-yellow-400' : 'ring-blue-900'}`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {tier.badge && (
                  <span className={`absolute -top-3 left-4 text-xs font-bold uppercase tracking-widest px-3 py-0.5 rounded-full ${tier.badgeClass}`}>
                    {tier.badge}
                  </span>
                )}
                <div className="mt-2">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1">{tier.name}</p>
                  <p className="text-2xl font-extrabold text-blue-900 mb-1">{tier.price}</p>
                  <p className="text-xs text-gray-500 mb-4">{tier.tagline}</p>
                  <ul className="space-y-1.5">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <svg className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                {selectedTier === tier.id && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-900 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Your Application</h2>
            <p className="text-gray-500 text-sm">Takes about 5 minutes. No payment is required at this stage.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">

            {/* Personal details */}
            <div>
              <h3 className="text-sm font-bold text-blue-900 uppercase tracking-widest mb-5 pb-2 border-b border-gray-100">About You</h3>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="First Name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} required />
                <Field label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} required />
                <Field label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required />
                <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} />
                <Field label="Job Title" name="jobTitle" value={form.jobTitle} onChange={handleChange} error={errors.jobTitle} required placeholder="e.g. Registered Manager, CEO, Operations Director" />
                <Field label="Organisation" name="organisation" value={form.organisation} onChange={handleChange} error={errors.organisation} required />
                <Field label="Website (optional)" name="website" type="url" value={form.website} onChange={handleChange} error={errors.website} placeholder="https://" />
                <Field label="LinkedIn Profile (optional)" name="linkedin" type="url" value={form.linkedin} onChange={handleChange} error={errors.linkedin} placeholder="https://linkedin.com/in/..." />
              </div>
            </div>

            {/* Bio */}
            <div>
              <h3 className="text-sm font-bold text-blue-900 uppercase tracking-widest mb-5 pb-2 border-b border-gray-100">Your Story</h3>
              <TextArea
                label="Your Professional Bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                error={errors.bio}
                required
                rows={5}
                placeholder="Tell us about your background, your role, and what makes your perspective valuable to care sector leaders. (Minimum 50 characters)"
                hint="This will be used to introduce you to our audience and in your episode show notes."
              />
            </div>

            {/* Topics */}
            <div>
              <h3 className="text-sm font-bold text-blue-900 uppercase tracking-widest mb-5 pb-2 border-b border-gray-100">What You Want to Talk About</h3>
              <p className="text-xs text-gray-500 mb-5">Suggest 1–3 topics you would like to explore in your interview. These help Yeukai prepare a focused, high-value conversation.</p>
              <div className="space-y-4">
                <Field label="Topic 1" name="topic1" value={form.topic1} onChange={handleChange} error={errors.topic1} required placeholder="e.g. How we achieved Outstanding in our last CQC inspection" />
                <Field label="Topic 2 (optional)" name="topic2" value={form.topic2} onChange={handleChange} error={errors.topic2} placeholder="e.g. Building a culture of dignity and respect in a 200-person care team" />
                <Field label="Topic 3 (optional)" name="topic3" value={form.topic3} onChange={handleChange} error={errors.topic3} placeholder="e.g. What I wish I had known when I became a Registered Manager" />
              </div>
            </div>

            {/* Call to action */}
            <div>
              <h3 className="text-sm font-bold text-blue-900 uppercase tracking-widest mb-5 pb-2 border-b border-gray-100">Your Call to Action</h3>
              <TextArea
                label="What would you like listeners to do after hearing your episode?"
                name="callToAction"
                value={form.callToAction}
                onChange={handleChange}
                error={errors.callToAction}
                required
                rows={3}
                placeholder="e.g. Visit our website to download our free CQC readiness checklist. Connect with me on LinkedIn. Book a free discovery call."
                hint="You will have the opportunity to direct listeners to a resource, website, or offer at the end of your interview."
              />
            </div>

            {/* How did you hear */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">How did you hear about Kajidori Collective Conversations? <span className="text-gray-400 font-normal">(optional)</span></label>
              <select
                name="heardAbout"
                value={form.heardAbout}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              >
                <option value="">Select one</option>
                <option value="linkedin">LinkedIn</option>
                <option value="referral">Referred by a colleague</option>
                <option value="email">Email from Yeukai</option>
                <option value="google">Google search</option>
                <option value="podcast">Heard the podcast</option>
                <option value="event">Met Yeukai at an event</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Selected package summary */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest mb-1">Selected Package</p>
                  <p className="text-lg font-bold text-blue-900">{selectedTierData?.name} — {selectedTierData?.price}</p>
                  <p className="text-xs text-blue-600 mt-1">You can change this before your final booking if approved.</p>
                </div>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-xs text-blue-700 underline font-semibold"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Terms */}
            <div data-error={!!errors.agreeTerms}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={form.agreeTerms}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 accent-blue-900 flex-shrink-0"
                />
                <span className="text-sm text-gray-600">
                  I confirm that I meet the qualification criteria above and that the information I have provided is accurate. I understand that submitting this form does not guarantee a guest spot, and that no payment will be taken until I am approved and choose to book.
                </span>
              </label>
              {errors.agreeTerms && <p className="text-red-500 text-xs mt-2 ml-7">{errors.agreeTerms}</p>}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-4 px-8 rounded-xl text-base transition-colors flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting your application…
                  </>
                ) : (
                  <>
                    Submit My Application
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">
                No payment required. We will review your application and respond within 24 hours.
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* About the host */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-yellow-500 font-semibold text-sm uppercase tracking-widest">Your Host</span>
              <h2 className="text-3xl font-bold text-blue-900 mt-2 mb-4">Yeukai Kajidori</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                CQC Registered Manager, MBA-qualified strategist, and Amazon bestselling author with over 20 years in UK health and social care. Since 2016, he has hosted the Yeukai Business Show — one of the UK's leading business podcasts — interviewing more than 584 global leaders.
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

      {/* Why apply */}
      <section className="py-16 px-4 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Why a guest appearance matters</h2>
          <p className="text-blue-200 mb-12 max-w-2xl mx-auto">
            A guest appearance on Kajidori Collective Conversations is more than a podcast interview. It is a positioning statement — a signal to your peers, your team, and the wider sector that you are a leader worth listening to.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🎙️', title: 'Reach a targeted audience', body: 'Your episode reaches registered managers, care group leaders, and commissioners across the UK who are actively looking for insight and inspiration.' },
              { icon: '🏆', title: 'Build your authority', body: 'Being featured on a sector podcast with 584+ episodes signals credibility. Use your episode link on LinkedIn, in bids, and in your professional bio.' },
              { icon: '🤝', title: "Connect with Yeukai's network", body: "Featured and Authority guests gain direct access to Yeukai's consulting and training network — opening doors to collaboration, referrals, and new opportunities." },
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
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left focus:outline-none"
                >
                  <span className="font-bold text-blue-900 text-sm">{faq.q}</span>
                  <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-4 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

// Reusable field components
function Field({ label, name, type = 'text', value, onChange, error, required, placeholder, hint }) {
  return (
    <div data-error={!!error}>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
      />
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

function TextArea({ label, name, value, onChange, error, required, rows = 4, placeholder, hint }) {
  return (
    <div data-error={!!error}>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-colors resize-none ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
      />
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
