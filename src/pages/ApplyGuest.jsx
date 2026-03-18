import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

// ─── Step definitions ──────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Your Details' },
  { id: 2, label: 'Your Bio' },
  { id: 3, label: 'How You Help' },
  { id: 4, label: 'Your Story' },
  { id: 5, label: 'Your Big Secret' },
  { id: 6, label: 'For Yeukai' },
  { id: 7, label: 'Contact & Social' },
  { id: 8, label: 'Agreement' },
  { id: 9, label: 'Profile Photo' },
]

const TIERS = [
  { id: 'expert', name: 'Expert Interview', price: 'Free', tagline: 'Share your story. No cost.' },
  { id: 'essential', name: 'The Essential', price: '£97', tagline: 'Build your profile in the sector.', badge: 'Best Value' },
  { id: 'featured', name: 'The Featured', price: '£197', tagline: 'Stand out as a sector leader.', badge: 'Most Popular', highlight: true },
  { id: 'authority', name: 'The Authority', price: '£397', tagline: 'The complete authority experience.', badge: 'Premium' },
]

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '', phone: '',
  jobTitle: '', organisation: '', tier: 'featured',
  bio: '', mediaFile: null,
  solutions: '',
  origin: '',
  bigSecret: '',
  anythingElse: '',
  website: '', linkedin: '', twitter: '', facebook: '', skype: '',
  agreePromotion: '',
  finalThoughts: '',
  heardAbout: '',
  profilePhoto: null,
  agreeTerms: false,
}

