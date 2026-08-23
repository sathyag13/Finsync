import { useState, useEffect } from 'react'
import { History, RefreshCw, CheckCircle2 } from 'lucide-react'
import api from '../../api/axios.js'

export default function AdminAuditLogs() {
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState([])

  const loadAuditLogs = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/audit-logs')
      setLogs(res.data || [])
    } catch (err) {
      console.error(err)
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAuditLogs()
  }, [])

  return (
    <div style={{ paddingBottom: 60 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <History size={28} color="var(--primary)" /> User Transactions Audit Logs
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
            Official bank audit trail logging all real user deposits, withdrawals, and money transfer transactions
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={loadAuditLogs} style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800 }}>
          <RefreshCw size={16} /> Refresh Audit Trail
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
            Loading user transactions audit logs from database...
          </div>
        ) : logs.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
            No user transactions recorded in the database yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>AUDIT ID</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>USER / ACCOUNT HOLDER</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>ACCOUNT NO</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>ACTION / TYPE</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>DESCRIPTION / TARGET</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 800 }}>AMOUNT (₹)</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 800 }}>RUNNING BALANCE (₹)</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>TIMESTAMP</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => {
                  const txType = l.action || l.type || 'DEPOSIT'
                  const isCredit = txType === 'DEPOSIT' || txType === 'TRANSFER_IN'
                  const amtVal = Number(l.amount) || 0
                  const balVal = Number(l.balanceAfter) || 0

                  return (
                    <tr key={l.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--primary)' }}>#AUD-00{l.id}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-main)' }}>{l.performedBy || l.userName || 'Valued Client'}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-muted)' }}>{l.accountNumber || '-'}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: 99, background: isCredit ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)', color: isCredit ? '#10b981' : 'var(--primary)' }}>
                          {txType}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-main)', fontWeight: 600 }}>{l.target || l.description || 'Bank Operation'}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: isCredit ? '#10b981' : '#ef4444' }}>
                        {isCredit ? '+' : '-'}₹{amtVal.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: 'var(--text-main)' }}>
                        ₹{balVal.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {l.timestamp ? new Date(l.timestamp).toLocaleString('en-IN') : 'Just now'}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: 99, background: 'rgba(16,185,129,0.15)', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <CheckCircle2 size={12} /> {l.status || 'SUCCESS'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
