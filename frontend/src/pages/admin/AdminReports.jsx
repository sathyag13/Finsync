import { FileText, Download } from 'lucide-react'
import { useToast } from '../../context/ToastContext.jsx'

export default function AdminReports() {
  const { addToast } = useToast()

  const handleDownload = (name) => {
    addToast(`Exporting administrative report: ${name}`, 'success')
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileText size={28} color="var(--primary)" /> Administrative Reports & Regulatory Compliance
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
          Generate RBI regulatory compliance reports, user access logs, and financial ledger exports
        </p>
      </div>

      <div className="grid grid-2">
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>RBI Statutory Liquidity & Reserve Ratio Audit</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Compliance Doc • Updated Daily</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => handleDownload('RBI Statutory Report')}>
            <Download size={14} /> Export PDF
          </button>
        </div>

        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Full Master User Directory & Role Audit</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Security Export • CSV Format</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => handleDownload('Master User CSV')}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>
    </div>
  )
}
