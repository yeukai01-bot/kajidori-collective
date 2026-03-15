import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase, TABLES } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const SIGNATURE_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663231528991/fQjbWeyyGjvK6u3XAvmsuB/Yeukai'sSignature_32a522d5.png"

// SVG guilloche wave pattern — rendered as inline SVG background
function GuillocheSVG() {
  const lines = []
  for (let i = 0; i < 18; i++) {
    const y = 10 + i * 12
    lines.push(
      `<path d="M0,${y} C50,${y - 8} 100,${y + 8} 150,${y} C200,${y - 8} 250,${y + 8} 300,${y} C350,${y - 8} 400,${y + 8} 450,${y} C500,${y - 8} 550,${y + 8} 600,${y} C650,${y - 8} 700,${y + 8} 750,${y} C800,${y - 8} 850,${y + 8} 900,${y}" stroke="rgba(30,58,95,0.07)" stroke-width="0.8" fill="none"/>`
    )
  }
  const svgContent = `<svg xmlns='http://www.w3.org/2000/svg' width='900' height='230'>${lines.join('')}</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`
}

// Radial guilloche for centre watermark
function WatermarkSVG() {
  const spokes = []
  for (let i = 0; i < 36; i++) {
    const angle = (i * 10 * Math.PI) / 180
    const x1 = 100 + 20 * Math.cos(angle)
    const y1 = 100 + 20 * Math.sin(angle)
    const x2 = 100 + 90 * Math.cos(angle)
    const y2 = 100 + 90 * Math.sin(angle)
    spokes.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(30,58,95,0.06)" stroke-width="0.6"/>`)
  }
  const circles = [30, 50, 70, 90].map(r =>
    `<circle cx="100" cy="100" r="${r}" stroke="rgba(30,58,95,0.05)" stroke-width="0.6" fill="none"/>`
  )
  const svgContent = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>${spokes.join('')}${circles.join('')}</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`
}

export default function CertificatePrint() {
  const { certId } = useParams()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [cert, setCert] = useState(null)
  const [programme, setProgramme] = useState(null)
  const [recipientProfile, setRecipientProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) loadCert()
  }, [user, certId])

  const loadCert = async () => {
    const { data: c, error: cErr } = await supabase
      .from(TABLES.CERTIFICATES)
      .select('*')
      .eq('id', certId)
      .single()

    if (cErr || !c) {
      setError('Certificate not found.')
      setLoading(false)
      return
    }

    const isOwner = c.user_id === user.id
    const isAdmin = profile?.role === 'admin'
    const isManager = profile?.role === 'manager'

    if (!isOwner && !isAdmin && !isManager) {
      setError('You do not have permission to view this certificate.')
      setLoading(false)
      return
    }

    setCert(c)

    if (c.programme_id) {
      const { data: p } = await supabase
        .from(TABLES.PROGRAMMES)
        .select('name, description')
        .eq('id', c.programme_id)
        .single()
      setProgramme(p)
    }

    const { data: rp } = await supabase
      .from(TABLES.USERS)
      .select('first_name, last_name, email, organisation_id')
      .eq('id', c.user_id)
      .single()
    setRecipientProfile(rp)

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-500 text-sm">Loading certificate...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl p-10 shadow-sm border border-slate-100 max-w-sm">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="font-bold text-slate-800 mb-2">Certificate Unavailable</h2>
          <p className="text-slate-500 text-sm mb-6">{error}</p>
          <button onClick={() => navigate(-1)}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">
            ← Go Back
          </button>
        </div>
      </div>
    )
  }

  const recipientName = recipientProfile
    ? [recipientProfile.first_name, recipientProfile.last_name].filter(Boolean).join(' ') || recipientProfile.email
    : user?.email || ''

  const issueDate = cert?.issue_date
    ? new Date(cert.issue_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  // Annual renewal: exactly 1 year after issue date
  const renewalDate = cert?.issue_date
    ? (() => {
        const d = new Date(cert.issue_date)
        d.setFullYear(d.getFullYear() + 1)
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      })()
    : ''

  const programmeName = programme?.name || 'Compliance to Excellence'
  const refNumber = cert?.reference_number || `KC-${cert?.id?.toString().slice(0, 8).toUpperCase() || '0001'}`

  const guillocheBg = GuillocheSVG()
  const watermarkBg = WatermarkSVG()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap');

        * { box-sizing: border-box; }

        @media print {
          body { margin: 0; background: white; }
          .no-print { display: none !important; }
          .cert-outer {
            width: 297mm !important;
            min-height: 210mm !important;
            box-shadow: none !important;
            margin: 0 !important;
          }
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }

        .microtext-border {
          font-size: 5px;
          letter-spacing: 1.5px;
          color: rgba(30,58,95,0.35);
          font-family: Arial, sans-serif;
          white-space: nowrap;
          overflow: hidden;
          line-height: 1.6;
          user-select: none;
        }
      `}</style>

      {/* Toolbar */}
      <div className="no-print bg-slate-900 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="text-slate-300 hover:text-white text-sm transition-colors flex items-center gap-1">
            ← Back
          </button>
          <span className="text-slate-600">|</span>
          <span className="text-sm text-slate-400">Certificate Preview — {refNumber}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden md:block">
            In print dialog → set Destination to <strong className="text-slate-300">Save as PDF</strong> → A4 Landscape
          </span>
          <button
            onClick={() => window.print()}
            className="bg-yellow-400 text-slate-900 px-5 py-2 rounded-lg text-sm font-bold hover:bg-yellow-300 transition-colors">
            🖨️ Download / Print PDF
          </button>
        </div>
      </div>

      {/* Page wrapper */}
      <div style={{ background: '#d1d5db', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>

        {/* ═══════════════════════════════════════════════════
            CERTIFICATE — A4 Landscape (297mm × 210mm)
            Security layers (bottom to top):
            1. Guilloche wave background
            2. Radial watermark centre
            3. Microtext border strips (top + bottom)
            4. Double border frame (navy + gold)
            5. Corner rosettes
            6. Content
        ═══════════════════════════════════════════════════ */}
        <div
          className="cert-outer"
          style={{
            width: '297mm',
            minHeight: '210mm',
            maxWidth: '100%',
            position: 'relative',
            background: '#ffffff',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            overflow: 'hidden',
            fontFamily: "'EB Garamond', Georgia, serif",
          }}>

          {/* ── SECURITY LAYER 1: Guilloche wave background ── */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url("${guillocheBg}")`,
            backgroundRepeat: 'repeat-y',
            backgroundSize: '100% auto',
            opacity: 1,
            zIndex: 0,
          }} />

          {/* ── SECURITY LAYER 2: Radial watermark centre ── */}
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '180mm', height: '180mm',
            backgroundImage: `url("${watermarkBg}")`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            opacity: 1,
            zIndex: 0,
          }} />

          {/* ── SECURITY LAYER 3a: Microtext strip — TOP ── */}
          <div style={{
            position: 'absolute', top: '6mm', left: '14mm', right: '14mm',
            zIndex: 2, overflow: 'hidden', height: '5mm',
          }}>
            {[0,1,2].map(i => (
              <div key={i} className="microtext-border">
                {'THE KAJIDORI COLLECTIVE · COMPLIANCE TO EXCELLENCE · CQC CERTIFIED TRAINING · VALID FOR 12 MONTHS · KAJIDORI.CO.UK · '.repeat(8)}
              </div>
            ))}
          </div>

          {/* ── SECURITY LAYER 3b: Microtext strip — BOTTOM ── */}
          <div style={{
            position: 'absolute', bottom: '6mm', left: '14mm', right: '14mm',
            zIndex: 2, overflow: 'hidden', height: '5mm',
          }}>
            {[0,1,2].map(i => (
              <div key={i} className="microtext-border">
                {'AUTHORISED BY YEUKAI KAJIDORI · THE KAJIDORI COLLECTIVE · REF: ' + refNumber + ' · ANNUAL RENEWAL REQUIRED · NOT VALID AFTER: ' + renewalDate + ' · '}
              </div>
            ))}
          </div>

          {/* ── SECURITY LAYER 4: Outer navy border ── */}
          <div style={{
            position: 'absolute', inset: '12mm',
            border: '2.5px solid #1e3a5f',
            zIndex: 3, pointerEvents: 'none',
          }} />
          {/* Inner gold border */}
          <div style={{
            position: 'absolute', inset: '15mm',
            border: '1px solid #c9a227',
            zIndex: 3, pointerEvents: 'none',
          }} />
          {/* Thin navy inner */}
          <div style={{
            position: 'absolute', inset: '17mm',
            border: '0.5px solid rgba(30,58,95,0.3)',
            zIndex: 3, pointerEvents: 'none',
          }} />

          {/* ── SECURITY LAYER 5: Corner rosettes ── */}
          {[
            { top: '9mm', left: '9mm' },
            { top: '9mm', right: '9mm' },
            { bottom: '9mm', left: '9mm' },
            { bottom: '9mm', right: '9mm' },
          ].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute', ...pos,
              width: '8mm', height: '8mm',
              zIndex: 4, pointerEvents: 'none',
            }}>
              <svg viewBox="0 0 32 32" width="100%" height="100%">
                <circle cx="16" cy="16" r="14" stroke="#1e3a5f" strokeWidth="1.5" fill="none"/>
                <circle cx="16" cy="16" r="10" stroke="#c9a227" strokeWidth="0.8" fill="none"/>
                <circle cx="16" cy="16" r="3" fill="#1e3a5f"/>
                {[0,45,90,135,180,225,270,315].map(a => {
                  const rad = (a * Math.PI) / 180
                  return <line key={a}
                    x1={16 + 5 * Math.cos(rad)} y1={16 + 5 * Math.sin(rad)}
                    x2={16 + 12 * Math.cos(rad)} y2={16 + 12 * Math.sin(rad)}
                    stroke="#1e3a5f" strokeWidth="0.8"/>
                })}
              </svg>
            </div>
          ))}

          {/* ── CONTENT (z-index 5+) ── */}
          <div style={{
            position: 'relative', zIndex: 5,
            padding: '22mm 24mm 18mm',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            textAlign: 'center',
            minHeight: '210mm',
            boxSizing: 'border-box',
          }}>

            {/* Logo + org name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4mm' }}>
              <div style={{
                width: '13mm', height: '13mm', borderRadius: '50%',
                background: '#1e3a5f', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#c9a227', fontWeight: 'bold', fontSize: '17px', fontFamily: "'Cinzel', serif" }}>K</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: '#1e3a5f', fontWeight: '700', fontSize: '15px', fontFamily: "'Cinzel', serif", lineHeight: 1.2 }}>
                  The Kajidori Collective
                </div>
                <div style={{ color: '#64748b', fontSize: '9px', fontFamily: 'Arial, sans-serif', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  Learning &amp; Compliance Portal
                </div>
              </div>
            </div>

            {/* Ornamental divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4mm', width: '100%', maxWidth: '180mm' }}>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #c9a227)' }} />
              <div style={{ color: '#c9a227', fontSize: '14px' }}>✦</div>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #c9a227, transparent)' }} />
            </div>

            {/* Certificate of Completion heading */}
            <div style={{
              fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase',
              color: '#64748b', fontFamily: 'Arial, sans-serif', marginBottom: '3mm',
            }}>
              Certificate of Completion
            </div>

            {/* "This is to certify that" */}
            <div style={{ fontSize: '13px', color: '#475569', marginBottom: '2mm', fontStyle: 'italic' }}>
              This is to certify that
            </div>

            {/* Recipient name */}
            <div style={{
              fontSize: '30px', fontWeight: '700', color: '#1e3a5f',
              fontFamily: "'Cinzel', serif",
              marginBottom: '3mm', lineHeight: 1.2,
              textShadow: '0 1px 2px rgba(0,0,0,0.08)',
            }}>
              {recipientName}
            </div>

            {/* "has successfully completed" */}
            <div style={{ fontSize: '13px', color: '#475569', marginBottom: '2mm', fontStyle: 'italic' }}>
              has successfully completed the
            </div>

            {/* Programme name */}
            <div style={{
              fontSize: '18px', fontWeight: '600', color: '#1e3a5f',
              fontFamily: "'Cinzel', serif",
              marginBottom: '2mm',
            }}>
              {programmeName}
            </div>

            {/* Sub-description */}
            <div style={{
              fontSize: '10.5px', color: '#64748b', fontFamily: 'Arial, sans-serif',
              marginBottom: '4mm', maxWidth: '160mm', lineHeight: 1.6,
            }}>
              including the Full-Day Workshop Programme and 10-Week Workplace Mentoring &amp; Coaching Programme
              in accordance with CQC Compliance Standards for Health &amp; Social Care
            </div>

            {/* Ornamental divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5mm', width: '100%', maxWidth: '180mm' }}>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #1e3a5f)' }} />
              <div style={{ color: '#1e3a5f', fontSize: '10px' }}>◆</div>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #1e3a5f, transparent)' }} />
            </div>

            {/* Data row: issue date | ref | renewal | issued by */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: '6mm', width: '100%', maxWidth: '220mm',
              marginBottom: '6mm',
            }}>
              {[
                { label: 'Date of Issue', value: issueDate },
                { label: 'Certificate Reference', value: refNumber },
                { label: 'Renewal Due By', value: renewalDate, highlight: true },
                { label: 'Issued By', value: 'Kajidori Collective' },
              ].map(item => (
                <div key={item.label} style={{
                  textAlign: 'center',
                  padding: '3mm 2mm',
                  background: item.highlight ? 'rgba(201,162,39,0.08)' : 'transparent',
                  border: item.highlight ? '0.5px solid rgba(201,162,39,0.4)' : 'none',
                  borderRadius: '2mm',
                }}>
                  <div style={{
                    fontSize: '7px', letterSpacing: '2px', textTransform: 'uppercase',
                    color: item.highlight ? '#92400e' : '#94a3b8',
                    fontFamily: 'Arial, sans-serif', marginBottom: '1.5mm',
                  }}>
                    {item.label}
                  </div>
                  <div style={{
                    fontSize: '11px', fontWeight: '600',
                    color: item.highlight ? '#92400e' : '#1e3a5f',
                    fontFamily: item.highlight ? 'Arial, sans-serif' : "'EB Garamond', Georgia, serif",
                  }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Signature row */}
            <div style={{
              display: 'flex', gap: '20mm', justifyContent: 'center',
              marginBottom: '4mm', alignItems: 'flex-end',
            }}>
              {/* Authorised signature — Yeukai's digital signature */}
              <div style={{ textAlign: 'center', width: '60mm' }}>
                <img
                  src={SIGNATURE_URL}
                  alt="Yeukai Kajidori — Authorised Signature"
                  crossOrigin="anonymous"
                  style={{
                    height: '16mm',
                    maxWidth: '58mm',
                    objectFit: 'contain',
                    display: 'block',
                    margin: '0 auto 1mm',
                    filter: 'contrast(1.1)',
                  }}
                  onError={(e) => {
                    // Fallback: show italic name if image fails
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'block'
                  }}
                />
                <div style={{ display: 'none', fontSize: '15px', fontStyle: 'italic', color: '#1e3a5f', marginBottom: '1mm', fontFamily: "'EB Garamond', Georgia, serif" }}>
                  Yeukai Kajidori
                </div>
                <div style={{ borderTop: '1px solid #94a3b8', paddingTop: '1.5mm' }}>
                  <div style={{ fontSize: '8px', color: '#64748b', fontFamily: 'Arial, sans-serif', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                    Yeukai Kajidori
                  </div>
                  <div style={{ fontSize: '7px', color: '#94a3b8', fontFamily: 'Arial, sans-serif', letterSpacing: '1px' }}>
                    Founder, The Kajidori Collective
                  </div>
                </div>
              </div>

              {/* Participant signature — blank */}
              <div style={{ textAlign: 'center', width: '60mm' }}>
                <div style={{ height: '16mm', marginBottom: '1mm' }} />
                <div style={{ borderTop: '1px solid #94a3b8', paddingTop: '1.5mm' }}>
                  <div style={{ fontSize: '8px', color: '#64748b', fontFamily: 'Arial, sans-serif', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                    Participant Signature
                  </div>
                  <div style={{ fontSize: '7px', color: '#94a3b8', fontFamily: 'Arial, sans-serif', letterSpacing: '1px' }}>
                    {recipientName}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer security note */}
            <div style={{
              fontSize: '8px', color: '#94a3b8', fontFamily: 'Arial, sans-serif',
              maxWidth: '200mm', lineHeight: 1.6, textAlign: 'center',
            }}>
              This certificate is issued in accordance with CQC compliance standards and serves as valid evidence of training completion.
              It may be retained in the employee's personnel file or submitted to regulatory bodies as required.
              <strong style={{ color: '#92400e' }}> This certificate must be renewed annually. Renewal due: {renewalDate}.</strong>
              &nbsp;Verify authenticity at kajidori.co.uk · Ref: {refNumber}
            </div>

          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            BACK PAGE — Module Breakdown & Regulatory Refs
        ═══════════════════════════════════════════════════ */}
        <div
          style={{
            width: '297mm',
            minHeight: '210mm',
            maxWidth: '100%',
            position: 'relative',
            background: '#ffffff',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            overflow: 'hidden',
            fontFamily: "'EB Garamond', Georgia, serif",
            marginTop: '20px',
          }}>

          {/* Guilloche background */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url("${guillocheBg}")`,
            backgroundRepeat: 'repeat-y',
            backgroundSize: '100% auto',
            zIndex: 0,
          }} />

          {/* Outer navy border */}
          <div style={{ position: 'absolute', inset: '12mm', border: '2.5px solid #1e3a5f', zIndex: 3, pointerEvents: 'none' }} />
          {/* Gold inner border */}
          <div style={{ position: 'absolute', inset: '15mm', border: '1px solid #c9a227', zIndex: 3, pointerEvents: 'none' }} />

          {/* Corner rosettes */}
          {[
            { top: '9mm', left: '9mm' },
            { top: '9mm', right: '9mm' },
            { bottom: '9mm', left: '9mm' },
            { bottom: '9mm', right: '9mm' },
          ].map((pos, i) => (
            <div key={i} style={{ position: 'absolute', ...pos, width: '8mm', height: '8mm', zIndex: 4, pointerEvents: 'none' }}>
              <svg viewBox="0 0 32 32" width="100%" height="100%">
                <circle cx="16" cy="16" r="14" stroke="#1e3a5f" strokeWidth="1.5" fill="none"/>
                <circle cx="16" cy="16" r="10" stroke="#c9a227" strokeWidth="0.8" fill="none"/>
                <circle cx="16" cy="16" r="3" fill="#1e3a5f"/>
                {[0,45,90,135,180,225,270,315].map(a => {
                  const rad = (a * Math.PI) / 180
                  return <line key={a}
                    x1={16 + 5 * Math.cos(rad)} y1={16 + 5 * Math.sin(rad)}
                    x2={16 + 12 * Math.cos(rad)} y2={16 + 12 * Math.sin(rad)}
                    stroke="#1e3a5f" strokeWidth="0.8"/>
                })}
              </svg>
            </div>
          ))}

          {/* Back page content */}
          <div style={{
            position: 'relative', zIndex: 5,
            padding: '22mm 24mm 18mm',
            minHeight: '210mm',
            boxSizing: 'border-box',
          }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '5mm' }}>
              <div style={{ fontSize: '8px', letterSpacing: '4px', textTransform: 'uppercase', color: '#94a3b8', fontFamily: 'Arial, sans-serif', marginBottom: '2mm' }}>
                Certificate Ref: {refNumber} &nbsp;·&nbsp; {recipientName}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e3a5f', fontFamily: "'Cinzel', serif", marginBottom: '1.5mm' }}>
                Programme Content &amp; Regulatory Framework
              </div>
              <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'Arial, sans-serif', fontStyle: 'italic' }}>
                Compliance to Excellence — Full-Day Workshop Programme
              </div>
              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3mm' }}>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #c9a227)' }} />
                <div style={{ color: '#c9a227', fontSize: '12px' }}>✦</div>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #c9a227, transparent)' }} />
              </div>
            </div>

            {/* Module table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px', fontFamily: 'Arial, sans-serif' }}>
              <thead>
                <tr style={{ background: '#1e3a5f' }}>
                  <th style={{ padding: '3mm 3mm', color: '#c9a227', textAlign: 'left', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', width: '6%' }}>#</th>
                  <th style={{ padding: '3mm 3mm', color: '#c9a227', textAlign: 'left', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', width: '32%' }}>Module Title</th>
                  <th style={{ padding: '3mm 3mm', color: '#c9a227', textAlign: 'left', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', width: '62%' }}>Regulatory &amp; CQC References</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    num: '1',
                    title: 'What Is Mental Health?',
                    duration: '60 min',
                    core: true,
                    refs: [
                      'CQC Key Question: Caring (KLOEs C1, C2)',
                      'Mental Health Act 1983 (amended 2007) — Principles of care and treatment',
                      'NHS Long Term Plan 2019 — Mental health workforce standards',
                      'NICE Guideline NG222 — Mental health in adults: service user experience',
                      'Health & Social Care Act 2008 (Regulated Activities) Regulations 2014 — Reg. 9 (Person-centred care)',
                    ],
                  },
                  {
                    num: '2',
                    title: 'The Conditions We Work With',
                    duration: '75 min',
                    core: true,
                    refs: [
                      'CQC Key Question: Effective (KLOEs E1, E2)',
                      'NICE Guideline CG90 — Depression in adults',
                      'NICE Guideline CG178 — Psychosis and schizophrenia in adults',
                      'DSM-5 / ICD-11 — Diagnostic classifications',
                      'Health & Social Care Act 2008 Reg. 12 — Safe care and treatment',
                    ],
                  },
                  {
                    num: '3',
                    title: 'Safeguarding & Whistleblowing',
                    duration: '45 min',
                    core: true,
                    refs: [
                      'CQC Key Question: Safe (KLOEs S1, S3)',
                      'Care Act 2014 — Sections 42–47: Safeguarding adults at risk',
                      'Health & Social Care Act 2008 Reg. 13 — Safeguarding service users from abuse',
                      'Public Interest Disclosure Act 1998 (Whistleblowing)',
                      'Local Authority Safeguarding Adults Board (LSAB) procedures',
                    ],
                  },
                  {
                    num: '4',
                    title: 'The Art of Active Support',
                    duration: '75 min',
                    core: true,
                    refs: [
                      'CQC Key Question: Responsive (KLOEs R1, R2)',
                      'Mental Capacity Act 2005 — Principles of supported decision-making',
                      'Health & Social Care Act 2008 Reg. 9 — Person-centred care',
                      'Positive Behaviour Support (PBS) Framework — NHS England 2015',
                      'Human Rights Act 1998 — Article 8: Right to private and family life',
                    ],
                  },
                  {
                    num: '5',
                    title: 'Evidencing Your Work — Writing Notes That Matter',
                    duration: '30 min',
                    core: true,
                    refs: [
                      'CQC Key Question: Well-led (KLOEs W1, W2)',
                      'Health & Social Care Act 2008 Reg. 17 — Good governance',
                      'Data Protection Act 2018 / UK GDPR — Accurate and lawful record keeping',
                      'NMC / Skills for Care — Professional standards for documentation',
                      'CQC Inspection Framework — Evidence of outcomes in care records',
                    ],
                  },
                  {
                    num: '6',
                    title: 'Reflection, Commitment & Close',
                    duration: '30 min',
                    core: true,
                    refs: [
                      'CQC Key Question: Well-led (KLOE W3)',
                      'Health & Social Care Act 2008 Reg. 18 — Staffing (competency & development)',
                      'Skills for Care — Continuing Professional Development (CPD) standards',
                      'Care Certificate Standard 2 — Your personal development',
                      'Francis Report 2013 — Culture of learning and accountability',
                    ],
                  },
                  {
                    num: '7',
                    title: 'Medication Management',
                    duration: '60 min',
                    core: false,
                    refs: [
                      'CQC Key Question: Safe (KLOE S2)',
                      'Health & Social Care Act 2008 Reg. 12 — Safe care and treatment (medicines)',
                      'NICE Guideline NG67 — Medicines optimisation',
                      'Medicines Act 1968 — Legal framework for medicines administration',
                      'Skills for Care — Medication management competency framework',
                    ],
                  },
                  {
                    num: '8',
                    title: 'Positive Behaviour Support',
                    duration: '60 min',
                    core: false,
                    refs: [
                      'CQC Key Question: Safe & Effective (KLOEs S1, E1)',
                      'Mental Health Units (Use of Force) Act 2018',
                      'Health & Social Care Act 2008 Reg. 13 — Safeguarding from abuse and improper treatment',
                      'PBS Competence Framework — BILD/NHS England 2015',
                      'Restraint Reduction Network (RRN) Training Standards 2019',
                    ],
                  },
                ].map((mod, idx) => (
                  <tr key={mod.num} style={{ background: idx % 2 === 0 ? 'rgba(30,58,95,0.03)' : 'white', verticalAlign: 'top' }}>
                    <td style={{ padding: '2.5mm 3mm', borderBottom: '0.5px solid rgba(30,58,95,0.1)' }}>
                      <div style={{
                        width: '6mm', height: '6mm', borderRadius: '50%',
                        background: mod.core ? '#1e3a5f' : '#64748b',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: '700', fontSize: '8px',
                      }}>{mod.num}</div>
                    </td>
                    <td style={{ padding: '2.5mm 3mm', borderBottom: '0.5px solid rgba(30,58,95,0.1)' }}>
                      <div style={{ fontWeight: '700', color: '#1e3a5f', fontSize: '9.5px', marginBottom: '0.5mm' }}>{mod.title}</div>
                      <div style={{ fontSize: '7.5px', color: mod.core ? '#059669' : '#64748b' }}>
                        {mod.core ? '● Core Module' : '○ Optional Module'}
                      </div>
                    </td>
                    <td style={{ padding: '2.5mm 3mm', borderBottom: '0.5px solid rgba(30,58,95,0.1)' }}>
                      {mod.refs.map((ref, ri) => (
                        <div key={ri} style={{ color: '#374151', fontSize: '8.5px', lineHeight: 1.5, marginBottom: ri < mod.refs.length - 1 ? '0.5mm' : 0 }}>
                          <span style={{ color: '#c9a227', marginRight: '1.5mm' }}>▸</span>{ref}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4mm 0 3mm' }}>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #1e3a5f)' }} />
              <div style={{ color: '#1e3a5f', fontSize: '10px' }}>◆</div>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #1e3a5f, transparent)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '7.5px', color: '#94a3b8', fontFamily: 'Arial, sans-serif', maxWidth: '160mm', lineHeight: 1.6 }}>
                This programme is designed and delivered by The Kajidori Collective in accordance with CQC Fundamental Standards
                (Health &amp; Social Care Act 2008, Regulated Activities Regulations 2014), Skills for Care workforce development standards,
                and the Care Certificate. All modules are reviewed annually to reflect current legislation and best practice guidance.
                <strong style={{ color: '#92400e' }}> Annual renewal required — valid until: {renewalDate}.</strong>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '7px', color: '#94a3b8', fontFamily: 'Arial, sans-serif', letterSpacing: '1px', textTransform: 'uppercase' }}>Certificate Ref</div>
                <div style={{ fontSize: '9px', fontWeight: '700', color: '#1e3a5f', fontFamily: 'Arial, sans-serif' }}>{refNumber}</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  )
}
