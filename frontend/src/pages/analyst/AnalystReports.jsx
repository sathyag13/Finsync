import { FileText, Download } from 'lucide-react'
import { useToast } from '../../context/ToastContext.jsx'

export default function AnalystReports() {
  const { addToast } = useToast()

  const reports = [
    { title: 'Q1 2026 Macro Portfolio Asset Allocation Summary', type: 'PDF / CSV', size: '2.4 MB', date: '2026-08-15' },
    { title: 'System-Wide Payment Settlement & Failure Rate Audit', type: 'CSV Data Sheet', size: '1.8 MB', date: '2026-08-14' },
    { title: 'High-Value Outflow & AML Threshold Flag Report', type: 'PDF Security Doc', size: '3.1 MB', date: '2026-08-12' },
    { title: 'Regional Customer Growth & Demographic Cohort Study', type: 'Interactive Analytics', size: '4.2 MB', date: '2026-08-10' }
  ]

  const handleDownload = (title) => {
    addToast(`Downloading analyst report: ${title}`, 'success')
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileText size={28} color="var(--primary)" /> Analytical Reports & Data Export Center
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
          Generate, preview, and download analytical financial reports across all banking modules
        </p>
      </div>

      <div className="grid grid-2">
        {reports.map((r, idx) => (
          <div key={idx} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: 4 }}>{r.title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{r.type} • {r.size} • Generated {r.date}</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => handleDownload(r.title)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800 }}>
              <Download size={14} /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
