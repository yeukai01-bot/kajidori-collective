import { useState } from 'react'

const GUMROAD_URL = 'https://kajidori.gumroad.com/l/reclaim-wellbeing'
const BOOKING_URL = 'https://tfft.io/DvNRyJs'

const GUIDE_DAYS = [
  { day: 'Day 1', title: 'Understanding What Burnout Actually Is', desc: 'Not tiredness. Not weakness. The real clinical picture — and why care workers are uniquely at risk.' },
  { day: 'Day 2', title: 'Your Body Has Been Trying to Tell You', desc: 'Recognising the physical signs of chronic stress before they become a crisis.' },
  { day: 'Day 3', title: 'Setting Boundaries Without Guilt', desc: 'A practical framework for saying no — at work and at home — without feeling like you are failing anyone.' },
  { day: 'Day 4', title: 'Reclaiming Sleep and Recovery', desc: 'Why care workers sleep badly, and the evidence-based changes that actually work on a shift pattern.' },
  { day: 'Day 5', title: 'Compassion Fatigue vs Burnout', desc: 'They are not the same thing. Understanding the difference changes what you do about it.' },
  { day: 'Day 6', title: 'Your Rights, Your Voice, Your Workplace', desc: 'What you are legally entitled to — and how to ask for it without fear.' },
  { day: 'Day 7', title: 'Building Your Personal Wellbeing Plan', desc: 'A simple, realistic plan you can actually stick to. Not a wellness app. Not a gym membership. Real life.' },
]

const TESTIMONIALS = [
  {
    quote: 'I read Day 3 on my lunch break and cried. Not because it was sad — because someone finally understood. I have already started using the boundary script with my manager.',
    name: 'Healthcare Assistant',
    location: 'Manchester',
  },
  {
    quote: 'I have been in care for 14 years. This is the first resource I have seen that actually speaks to me, not at me. Day 7 is worth the price alone.',
    name: 'Senior Support Worker',
    location: 'Bristol',
  },
  {
    quote: 'I shared Day 6 with three colleagues. We did not know half of what we were entitled to. We raised it with our manager and things have genuinely changed.',
    name: 'Domiciliary Carer',
    location: 'Leeds',
  },
]

