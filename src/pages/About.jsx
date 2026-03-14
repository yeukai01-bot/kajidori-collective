import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="min-h-screen">
      <div className="bg-blue-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">About The Kajidori Collective</h1>
        <p className="text-blue-200 max-w-2xl mx-auto">Specialist consultants dedicated to improving outcomes in health and social care.</p>
      </div>
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Our Mission</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">The Kajidori Collective was founded with a clear purpose: to transform the quality of care delivered to people with mental health and complex needs across the UK. We work with health and social care organisations to build capacity, ensure compliance, and develop the leaders who make a difference every day.</p>
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Our Approach</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">We combine deep sector expertise with practical, evidence-based training and mentoring. Every programme we deliver is tailored to the specific context of the organisation, ensuring that learning translates directly into improved practice and better outcomes for service users.</p>
          <h2 className="text-2xl font-bold text-blue-900 mb-4">CQC Compliance</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">All our training programmes are designed to meet and exceed CQC requirements. Our digital portal provides the audit trail and compliance records that regulators expect, giving providers confidence during inspections.</p>
          <Link to="/contact" className="bg-blue-900 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-800 transition-colors inline-block">Work With Us</Link>
        </div>
      </div>
    </div>
  )
}
