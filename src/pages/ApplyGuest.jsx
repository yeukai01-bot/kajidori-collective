import { useState, useRef } from 'react'
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
  'You have a genuine insight, lesson, or solution that would benefit care sector leaders.',
  'You are an authority in your field with a proven track record in UK health and social care.',
  'You are committed to helping the sector find better, more compassionate ways to serve people.',
]

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
    a: 'We review every application within 24 hours to ensure a strong fit for our audience. If approved, you will receive an email with a link to book your session. No payment is taken until you schedule your call.',
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
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const [mediaFile, setMediaFile] = useState(null)
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    organisation: '',
    // Q1
    bio: '',
    // Q2
    solutions: '',
    // Q3
    origin: '',
    // Q4
    bigSecret: '',
    // Q5
    anythingElse: '',
    // Q6 - contact / social
    website: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    skype: '',
    // Q7 - agreement
    agreePromotion: '',
    // Q8 - final thoughts
    finalThoughts: '',
    // How did you hear
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

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) setMediaFile(file)
  }

  function validate() {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.jobTitle.trim()) e.jobTitle = 'Required'
    if (!form.organisation.trim()) e.organisation = 'Required'
    if (!form.bio.trim() || form.bio.trim().length < 50) e.bio = 'Please write at least 50 characters'
    if (!form.solutions.trim() || form.solutions.trim().length < 30) e.solutions = 'Please describe at least one solution (minimum 30 characters)'
    if (!form.origin.trim() || form.origin.trim().length < 30) e.origin = 'Please share your story (minimum 30 characters)'
    if (!form.bigSecret.trim() || form.bigSecret.trim().length < 30) e.bigSecret = 'Please share your big insight (minimum 30 characters)'
    if (!form.agreePromotion) e.agreePromotion = 'Please select Yes or No'
    if (!form.agreeTerms) e.agreeTerms = 'You must agree to continue'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      setTimeout(() => {
        const firstErrEl = document.querySelector('[data-error="true"]')
        if (firstErrEl) firstErrEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
      return
    }
    setSubmitting(true)
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
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Application Received!</h1>
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
            {['No payment until approved', 'Response within 24 hours', 'Maximum 8 episodes per month'].map(t => (
              <span key={t} className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                {t}
              </span>
            ))}
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
            <p className="text-gray-500 text-sm">Takes about 10 minutes. No payment is required at this stage.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-10">

            {/* Personal details */}
            <div>
              <SectionHeading number="1" title="Your Details" />
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="First Name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} required />
                <Field label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} required />
                <Field label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required />
                <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} />
                <Field label="Job Title" name="jobTitle" value={form.jobTitle} onChange={handleChange} error={errors.jobTitle} required placeholder="e.g. Registered Manager, CEO, Operations Director" />
                <Field label="Organisation / Company" name="organisation" value={form.organisation} onChange={handleChange} error={errors.organisation} required />
              </div>
            </div>

            {/* Q1 - Bio */}
            <div>
              <SectionHeading number="2" title="Your Expert Bio" />
              <p className="text-xs text-gray-500 mb-4">
                Tell us your expert skill and what you do. If you have written a book, received awards, or have notable achievements — include it all here. <strong>Blow your own trumpet!</strong>
              </p>
              <TextArea
                label="Your Professional Bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                error={errors.bio}
                required
                rows={5}
                placeholder="e.g. I am a CQC Registered Manager with 15 years' experience leading Outstanding-rated services. I am the author of [Book Title] and was named Care Manager of the Year 2023 by [Organisation]..."
                hint="This will be used to introduce you to our audience and in your episode show notes."
              />
              {/* File upload */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Upload your Media Kit or CV <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-300 transition-colors"
                >
                  {mediaFile ? (
                    <div className="flex items-center justify-center gap-3 text-sm text-blue-900 font-semibold">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      {mediaFile.name}
                      <button type="button" onClick={e => { e.stopPropagation(); setMediaFile(null) }} className="text-gray-400 hover:text-red-500 text-xs ml-2">Remove</button>
                    </div>
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <p className="text-sm text-gray-500">Click to upload a PDF, Word document, or image</p>
                      <p className="text-xs text-gray-400 mt-1">Max 10MB — PDF, DOC, DOCX, JPG, PNG</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Q2 - Solutions */}
            <div>
              <SectionHeading number="3" title="How You Help People" />
              <p className="text-xs text-gray-500 mb-4">
                Name up to 3 solutions you provide to care sector leaders. How do you help people? Do you have testimonials? Is your impact measurable or quantifiable? <strong>Really shine here — tell us why people prefer to work with you.</strong>
              </p>
              <TextArea
                label="Your Solutions & Impact"
                name="solutions"
                value={form.solutions}
                onChange={handleChange}
                error={errors.solutions}
                required
                rows={6}
                placeholder={`1. I help registered managers achieve Outstanding CQC ratings — 8 out of 10 of my clients have improved their rating within 12 months.\n2. I provide leadership coaching that reduces staff turnover — my clients report an average 30% reduction in turnover.\n3. "Working with [Name] transformed how our team approached person-centred care." — [Testimonial, Job Title]`}
              />
            </div>

            {/* Q3 - Origin story */}
            <div>
              <SectionHeading number="4" title="Your Story" />
              <p className="text-xs text-gray-500 mb-4">
                How did you get started? (a) What inspired you? (b) What obstacles did you have to overcome?
              </p>
              <TextArea
                label="Your Origin Story"
                name="origin"
                value={form.origin}
                onChange={handleChange}
                error={errors.origin}
                required
                rows={5}
                placeholder="e.g. I became a registered manager after seeing a family member receive poor care. I was inspired to prove that compassionate, high-quality care was possible at scale. My biggest obstacle was..."
              />
            </div>

            {/* Q4 - Big secret */}
            <div>
              <SectionHeading number="5" title='Your Big "How To" Secret' />
              <p className="text-xs text-gray-500 mb-4">
                What is the great BIG "How To" secret you want to reveal to our audience about your area of expertise? Something practical that care leaders can apply right now and see positive results — even if they are new to this approach.
              </p>
              <TextArea
                label="Your Big Insight for Our Listeners"
                name="bigSecret"
                value={form.bigSecret}
                onChange={handleChange}
                error={errors.bigSecret}
                required
                rows={5}
                placeholder="e.g. The single most powerful thing a registered manager can do RIGHT NOW to improve their CQC rating is... Here is exactly how to do it in 3 steps..."
              />
            </div>

            {/* Q5 - Anything else for Yeukai */}
            <div>
              <SectionHeading number="6" title="Anything Else for Yeukai?" />
              <TextArea
                label="Is there anything else you would like Yeukai to know about you before the show?"
                name="anythingElse"
                value={form.anythingElse}
                onChange={handleChange}
                error={errors.anythingElse}
                rows={4}
                placeholder="Any context, sensitivities, preferred topics to avoid, or anything that would help Yeukai prepare the best possible interview for you..."
              />
            </div>

            {/* Q6 - Social / contact details */}
            <div>
              <SectionHeading number="7" title="How Can Our Listeners Get in Touch With You?" />
              <p className="text-xs text-gray-500 mb-5">
                Complete this section if your uploaded media kit does not already include these details.
              </p>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Website URL" name="website" type="url" value={form.website} onChange={handleChange} error={errors.website} placeholder="https://yourwebsite.com" />
                <Field label="LinkedIn Profile" name="linkedin" type="url" value={form.linkedin} onChange={handleChange} error={errors.linkedin} placeholder="https://linkedin.com/in/..." />
                <Field label="Twitter / X Handle" name="twitter" value={form.twitter} onChange={handleChange} error={errors.twitter} placeholder="@yourhandle" />
                <Field label="Facebook Page" name="facebook" type="url" value={form.facebook} onChange={handleChange} error={errors.facebook} placeholder="https://facebook.com/..." />
                <Field label="Skype ID (optional)" name="skype" value={form.skype} onChange={handleChange} error={errors.skype} placeholder="your.skype.id" />
              </div>
            </div>

            {/* Q7 - Promotion agreement */}
            <div data-error={!!errors.agreePromotion}>
              <SectionHeading number="8" title="Promotion Agreement" />
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Thank you for agreeing to be featured on Kajidori Collective Conversations. The podcast will be promoted online, offline, and in print. By participating in the show, you give us permission to promote the recordings through various mediums now and in all future promotions.
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Do you agree? <span className="text-red-500">*</span></p>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="agreePromotion"
                    value="yes"
                    checked={form.agreePromotion === 'yes'}
                    onChange={handleChange}
                    className="w-4 h-4 accent-blue-900"
                  />
                  <span className="text-sm font-semibold text-gray-700">Yes, I agree</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="agreePromotion"
                    value="no"
                    checked={form.agreePromotion === 'no'}
                    onChange={handleChange}
                    className="w-4 h-4 accent-blue-900"
                  />
                  <span className="text-sm font-semibold text-gray-700">No</span>
                </label>
              </div>
              {errors.agreePromotion && <p className="text-red-500 text-xs mt-2">{errors.agreePromotion}</p>}
              {form.agreePromotion === 'no' && (
                <p className="text-amber-600 text-xs mt-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  Please note: we are unable to proceed with guest appearances without promotional permission. If you have specific concerns, please contact us at <a href="mailto:yeukaibusinessshow@gmail.com" className="underline">yeukaibusinessshow@gmail.com</a> before submitting.
                </p>
              )}
            </div>

            {/* Q8 - Final thoughts */}
            <div>
              <SectionHeading number="9" title="Final Thoughts" />
              <TextArea
                label="Do you have any final thoughts or comments? Is there anything else you would like to add?"
                name="finalThoughts"
                value={form.finalThoughts}
                onChange={handleChange}
                error={errors.finalThoughts}
                rows={4}
                placeholder="This is optional — share anything else that would help us understand your story or prepare for your interview..."
              />
            </div>

            {/* How did you hear */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                How did you hear about Kajidori Collective Conversations? <span className="text-gray-400 font-normal">(optional)</span>
              </label>
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

// Reusable components
function SectionHeading({ number, title }) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
      <span className="w-7 h-7 rounded-full bg-yellow-400 text-blue-900 font-bold text-sm flex items-center justify-center flex-shrink-0">{number}</span>
      <h3 className="text-sm font-bold text-blue-900 uppercase tracking-widest">{title}</h3>
    </div>
  )
}

function Field({ label, name, type = 'text', value, onChange, error, required, placeholder }) {
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
