import { FileText, Download } from 'lucide-react'
import { useToast } from '../../context/ToastContext.jsx'
import PageHeader from '../../components/PageHeader.jsx'

export default function AdminReports() {
  const { addToast } = useToast()

  const handleDownload = (name) => {
    addToast(`Exporting administrative report: ${name}`, 'success')
  }

  return (
    <div>
      <PageHeader
        title="Administrative Reports & Regulatory Compliance"
        description="Generate RBI regulatory compliance reports, user access logs, and financial ledger exports"
        icon={FileText}
      />

      <div className="grid grid-2" style={{ gap: 24 }}>
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>RBI Statutory Liquidity & Reserve Ratio Audit</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Compliance Doc • Updated Daily</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => handleDownload('RBI Statutory Report')}>
            <Download size={14} /> Export PDF
          </button>
        </div>

        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>Full Master User Directory & Role Audit</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Security Export • CSV Format</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => handleDownload('Master User CSV')}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>
    </div>
  )
}