export default function ApplyGuest() {
  const [step, setStep] = useState(0) // 0 = landing / tier select
  const [currentStep, setCurrentStep] = useState(1)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const mediaFileRef = useRef(null)
  const photoRef = useRef(null)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleFileChange(e, field) {
    const file = e.target.files[0]
    if (file) {
      setForm(prev => ({ ...prev, [field]: file }))
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // ─── Validation per step ────────────────────────────────────────────────────
  function validateStep(s) {
    const e = {}
    if (s === 1) {
      if (!form.firstName.trim()) e.firstName = 'Required'
      if (!form.lastName.trim()) e.lastName = 'Required'
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
      if (!form.jobTitle.trim()) e.jobTitle = 'Required'
      if (!form.organisation.trim()) e.organisation = 'Required'
    }
    if (s === 2) {
      if (!form.bio.trim() || form.bio.trim().length < 50) e.bio = 'Please write at least 50 characters'
    }
    if (s === 3) {
      if (!form.solutions.trim() || form.solutions.trim().length < 30) e.solutions = 'Please describe at least one solution (min 30 characters)'
    }
    if (s === 4) {
      if (!form.origin.trim() || form.origin.trim().length < 30) e.origin = 'Please share your story (min 30 characters)'
    }
    if (s === 5) {
      if (!form.bigSecret.trim() || form.bigSecret.trim().length < 30) e.bigSecret = 'Please share your insight (min 30 characters)'
    }
    if (s === 8) {
      if (!form.agreePromotion) e.agreePromotion = 'Please select Yes or No'
      if (!form.agreeTerms) e.agreeTerms = 'You must agree to continue'
    }
    if (s === 9) {
      if (!form.profilePhoto) e.profilePhoto = 'Please upload a profile photo'
    }
    return e
  }

  function next() {
    const errs = validateStep(currentStep)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      handleFinalSubmit()
    }
  }

  function back() {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      setErrors({})
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setStep(0)
      setCurrentStep(1)
      setErrors({})
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  async function handleFinalSubmit() {
    const errs = validateStep(9)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1400))
    setSubmitting(false)
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const progress = Math.round((currentStep / STEPS.length) * 100)
  const selectedTier = TIERS.find(t => t.id === form.tier)

  // ─── Submitted confirmation ─────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="max-w-xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-3">Application Received!</h1>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Thank you, <strong>{form.firstName}</strong>. Your application for <strong>{selectedTier?.name}</strong> has been submitted successfully.
          </p>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Yeukai personally reviews every application to ensure a strong fit for the audience. You will hear back within <strong>24 hours</strong>. If approved, you will receive a direct booking link by email — no payment is taken until you schedule your session.
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-left mb-8">
            <h3 className="font-bold text-blue-900 mb-4 text-sm uppercase tracking-widest">What happens next</h3>
            <ol className="space-y-3">
              {[
                'Yeukai reviews your application (within 24 hours)',
                'You receive a personalised booking invitation by email',
                'You select your date and complete your booking',
                'You receive a pre-interview guide and your meeting link',
                'We record, produce, and publish your episode',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="w-6 h-6 rounded-full bg-yellow-400 text-blue-900 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
          <Link to="/" className="inline-block bg-blue-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  // ─── Landing / Tier selection ───────────────────────────────────────────────
  if (step === 0) {
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
              Join 584+ leaders who have shared their expertise on one of the UK's leading care sector podcasts. No payment is taken until you are approved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-200">
              {['No payment until approved', 'Response within 24 hours', 'Reviewed personally by Yeukai'].map(t => (
                <span key={t} className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* About the host */}
        <section className="py-16 px-4 bg-gray-50 border-b border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-yellow-500 font-semibold text-sm uppercase tracking-widest">Your Host</span>
              <h2 className="text-3xl font-bold text-blue-900 mt-2 mb-4">Yeukai Kajidori</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                CQC Registered Manager, MBA-qualified strategist, and Amazon bestselling author with over 20 years in UK health and social care. Since 2016, he has hosted the Yeukai Business Show — interviewing more than 584 global leaders.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Kajidori Collective Conversations is his dedicated platform for the care sector — a space where registered managers, care group CEOs, and commissioners share the real story behind outstanding care.
              </p>
              <div className="flex gap-8">
                {[['584+', 'Episodes recorded'], ['9', 'Years on air'], ['95+', 'Paying guests']].map(([n, l]) => (
                  <div key={l} className="text-center">
                    <div className="text-3xl font-extrabold text-blue-900">{n}</div>
                    <div className="text-xs text-gray-500 mt-1">{l}</div>
                  </div>
                ))}
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
        </section>

        {/* Tier selector */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Choose Your Package</h2>
              <p className="text-gray-500 text-sm max-w-xl mx-auto">Select the package you are applying for. You can change this before your final booking if approved.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {TIERS.map(tier => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, tier: tier.id }))}
                  className={`relative text-left rounded-2xl border-2 p-5 transition-all focus:outline-none ${
                    form.tier === tier.id
                      ? tier.highlight
                        ? 'border-yellow-400 shadow-lg ring-2 ring-yellow-400 ring-offset-2'
                        : 'border-blue-900 shadow-lg ring-2 ring-blue-900 ring-offset-2'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {tier.badge && (
                    <span className={`absolute -top-3 left-4 text-xs font-bold uppercase tracking-widest px-3 py-0.5 rounded-full ${
                      tier.highlight ? 'bg-yellow-400 text-blue-900' : 'bg-blue-900 text-white'
                    }`}>{tier.badge}</span>
                  )}
                  <div className="mt-2">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1">{tier.name}</p>
                    <p className="text-2xl font-extrabold text-blue-900 mb-1">{tier.price}</p>
                    <p className="text-xs text-gray-500">{tier.tagline}</p>
                  </div>
                  {form.tier === tier.id && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-900 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={() => { setStep(1); setCurrentStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 px-12 rounded-xl text-base transition-colors inline-flex items-center gap-3"
              >
                Start My Application
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <p className="text-xs text-gray-400 mt-3">Takes about 10 minutes · No payment required</p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // ─── Multi-step wizard ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Wizard header */}
      <div className="bg-blue-900 text-white px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-blue-300 uppercase tracking-widest font-semibold">Guest Application</p>
              <p className="font-bold text-sm mt-0.5">{STEPS[currentStep - 1]?.label}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-300">Step {currentStep} of {STEPS.length}</p>
              <p className="text-sm font-bold text-yellow-400">{selectedTier?.name} · {selectedTier?.price}</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-blue-800 rounded-full h-1.5">
            <div
              className="bg-yellow-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Step dots */}
          <div className="flex justify-between mt-2">
            {STEPS.map(s => (
              <div
                key={s.id}
                className={`w-2 h-2 rounded-full transition-all ${
                  s.id < currentStep ? 'bg-yellow-400' : s.id === currentStep ? 'bg-white' : 'bg-blue-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {/* Step 1 — Personal details */}
          {currentStep === 1 && (
            <StepShell
              title="Let's start with your details"
              subtitle="Tell us who you are and where you work."
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="First Name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} required />
                <Field label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} required />
                <Field label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required />
                <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} />
                <Field label="Job Title" name="jobTitle" value={form.jobTitle} onChange={handleChange} error={errors.jobTitle} required placeholder="e.g. Registered Manager, CEO" />
                <Field label="Organisation" name="organisation" value={form.organisation} onChange={handleChange} error={errors.organisation} required />
              </div>
              <div className="mt-5">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  How did you hear about us? <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <select
                  name="heardAbout"
                  value={form.heardAbout}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-900"
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
            </StepShell>
          )}

          {/* Step 2 — Bio */}
          {currentStep === 2 && (
            <StepShell
              title="Your expert bio"
              subtitle="Tell us your expert skill and what you do. If you have written a book, received awards, or have notable achievements — include it all here. Blow your own trumpet!"
            >
              <TextArea
                label="Your Professional Bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                error={errors.bio}
                required
                rows={7}
                placeholder="e.g. I am a CQC Registered Manager with 15 years' experience leading Outstanding-rated services. I am the author of [Book Title] and was named Care Manager of the Year 2023..."
                hint="This will be used to introduce you to our audience and in your episode show notes."
              />
              {/* Media kit upload */}
              <div className="mt-5">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Upload your Media Kit or CV <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div
                  onClick={() => mediaFileRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-blue-300 transition-colors"
                >
                  {form.mediaFile ? (
                    <div className="flex items-center justify-center gap-3 text-sm text-blue-900 font-semibold">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      {form.mediaFile.name}
                      <button type="button" onClick={e => { e.stopPropagation(); setForm(prev => ({ ...prev, mediaFile: null })) }} className="text-gray-400 hover:text-red-500 text-xs ml-2">Remove</button>
                    </div>
                  ) : (
                    <>
                      <svg className="w-7 h-7 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <p className="text-sm text-gray-500">Click to upload PDF, Word, or image</p>
                      <p className="text-xs text-gray-400 mt-1">Max 10MB</p>
                    </>
                  )}
                </div>
                <input ref={mediaFileRef} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={e => handleFileChange(e, 'mediaFile')} className="hidden" />
              </div>
            </StepShell>
          )}

          {/* Step 3 — Solutions */}
          {currentStep === 3 && (
            <StepShell
              title="How do you help people?"
              subtitle="Name up to 3 solutions you provide to care sector leaders. Do you have testimonials? Is your impact measurable? Really shine here — tell us why people prefer to work with you."
            >
              <TextArea
                label="Your Solutions & Impact"
                name="solutions"
                value={form.solutions}
                onChange={handleChange}
                error={errors.solutions}
                required
                rows={8}
                placeholder={`1. I help registered managers achieve Outstanding CQC ratings — 8 out of 10 of my clients have improved their rating within 12 months.\n\n2. I provide leadership coaching that reduces staff turnover — my clients report an average 30% reduction.\n\n3. "Working with [Name] transformed how our team approached person-centred care." — [Testimonial, Job Title]`}
              />
            </StepShell>
          )}

          {/* Step 4 — Origin story */}
          {currentStep === 4 && (
            <StepShell
              title="How did you get started?"
              subtitle="(a) What inspired you? (b) What obstacles did you have to overcome? Your story is what connects with our audience — be honest and specific."
            >
              <TextArea
                label="Your Origin Story"
                name="origin"
                value={form.origin}
                onChange={handleChange}
                error={errors.origin}
                required
                rows={8}
                placeholder="e.g. I became a registered manager after seeing a family member receive poor care. I was inspired to prove that compassionate, high-quality care was possible at scale. My biggest obstacle was..."
              />
            </StepShell>
          )}

          {/* Step 5 — Big secret */}
          {currentStep === 5 && (
            <StepShell
              title='Your big "How To" secret'
              subtitle='What is the one practical insight you want to reveal to our audience? Something care leaders can apply RIGHT NOW and see positive results — even if they are new to this approach.'
            >
              <TextArea
                label="Your Big Insight for Our Listeners"
                name="bigSecret"
                value={form.bigSecret}
                onChange={handleChange}
                error={errors.bigSecret}
                required
                rows={8}
                placeholder="e.g. The single most powerful thing a registered manager can do RIGHT NOW to improve their CQC rating is... Here is exactly how to do it in 3 steps..."
              />
            </StepShell>
          )}

          {/* Step 6 — Anything else for Yeukai */}
          {currentStep === 6 && (
            <StepShell
              title="Anything else for Yeukai?"
              subtitle="Is there anything you would like Yeukai to know about you before the show? Any context, sensitivities, or topics you would prefer to avoid?"
            >
              <TextArea
                label="Notes for Yeukai (optional)"
                name="anythingElse"
                value={form.anythingElse}
                onChange={handleChange}
                error={errors.anythingElse}
                rows={6}
                placeholder="Any context that would help Yeukai prepare the best possible interview for you..."
              />
              <div className="mt-5">
                <TextArea
                  label="Final thoughts or comments (optional)"
                  name="finalThoughts"
                  value={form.finalThoughts}
                  onChange={handleChange}
                  error={errors.finalThoughts}
                  rows={4}
                  placeholder="This is optional — share anything else that would help us understand your story..."
                />
              </div>
            </StepShell>
          )}

          {/* Step 7 — Social / contact */}
          {currentStep === 7 && (
            <StepShell
              title="How can our listeners get in touch with you?"
              subtitle="Complete this section if your uploaded media kit does not already include these details."
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Website URL" name="website" type="url" value={form.website} onChange={handleChange} error={errors.website} placeholder="https://yourwebsite.com" />
                <Field label="LinkedIn Profile" name="linkedin" type="url" value={form.linkedin} onChange={handleChange} error={errors.linkedin} placeholder="https://linkedin.com/in/..." />
                <Field label="Twitter / X Handle" name="twitter" value={form.twitter} onChange={handleChange} error={errors.twitter} placeholder="@yourhandle" />
                <Field label="Facebook Page" name="facebook" type="url" value={form.facebook} onChange={handleChange} error={errors.facebook} placeholder="https://facebook.com/..." />
                <Field label="Skype ID (optional)" name="skype" value={form.skype} onChange={handleChange} error={errors.skype} placeholder="your.skype.id" />
              </div>
            </StepShell>
          )}

          {/* Step 8 — Agreement */}
          {currentStep === 8 && (
            <StepShell
              title="Promotion agreement"
              subtitle="Almost done — please read and confirm the following."
            >
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Thank you for agreeing to be featured on Kajidori Collective Conversations. The podcast will be promoted online, offline, and in print. By participating in the show, you give us permission to promote the recordings through various mediums now and in all future promotions.
                </p>
              </div>
              <div data-error={!!errors.agreePromotion}>
                <p className="text-sm font-semibold text-gray-700 mb-3">Do you agree to this? <span className="text-red-500">*</span></p>
                <div className="flex gap-6 mb-1">
                  {['yes', 'no'].map(v => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="agreePromotion"
                        value={v}
                        checked={form.agreePromotion === v}
                        onChange={handleChange}
                        className="w-4 h-4 accent-blue-900"
                      />
                      <span className="text-sm font-semibold text-gray-700 capitalize">{v === 'yes' ? 'Yes, I agree' : 'No'}</span>
                    </label>
                  ))}
                </div>
                {errors.agreePromotion && <p className="text-red-500 text-xs mt-1">{errors.agreePromotion}</p>}
                {form.agreePromotion === 'no' && (
                  <p className="text-amber-600 text-xs mt-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    We are unable to proceed without promotional permission. Please contact us at <a href="mailto:yeukaibusinessshow@gmail.com" className="underline">yeukaibusinessshow@gmail.com</a> if you have specific concerns.
                  </p>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100" data-error={!!errors.agreeTerms}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={form.agreeTerms}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 accent-blue-900 flex-shrink-0"
                  />
                  <span className="text-sm text-gray-600">
                    I confirm that I meet the qualification criteria and that the information I have provided is accurate. I understand that submitting this form does not guarantee a guest spot, and that no payment will be taken until I am approved and choose to book.
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-red-500 text-xs mt-2 ml-7">{errors.agreeTerms}</p>}
              </div>
            </StepShell>
          )}

          {/* Step 9 — Profile photo */}
          {currentStep === 9 && (
            <StepShell
              title="Upload your profile photo"
              subtitle="Please upload a clear, professional headshot. This will be used in your episode artwork and on our website."
            >
              <div
                onClick={() => photoRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
                  errors.profilePhoto ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {form.profilePhoto ? (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={URL.createObjectURL(form.profilePhoto)}
                      alt="Profile preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400 shadow-md"
                    />
                    <p className="text-sm font-semibold text-blue-900">{form.profilePhoto.name}</p>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setForm(prev => ({ ...prev, profilePhoto: null })) }}
                      className="text-xs text-gray-400 hover:text-red-500 underline"
                    >
                      Remove and choose another
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Click to upload your headshot</p>
                    <p className="text-xs text-gray-400">JPG, PNG or WEBP · Max 5MB · Minimum 400×400px recommended</p>
                  </>
                )}
              </div>
              {errors.profilePhoto && <p className="text-red-500 text-xs mt-2">{errors.profilePhoto}</p>}
              <input ref={photoRef} type="file" accept="image/*" onChange={e => handleFileChange(e, 'profilePhoto')} className="hidden" />

              {/* Final summary */}
              <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-5">
                <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest mb-2">Your Application Summary</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Name</div>
                  <div className="font-semibold text-gray-800">{form.firstName} {form.lastName}</div>
                  <div className="text-gray-500">Organisation</div>
                  <div className="font-semibold text-gray-800">{form.organisation}</div>
                  <div className="text-gray-500">Package</div>
                  <div className="font-semibold text-gray-800">{selectedTier?.name} — {selectedTier?.price}</div>
                </div>
              </div>
            </StepShell>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={back}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-semibold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>

            <button
              type="button"
              onClick={currentStep === STEPS.length ? handleFinalSubmit : next}
              disabled={submitting}
              className="bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-3 px-8 rounded-xl text-sm transition-colors flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting…
                </>
              ) : currentStep === STEPS.length ? (
                <>
                  Submit Application
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              ) : (
                <>
                  Continue
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          No payment required · Reviewed personally by Yeukai · Response within 24 hours
        </p>
      </div>
    </div>
  )
}

// ─── Reusable components ────────────────────────────────────────────────────────
function StepShell({ title, subtitle, children }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-blue-900 mb-1">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mb-6 leading-relaxed">{subtitle}</p>}
      {children}
    </div>
  )
}

function Field({ label, name, type = 'text', value, onChange, error, required, placeholder }) {
  return (
    <div>
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

function TextArea({ label, name, value, onChange, error, required, rows = 5, placeholder, hint }) {
  return (
    <div>
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
