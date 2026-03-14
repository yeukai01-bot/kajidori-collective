import { Link } from 'react-router-dom'

export default function CaseStudies() {
  return (
    <div className="min-h-screen">
      <div className="bg-blue-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Case Studies</h1>
        <p className="text-blue-200 max-w-2xl mx-auto">Real outcomes from our work with health and social care organisations.</p>
      </div>
      <div className="max-w-5xl mx-auto py-16 px-4 grid md:grid-cols-2 gap-8">
        {[
          { org: 'Proactive Lifestyle Ltd', type: 'Mental Health Training', outcome: 'Delivered the Excellence Programme to 45 staff across 3 sites. 100% completion rate. CQC inspection passed with Outstanding in Well-led.', tag: 'Training' },
          { org: 'Community Care Provider', type: 'Strategic Consulting', outcome: 'Supported the organisation through a CQC Warning Notice. Developed a comprehensive action plan and achieved full compliance within 6 months.', tag: 'Consulting' },
          { org: 'Residential Care Group', type: 'Leadership Mentoring', outcome: 'Delivered the 10-week mentoring programme to 12 senior managers. All participants reported increased confidence and improved team performance.', tag: 'Mentoring' },
          { org: 'NHS Community Trust', type: 'Training & Consulting', outcome: 'Designed and delivered a bespoke complex needs training programme for 120 community health workers. Digital compliance records provided for CQC audit.', tag: 'Training' },
        ].map(c => (
          <div key={c.org} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">{c.tag}</span>
            <h3 className="text-xl font-bold text-blue-900 mt-4 mb-1">{c.org}</h3>
            <p className="text-yellow-600 text-sm font-medium mb-4">{c.type}</p>
            <p className="text-slate-600 text-sm leading-relaxed">{c.outcome}</p>
          </div>
        ))}
      </div>
      <div className="text-center pb-16">
        <Link to="/contact" className="bg-blue-900 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-800 transition-colors inline-block">
          Work With Us
        </Link>
      </div>
    </div>
  )
}
