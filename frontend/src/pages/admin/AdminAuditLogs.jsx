import { History } from 'lucide-react'

export default function AdminAuditLogs() {
  const logs = [
    { id: 1, action: 'USER_ROLE_CHANGE', performedBy: 'Admin Sathya', target: 'Aarav Sharma (ID #2 → ANALYST)', timestamp: '2026-08-16 00:30:12', status: 'SUCCESS' },
    { id: 2, action: 'ACCOUNT_STATUS_LOCK', performedBy: 'Admin Sathya', target: 'Priya Patel (ID #3)', timestamp: '2026-08-15 22:14:05', status: 'SUCCESS' },
    { id: 3, action: 'SYSTEM_SETTINGS_UPDATE', performedBy: 'Admin Sathya', target: 'Security Parameters', timestamp: '2026-08-15 19:45:00', status: 'SUCCESS' },
    { id: 4, action: 'USER_REGISTERED', performedBy: 'System Self-Reg', target: 'Rahul Verma (ID #4)', timestamp: '2026-08-14 11:20:10', status: 'SUCCESS' }
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <History size={28} color="var(--primary)" /> System Administrative Audit Logs
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
          Tamper-evident audit trail of all security changes, role assignments, and system modifications
        </p>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>LOG ID</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>ACTION TYPE</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>PERFORMED BY</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>TARGET DETAILS</th>
                <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>TIMESTAMP</th>
                <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--primary)' }}>#{l.id}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-main)' }}>{l.action}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-main)' }}>{l.performedBy}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{l.target}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{l.timestamp}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: 99, background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