export default function ReclaimWellbeing() {
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{ fontFamily: 'Georgia, serif', color: '#1a1a2e', minHeight: '100vh', background: '#fff' }}>

      {/* HERO */}
      <section style={{ background: '#0d1b4b', color: '#fff', padding: '64px 24px 56px', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p style={{ color: '#f5c518', fontFamily: 'sans-serif', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
            A 7-Day Mental Health Reset for Care Workers
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
            Reclaim Your Wellbeing
          </h1>
          <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', lineHeight: 1.7, color: '#d0d8f0', marginBottom: 32 }}>
            You give everything to the people in your care. This guide gives something back to you.
            Seven days. One honest, practical chapter a day. Written by someone who has spent 20 years
            in health and social care and knows exactly what you carry.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <a
              href={GUMROAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                display: 'inline-block',
                background: hovered ? '#d4a800' : '#f5c518',
                color: '#0d1b4b',
                fontFamily: 'sans-serif',
                fontWeight: 700,
                fontSize: 18,
                padding: '16px 40px',
                borderRadius: 4,
                textDecoration: 'none',
                transition: 'background 0.2s',
              }}
            >
              Get the Guide — £27
            </a>
            <p style={{ fontFamily: 'sans-serif', fontSize: 13, color: '#a0aec0', margin: 0 }}>
              Instant download. No subscription. No upsell.
            </p>
          </div>
        </div>
      </section>

      {/* EMPATHY SECTION */}
      <section style={{ padding: '56px 24px', maxWidth: 680, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 700, marginBottom: 20 }}>
          You are not struggling because you are weak.
        </h2>
        <p style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 16, color: '#2d3748' }}>
          You are struggling because the system was not designed with you in mind. Long shifts, emotional
          labour that never switches off, a culture that rewards self-sacrifice and calls it dedication.
          You were trained to care for everyone else. Nobody trained you to care for yourself.
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 16, color: '#2d3748' }}>
          This guide does not offer you bubble baths and mindfulness apps. It offers you the honest,
          practical tools that Yeukai Kajidori — a mental health consultant and former Registered Manager
          with over 20 years in health and social care — wishes someone had given him on his first day in care.
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: '#2d3748' }}>
          One chapter a day. Seven days. You will finish it feeling like yourself again.
        </p>
      </section>

      {/* WHAT YOU GET */}
      <section style={{ background: '#f7f9ff', padding: '56px 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>
            What is inside
          </h2>
          <p style={{ textAlign: 'center', color: '#4a5568', fontFamily: 'sans-serif', marginBottom: 40 }}>
            18 pages. No filler. Every word earned.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {GUIDE_DAYS.map(({ day, title, desc }) => (
              <div key={day} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', background: '#fff', borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                <div style={{ background: '#0d1b4b', color: '#f5c518', fontFamily: 'sans-serif', fontWeight: 700, fontSize: 12, padding: '6px 10px', borderRadius: 4, whiteSpace: 'nowrap', marginTop: 2 }}>
                  {day}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 16, margin: '0 0 6px' }}>{title}</p>
                  <p style={{ color: '#4a5568', fontFamily: 'sans-serif', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICE + CTA */}
      <section style={{ padding: '56px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <p style={{ fontFamily: 'sans-serif', fontSize: 13, color: '#718096', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
            One-time payment
          </p>
          <p style={{ fontSize: 52, fontWeight: 700, color: '#0d1b4b', margin: '0 0 8px' }}>£27</p>
          <p style={{ fontFamily: 'sans-serif', color: '#4a5568', marginBottom: 32, fontSize: 15 }}>
            Less than a shift's worth of overtime. A lifetime of knowing how to protect yourself.
          </p>
          <a
            href={GUMROAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: '#0d1b4b',
              color: '#f5c518',
              fontFamily: 'sans-serif',
              fontWeight: 700,
              fontSize: 18,
              padding: '16px 40px',
              borderRadius: 4,
              textDecoration: 'none',
            }}
          >
            Get Instant Access — £27
          </a>
          <p style={{ fontFamily: 'sans-serif', fontSize: 13, color: '#a0aec0', marginTop: 12 }}>
            Secure checkout via Gumroad. PDF delivered instantly.
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: '#0d1b4b', padding: '56px 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ color: '#fff', fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>
            What care workers are saying
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {TESTIMONIALS.map(({ quote, name, location }) => (
              <div key={name} style={{ background: 'rgba(255,255,255,0.06)', borderLeft: '3px solid #f5c518', padding: '20px 24px', borderRadius: 4 }}>
                <p style={{ color: '#e2e8f0', fontStyle: 'italic', fontSize: 16, lineHeight: 1.7, margin: '0 0 12px' }}>"{quote}"</p>
                <p style={{ color: '#f5c518', fontFamily: 'sans-serif', fontSize: 13, margin: 0 }}>— {name}, {location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT YEUKAI */}
      <section style={{ padding: '56px 24px', maxWidth: 680, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, marginBottom: 20 }}>
          About Yeukai Kajidori
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#2d3748', marginBottom: 16 }}>
          Yeukai Kajidori is a mental health consultant, podcast host, and former Registered Manager
          with over 20 years in health and social care. He created this guide because he has lived
          what you are living — and he knows that the people who care for others deserve to be cared for too.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#2d3748', marginBottom: 24 }}>
          He is also available for a free 20-minute Wellbeing Check-In — a personal conversation,
          not a sales call. If you want to talk before you buy, or instead of buying, that is fine too.
        </p>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            border: '2px solid #0d1b4b',
            color: '#0d1b4b',
            fontFamily: 'sans-serif',
            fontWeight: 600,
            fontSize: 15,
            padding: '12px 28px',
            borderRadius: 4,
            textDecoration: 'none',
          }}
        >
          Book a Free Wellbeing Check-In
        </a>
      </section>

      {/* FINAL CTA */}
      <section style={{ background: '#f5c518', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ color: '#0d1b4b', fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 700, marginBottom: 16 }}>
            You have given enough of yourself to everyone else.
          </h2>
          <p style={{ color: '#0d1b4b', fontFamily: 'sans-serif', fontSize: 16, marginBottom: 28 }}>
            Seven days. One honest guide. Start today.
          </p>
          <a
            href={GUMROAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: '#0d1b4b',
              color: '#f5c518',
              fontFamily: 'sans-serif',
              fontWeight: 700,
              fontSize: 18,
              padding: '16px 40px',
              borderRadius: 4,
              textDecoration: 'none',
            }}
          >
            Get the Guide — £27
          </a>
        </div>
      </section>

    </div>
  )
}
