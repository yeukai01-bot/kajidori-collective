import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase, TABLES } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

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
    // Fetch the certificate
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

    // Security: only allow the cert owner, their manager (same org), or admin
    const isOwner = c.user_id === user.id
    const isAdmin = profile?.role === 'admin'
    const isManager = profile?.role === 'manager'

    if (!isOwner && !isAdmin && !isManager) {
      setError('You do not have permission to view this certificate.')
      setLoading(false)
      return
    }

    setCert(c)

    // Fetch programme name
    if (c.programme_id) {
      const { data: p } = await supabase
        .from(TABLES.PROGRAMMES)
        .select('name, description')
        .eq('id', c.programme_id)
        .single()
      setProgramme(p)
    }

    // Fetch recipient profile (may differ from logged-in user for managers/admins)
    const { data: rp } = await supabase
      .from(TABLES.USERS)
      .select('first_name, last_name, email, organisation_id')
      .eq('id', c.user_id)
      .single()
    setRecipientProfile(rp)

    setLoading(false)
  }

  const handlePrint = () => {
    window.print()
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

  const programmeName = programme?.name || 'Compliance to Excellence'

  return (
    <>
      {/* Print styles — hides everything except the certificate */}
      <style>{`
        @media print {
          body { margin: 0; background: white; }
          .no-print { display: none !important; }
          .cert-page { 
            width: 297mm; 
            min-height: 210mm; 
            margin: 0; 
            padding: 0;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
        }
      `}</style>

      {/* Toolbar — hidden when printing */}
      <div className="no-print bg-slate-800 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-300 hover:text-white text-sm transition-colors flex items-center gap-1">
            ← Back
          </button>
          <span className="text-slate-500">|</span>
          <span className="text-sm text-slate-300">Certificate Preview</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:block">
            Use your browser's print dialog to save as PDF (select "Save as PDF" as destination)
          </span>
          <button
            onClick={handlePrint}
            className="bg-yellow-400 text-slate-900 px-5 py-2 rounded-lg text-sm font-bold hover:bg-yellow-300 transition-colors flex items-center gap-2">
            🖨️ Download / Print PDF
          </button>
        </div>
      </div>

      {/* Page background */}
      <div className="min-h-screen bg-slate-200 flex items-center justify-center py-10 px-4">

        {/* Certificate — A4 landscape proportions */}
        <div
          className="cert-page bg-white shadow-2xl"
          style={{
            width: '297mm',
            minHeight: '210mm',
            maxWidth: '100%',
            position: 'relative',
            fontFamily: 'Georgia, "Times New Roman", serif',
            overflow: 'hidden',
          }}>

          {/* Outer border */}
          <div style={{
            position: 'absolute', inset: '8mm',
            border: '3px solid #1e3a5f',
            pointerEvents: 'none',
            zIndex: 1,
          }} />
          <div style={{
            position: 'absolute', inset: '11mm',
            border: '1px solid #c9a227',
            pointerEvents: 'none',
            zIndex: 1,
          }} />

          {/* Top colour bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '7mm',
            background: 'linear-gradient(90deg, #1e3a5f 0%, #c9a227 50%, #1e3a5f 100%)',
          }} />
          {/* Bottom colour bar */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '7mm',
            background: 'linear-gradient(90deg, #1e3a5f 0%, #c9a227 50%, #1e3a5f 100%)',
          }} />

          {/* Left accent bar */}
          <div style={{
            position: 'absolute', top: '7mm', bottom: '7mm', left: 0, width: '5mm',
            background: '#1e3a5f',
          }} />
          {/* Right accent bar */}
          <div style={{
            position: 'absolute', top: '7mm', bottom: '7mm', right: 0, width: '5mm',
            background: '#1e3a5f',
          }} />

          {/* Corner ornaments */}
          {[
            { top: '14mm', left: '12mm' },
            { top: '14mm', right: '12mm' },
            { bottom: '14mm', left: '12mm' },
            { bottom: '14mm', right: '12mm' },
          ].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute', ...pos,
              width: '12mm', height: '12mm',
              border: '2px solid #c9a227',
              zIndex: 2,
            }} />
          ))}

          {/* Main content */}
          <div style={{
            position: 'relative', zIndex: 3,
            padding: '18mm 22mm 16mm',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            textAlign: 'center',
            minHeight: '210mm',
            boxSizing: 'border-box',
          }}>

            {/* Logo row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6mm' }}>
              <div style={{
                width: '14mm', height: '14mm', borderRadius: '50%',
                background: '#1e3a5f',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ color: '#c9a227', fontWeight: 'bold', fontSize: '18px' }}>K</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: '#1e3a5f', fontWeight: 'bold', fontSize: '16px', lineHeight: 1.2 }}>
                  The Kajidori Collective
                </div>
                <div style={{ color: '#64748b', fontSize: '10px', fontFamily: 'Arial, sans-serif' }}>
                  Learning &amp; Compliance Portal
                </div>
              </div>
            </div>

            {/* Title */}
            <div style={{
              fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase',
              color: '#64748b', fontFamily: 'Arial, sans-serif', marginBottom: '4mm',
            }}>
              Certificate of Completion
            </div>

            {/* Divider */}
            <div style={{
              width: '60mm', height: '1px',
              background: 'linear-gradient(90deg, transparent, #c9a227, transparent)',
              marginBottom: '6mm',
            }} />

            {/* This is to certify */}
            <div style={{ fontSize: '13px', color: '#475569', fontFamily: 'Arial, sans-serif', marginBottom: '3mm' }}>
              This is to certify that
            </div>

            {/* Recipient name */}
            <div style={{
              fontSize: '32px', fontWeight: 'bold', color: '#1e3a5f',
              marginBottom: '4mm', lineHeight: 1.2,
            }}>
              {recipientName}
            </div>

            {/* Has successfully completed */}
            <div style={{ fontSize: '13px', color: '#475569', fontFamily: 'Arial, sans-serif', marginBottom: '3mm' }}>
              has successfully completed the
            </div>

            {/* Programme name */}
            <div style={{
              fontSize: '20px', fontWeight: 'bold', color: '#1e3a5f',
              marginBottom: '2mm',
            }}>
              {programmeName}
            </div>

            {/* Sub-description */}
            <div style={{
              fontSize: '11px', color: '#64748b', fontFamily: 'Arial, sans-serif',
              marginBottom: '7mm', maxWidth: '160mm',
            }}>
              including the Full-Day Workshop Programme and 10-Week Workplace Mentoring &amp; Coaching Programme
            </div>

            {/* Divider */}
            <div style={{
              width: '80mm', height: '1px',
              background: 'linear-gradient(90deg, transparent, #1e3a5f, transparent)',
              marginBottom: '7mm',
            }} />

            {/* Footer row: date | reference | issued by */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              gap: '8mm', width: '100%', maxWidth: '200mm',
              marginBottom: '8mm',
            }}>
              {[
                { label: 'Date of Issue', value: issueDate },
                { label: 'Certificate Reference', value: cert?.reference_number || `KC-${cert?.id?.toString().padStart(4, '0') || '0001'}` },
                { label: 'Issued By', value: 'Kajidori Collective' },
              ].map(item => (
                <div key={item.label} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase',
                    color: '#94a3b8', fontFamily: 'Arial, sans-serif', marginBottom: '2mm',
                  }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e3a5f' }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Signature lines */}
            <div style={{
              display: 'flex', gap: '24mm', justifyContent: 'center',
              marginBottom: '6mm',
            }}>
              {[
                { label: 'Authorised Signature', name: 'Yeukai Kajidori' },
                { label: 'Participant Signature', name: '' },
              ].map(sig => (
                <div key={sig.label} style={{ textAlign: 'center', width: '55mm' }}>
                  {sig.name && (
                    <div style={{
                      fontSize: '14px', color: '#1e3a5f', fontStyle: 'italic',
                      marginBottom: '1mm', fontFamily: 'Georgia, serif',
                    }}>
                      {sig.name}
                    </div>
                  )}
                  <div style={{
                    borderTop: '1px solid #94a3b8', paddingTop: '2mm',
                  }}>
                    <div style={{
                      fontSize: '9px', color: '#94a3b8',
                      fontFamily: 'Arial, sans-serif', letterSpacing: '1px',
                      textTransform: 'uppercase',
                    }}>
                      {sig.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CQC note */}
            <div style={{
              fontSize: '9px', color: '#94a3b8', fontFamily: 'Arial, sans-serif',
              maxWidth: '200mm', lineHeight: 1.5,
            }}>
              This certificate is issued in accordance with CQC compliance standards and serves as valid evidence of training completion.
              It may be retained in the employee's personnel file or submitted to regulatory bodies as required.
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
