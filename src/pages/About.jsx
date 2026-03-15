import { Link } from 'react-router-dom'

const credentials = [
  { icon: '🎓', title: 'MBA', body: 'Master of Business Administration — University of Central Lancashire' },
  { icon: '📋', title: 'Level 7 Health & Social Care', body: 'Level 7 Diploma in Health & Social Care Management' },
  { icon: '📊', title: 'Level 7 Strategic Management', body: 'Level 7 Diploma in Strategic Management & Leadership' },
  { icon: '🏥', title: 'CQC Registered Manager', body: 'Registered CQC Healthcare Operations Manager with 20+ years of sector experience' },
  { icon: '🎤', title: 'Train the Trainer', body: 'Qualified Social Care Train the Trainer — certified to train and assess others' },
  { icon: '📚', title: 'Published Author', body: 'Author of two books on leadership, including an Amazon international bestseller' },
]

const timeline = [
  { year: '2006', event: 'Began career in residential care, working directly with vulnerable young people at AME Green Children\'s Services.' },
  { year: '2011', event: 'Joined Home Angels Health Care Services as Financial Manager, then Operations Manager — a role held for eight years, delivering 3,000 weekly billable care hours and achieving Good CQC ratings twice.' },
  { year: '2015', event: 'Launched the Yeukai Business Show podcast — now globally ranked in the top 3% of all podcasts, with over 500 interviews with business leaders, entrepreneurs, and experts.' },
  { year: '2019', event: 'Led the CQC registration of MT Supported Living from scratch, achieving full compliance in the first audit. Joined Support Horizons CIC, achieving Tier 1 Preferred Provider status with zero AQA deficiencies.' },
  { year: '2022', event: 'Joined Proactive Life South as CQC Registered Healthcare Operations Manager — doubled revenue, opened five new facilities, and secured £2.5M+ in annual local authority contracts.' },
  { year: '2023', event: 'Founded The Kajidori Collective to bring specialist training, consulting, and mentoring to health and social care organisations across the UK.' },
]

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-blue-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">About Yeukai Kajidori</h1>
        <p className="text-blue-200 max-w-2xl mx-auto text-lg">20 years of health and social care leadership. Four Good CQC ratings. £2.5M+ in secured contracts. Now available to your organisation.</p>
      </div>

      {/* Intro */}
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="grid md:grid-cols-3 gap-10 items-start">
          <div className="md:col-span-2">
            <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-3">The Founder</p>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">From Frontline Care Worker to Strategic Transformation Expert</h2>
            <p className="text-slate-600 leading-relaxed mb-4">Yeukai Kajidori began his career working directly with vulnerable young people in residential care. Over the next two decades, he rose through every level of health and social care leadership — from Financial Manager to Operations Director to CQC Registered Healthcare Operations Manager — building an unbroken track record of compliance, growth, and cultural transformation.</p>
            <p className="text-slate-600 leading-relaxed mb-4">He has registered organisations with the CQC from scratch. He has turned Requires Improvement services into Good-rated ones. He has doubled revenue, opened new facilities, recruited and developed high-performing teams, and secured millions of pounds in local authority contracts. Every service he has led has been better for his involvement.</p>
            <p className="text-slate-600 leading-relaxed mb-6">The Kajidori Collective was founded to make that expertise available to organisations across the UK — through training, consulting, mentoring, and now AI integration workshops that prepare care providers for the next decade.</p>
            <Link to="/case-studies" className="inline-block bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors text-sm">
              View the Evidence — Case Studies →
            </Link>
          </div>
          <div className="bg-blue-900 rounded-2xl p-6 text-white">
            <h3 className="font-bold text-yellow-400 mb-4 text-sm uppercase tracking-wide">Qualifications</h3>
            <ul className="space-y-3">
              {credentials.map(c => (
                <li key={c.title} className="flex items-start gap-3">
                  <span className="text-xl">{c.icon}</span>
                  <div>
                    <div className="font-semibold text-sm">{c.title}</div>
                    <div className="text-blue-300 text-xs leading-snug">{c.body}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white py-16 px-4 border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-2 text-center">Career Journey</p>
          <h2 className="text-2xl font-bold text-blue-900 mb-10 text-center">20 Years of Building Excellence in Care</h2>
          <div className="relative border-l-2 border-yellow-400 pl-8 space-y-8">
            {timeline.map(t => (
              <div key={t.year} className="relative">
                <div className="absolute -left-[2.6rem] w-5 h-5 bg-yellow-400 rounded-full border-2 border-white shadow-sm" />
                <div className="text-xs font-bold text-yellow-600 mb-1">{t.year}</div>
                <p className="text-slate-600 text-sm leading-relaxed">{t.event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Books + Podcast */}
      <div className="max-w-4xl mx-auto py-16 px-4">
        <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-2 text-center">Beyond the Boardroom</p>
        <h2 className="text-2xl font-bold text-blue-900 mb-10 text-center">Author. Podcaster. Thought Leader.</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Books */}
          <div className="bg-blue-900 rounded-2xl p-8 text-white">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-yellow-400 mb-3">Published Author</h3>
            <p className="text-blue-200 text-sm leading-relaxed mb-4">Yeukai is the author of two books on leadership in health and social care:</p>
            <ul className="space-y-3 mb-4">
              <li className="text-sm">
                <span className="font-semibold text-white">8 Qualities for Great Leadership</span>
                <span className="text-blue-300"> — Amazon International Bestseller, co-authored with writers from 8 countries</span>
              </li>
              <li className="text-sm">
                <span className="font-semibold text-white">Shaping Tomorrow</span>
                <span className="text-blue-300"> — Leadership Strategies for UK Mental Health Services (available on Amazon)</span>
              </li>
            </ul>
            <a
              href="https://www.amazon.co.uk/s?k=yeukai+kajidori"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-300 transition-colors"
            >
              View on Amazon →
            </a>
          </div>

          {/* Podcast */}
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
            <div className="text-4xl mb-4">🎙️</div>
            <h3 className="text-xl font-bold text-blue-900 mb-3">Yeukai Business Show</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-2">A globally ranked podcast in the <strong>top 3% of all podcasts worldwide</strong>, featuring over 500 interviews with business leaders, entrepreneurs, and experts across leadership, operations, marketing, HR, and personal development.</p>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">Running since 2015, the show has built a global audience and an extraordinary network of business thinkers — all of which informs the practical, real-world approach Yeukai brings to every client engagement.</p>
            <a
              href="https://www.yeukaibusinessshow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors"
            >
              Listen to the Podcast →
            </a>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-900 text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-extrabold mb-4">Ready to Work With Someone Who Has Done It?</h2>
        <p className="text-blue-200 max-w-xl mx-auto mb-8">Not someone who teaches from a textbook — someone who has registered organisations with the CQC, doubled revenue, and built teams that deliver outstanding care. Book a discovery call and let's talk about what is possible for your organisation.</p>
        <Link to="/contact" className="bg-yellow-400 text-blue-900 px-10 py-4 rounded-xl font-bold text-base hover:bg-yellow-300 transition-colors inline-block">
          Book a Discovery Call
        </Link>
      </div>
    </div>
  )
}
