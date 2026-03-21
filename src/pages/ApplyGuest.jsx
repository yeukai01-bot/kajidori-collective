import { Link } from 'react-router-dom'

export default function ApplyGuest() {
  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Header */}
      <div className="bg-[#0A1628] border-b border-[#C9A84C]/20 py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#C9A84C] text-sm font-semibold uppercase tracking-widest mb-2">
            Kajidori Collective Conversations
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Apply to Be a Guest
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Join our growing community of health and social care leaders sharing expertise, inspiring change, and building authority in the sector.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <span className="text-[#C9A84C]">✓</span> 584+ Episodes
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[#C9A84C]">✓</span> 95+ Paying Guests
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[#C9A84C]">✓</span> 4-Day Application Window
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[#C9A84C]">✓</span> No Payment Until Approved
            </span>
          </div>
        </div>
      </div>

      {/* Clustdoc Embed */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
          <iframe
            src="https://app.clustdoc.com/portal/105457292-fntipkkwlobfkpy8jkyrv9nre6j5kl?embedded=1"
            frameBorder="0"
            height="900"
            width="100%"
            title="KCC Guest Application Portal"
            style={{ display: 'block', minHeight: '900px' }}
          />
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Questions? <Link to="/contact" className="text-[#C9A84C] hover:underline">Contact us here</Link> or email{' '}
          <a href="mailto:yeukaibusinessshow@gmail.com" className="text-[#C9A84C] hover:underline">
            yeukaibusinessshow@gmail.com
          </a>
        </p>
      </div>
    </div>
  )
}
