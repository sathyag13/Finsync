import { ShieldAlert, AlertTriangle } from 'lucide-react'

export default function AdminRisk() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShieldAlert size={28} color="#ef4444" /> Security Risk & Fraud Alert Center
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
          Real-time anomaly monitoring, automated AML alerts & suspicious pattern intercept
        </p>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(239,68,68,0.18)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>2 Suspicious Transactions Intercepted</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Automated AML Rule Engine • High Volume Cross-Border SWIFT</div>
          </div>
        </div>

        <div style={{ padding: '14px 18px', borderRadius: 12, background: 'var(--bg-input)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>TX-99478 (₹28.0 Lakh SWIFT)</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Unverified offshore counterparty address</div>
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: 900, padding: '4px 12px', borderRadius: 99, background: 'rgba(239,68,68,0.18)', color: '#ef4444' }}>
            FLAGGED FOR REVIEW
          </span>
        </div>
      </div>
    </div>
  )
}
