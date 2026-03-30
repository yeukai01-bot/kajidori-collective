import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const TABS = [
  { id: 'consulting', label: 'Strategic Consulting', num: '01' },
  { id: 'training', label: 'Mental Health Training', num: '02' },
  { id: 'mentoring', label: 'Leadership Mentoring', num: '03' },
  { id: 'ai', label: 'AI Integration Workshop', num: '04', isNew: true },
]

const FIELDS = {
  consulting: [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
    { name: 'jobTitle', label: 'Job Title', type: 'text', required: true },
    { name: 'organisation', label: 'Organisation Name', type: 'text', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: false },
    { name: 'challenge', label: 'What is your main challenge or goal?', type: 'textarea', required: true },
  ],
  training: [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
    { name: 'jobTitle', label: 'Job Title', type: 'text', required: true },
    { name: 'organisation', label: 'Organisation Name', type: 'text', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: false },
    { name: 'staffCount', label: 'Approximate number of staff to be trained', type: 'number', required: true },
    { name: 'location', label: 'Location / Region', type: 'text', required: true },
    { name: 'message', label: 'Any additional information', type: 'textarea', required: false },
  ],
  mentoring: [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
    { name: 'jobTitle', label: 'Job Title / Role', type: 'text', required: true },
    { name: 'organisation', label: 'Organisation Name', type: 'text', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: false },
    { name: 'goals', label: 'What are your main development goals?', type: 'textarea', required: true },
    { name: 'experience', label: 'Years of experience in health and social care', type: 'number', required: false },
  ],
  ai: [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
    { name: 'jobTitle', label: 'Job Title', type: 'text', required: true },
    { name: 'organisation', label: 'Organisation Name', type: 'text', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: false },
    { name: 'staffCount', label: 'Approximate number of delegates', type: 'number', required: false },
    { name: 'aiWorkshop', label: 'Which workshop are you interested in?', type: 'select', required: true,
      options: [
        'AI for Care Documentation (Half Day — £1,600)',
        'Responsible AI in Social Care (Full Day — £2,400)',
        'AI for CQC Inspection Readiness (Full Day — £2,400)',
        'Not sure — I would like to discuss',
      ]
    },
    { name: 'message', label: 'Tell us about your organisation and what you hope to achieve', type: 'textarea', required: false },
  ],
}

export default function Contact() {
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('type') || 'consulting'
  const [tab, setTab] = useState(TABS.find(t => t.id === initialTab) ? initialTab : 'consulting')
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const t = searchParams.get('type')
    if (t && TABS.find(x => x.id === t)) setTab(t)
  }, [searchParams])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: dbError } = await supabase
        .from('enquiries_kajidori')
        .insert([{
          service_type: tab,
          full_name: form.fullName || '',
          email: form.email || '',
          phone: form.phone || null,
          organisation: form.organisation || null,
          role_title: form.jobTitle || null,
          message: form.challenge || form.goals || form.message || form.aiWorkshop || null,
          staff_count: form.staffCount ? String(form.staffCount) : null,
          status: 'new',
        }])
      if (dbError) console.warn('DB save failed:', dbError.message)
      setSuccess(true)
      setForm({})
    } catch (err) {
      setSuccess(true)
      setForm({})
    } finally {
      setLoading(false)
    }
  }

  const fields = FIELDS[tab]

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-12 text-center max-w-md shadow-sm border border-slate-100">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-3">Application Received!</h2>
          <p className="text-slate-600 mb-6">Thank you for your enquiry. A member of The Kajidori Collective team will be in touch within 2 business days.</p>
          <button onClick={() => setSuccess(false)} className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
            Submit Another Enquiry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-blue-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Work With Us</h1>
        <p className="text-blue-200 max-w-2xl mx-auto">Choose the service you are interested in and complete the application form below. We respond within one business day.</p>
      </div>

      <div className="max-w-2xl mx-auto py-12 px-4">
        {/* Tab switcher */}
        <div className="grid grid-cols-2 md:grid-cols-4 rounded-xl overflow-hidden border border-slate-200 mb-8 bg-white shadow-sm">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setForm({}) }}
              className={`py-3 px-2 text-sm font-medium transition-colors flex flex-col items-center gap-1 relative ${
                tab === t.id ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t.isNew && (
                <span className="absolute top-1 right-1 bg-yellow-400 text-blue-900 text-[9px] font-bold px-1 rounded-full leading-tight">NEW</span>
              )}
              <span className="text-xs font-bold opacity-50">{t.num}</span>
              <span className="text-xs leading-tight text-center">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-blue-900 mb-2">
            {TABS.find(t => t.id === tab)?.label} Enquiry
          </h2>
          {tab === 'ai' && (
            <p className="text-sm text-blue-600 bg-blue-50 rounded-lg px-4 py-2 mb-5">
              <strong>New for 2026.</strong> Be among the first care organisations to integrate AI responsibly — before your competitors.
            </p>
          )}

          {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={form[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    rows={4}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  />
                ) : field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={form[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select an option...</option>
                    {field.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-900 text-white py-4 rounded-lg font-bold text-sm hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
