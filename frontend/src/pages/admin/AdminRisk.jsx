import { useState, useEffect } from 'react'
import { ShieldAlert, AlertTriangle, RefreshCw, ShieldCheck, Lock, Unlock, Search } from 'lucide-react'
import api from '../../api/axios.js'
import { useToast } from '../../context/ToastContext.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import StatCard from '../../components/StatCard.jsx'

export default function AdminRisk() {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [auditLogs, setAuditLogs] = useState([])
  const [accounts, setAccounts] = useState([])
  const [riskFilter, setRiskFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  const loadRiskData = async () => {
    try {
      setLoading(true)
      const [logsRes, accRes] = await Promise.all([
        api.get('/admin/audit-logs').catch(() => ({ data: [] })),
        api.get('/admin/accounts').catch(() => ({ data: [] }))
      ])
      setAuditLogs(logsRes.data || [])
      setAccounts(accRes.data || [])
    } catch (err) {
      console.error('Failed to load risk center data:', err)
      addToast('Could not load real-time risk data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRiskData()
  }, [])

  const handleToggleFreezeAccount = async (accountNumber) => {
    const targetAccount = accounts.find(a => a.accountNumber === accountNumber)
    if (!targetAccount) {
      addToast(`Account #${accountNumber} not found in active ledger`, 'error')
      return
    }
    try {
      const res = await api.patch(`/admin/accounts/${targetAccount.id}/freeze`)
      addToast(res.data?.message || `Account ${accountNumber} freeze status updated`, 'success')
      loadRiskData()
    } catch (err) {
      addToast('Failed to update account freeze status', 'error')
    }
  }

  // Filter for real risk-relevant records
  const riskEvents = auditLogs.filter(l => {
    const risk = (l.riskLevel || 'LOW').toUpperCase()
    const status = (l.status || 'SUCCESS').toUpperCase()
    return risk === 'HIGH' || risk === 'MEDIUM' || status === 'FAILED'
  })

  const highRiskCount = auditLogs.filter(l => (l.riskLevel || '').toUpperCase() === 'HIGH').length
  const mediumRiskCount = auditLogs.filter(l => (l.riskLevel || '').toUpperCase() === 'MEDIUM').length
  const failedOpsCount = auditLogs.filter(l => (l.status || '').toUpperCase() === 'FAILED').length
  const flaggedVolume = riskEvents.reduce((sum, l) => sum + (Number(l.amount) || 0), 0)

  const filteredEvents = riskEvents.filter(e => {
    const risk = (e.riskLevel || 'LOW').toUpperCase()
    const status = (e.status || 'SUCCESS').toUpperCase()

    if (riskFilter === 'HIGH' && risk !== 'HIGH') return false
    if (riskFilter === 'MEDIUM' && risk !== 'MEDIUM') return false
    if (riskFilter === 'FAILED' && status !== 'FAILED') return false

    if (search.trim()) {
      const q = search.toLowerCase()
      const matchEmail = (e.userEmail || '').toLowerCase().includes(q)
      const matchActor = (e.performedBy || '').toLowerCase().includes(q)
      const matchAcc = (e.accountNumber || '').toLowerCase().includes(q)
      const matchDesc = (e.description || '').toLowerCase().includes(q)
      if (!matchEmail && !matchActor && !matchAcc && !matchDesc) return false
    }

    return true
  })

  return (
    <div>
      <PageHeader
        title="Real-Time Risk & Fraud Surveillance"
        description="Live anomaly monitoring, automated risk scoring, failed operation triggers & instant account protection"
        icon={ShieldAlert}
        iconColor="var(--accent-rose)"
        actions={
          <button className="btn btn-secondary btn-sm" onClick={loadRiskData}>
            <RefreshCw size={14} /> Refresh Live Feed
          </button>
        }
      />

      {/* 4 Stat Cards */}
      <div className="stat-grid">
        <StatCard
          label="High Risk Triggers"
          value={`${highRiskCount}`}
          icon={AlertTriangle}
          iconTheme="rose"
          valueColor={highRiskCount > 0 ? 'var(--accent-rose)' : 'var(--text-main)'}
          subtitle="Elevated surveillance thresholds"
        />

        <StatCard
          label="Medium Risk Alerts"
          value={`${mediumRiskCount}`}
          icon={ShieldAlert}
          iconTheme="indigo"
          valueColor={mediumRiskCount > 0 ? 'var(--accent-amber)' : 'var(--text-main)'}
          subtitle="Flagged transfers & limits"
        />

        <StatCard
          label="Failed Security Ops"
          value={`${failedOpsCount}`}
          icon={Lock}
          iconTheme="rose"
          valueColor={failedOpsCount > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)'}
          subtitle="Intercepted security actions"
        />

        <StatCard
          label="Flagged Volume"
          value={`₹${flaggedVolume.toLocaleString('en-IN')}`}
          icon={ShieldCheck}
          iconTheme="cyan"
          subtitle="Subject to automated monitoring"
        />
      </div>

      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h3 className="card-title">
              <ShieldAlert size={18} color="var(--accent-rose)" />
              <span>Active Risk Anomaly Ledger</span>
            </h3>
            <span className="badge badge-rose">
              {riskEvents.length} Anomaly Events
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="search-box" style={{ maxWidth: 220 }}>
              <Search size={15} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search account, user, action..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ fontSize: '12px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 4 }}>
              {['ALL', 'HIGH', 'MEDIUM', 'FAILED'].map(filterKey => (
                <button
                  key={filterKey}
                  type="button"
                  onClick={() => setRiskFilter(filterKey)}
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    background: riskFilter === filterKey ? 'var(--primary)' : 'var(--bg-input)',
                    color: riskFilter === filterKey ? '#ffffff' : 'var(--text-muted)'
                  }}
                >
                  {filterKey}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            Scanning real-time database audit logs and transaction anomalies...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <ShieldCheck size={26} />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>All Systems Secure & Clean</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 4 }}>
              No high or medium risk transactions or failed security operations match current filters.
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Audit Ref</th>
                  <th>Performed By / Account</th>
                  <th>Action</th>
                  <th>Description / Incident Note</th>
                  <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                  <th style={{ textAlign: 'center' }}>Risk Level</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th style={{ textAlign: 'center' }}>Security Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map(evt => {
                  const risk = (evt.riskLevel || 'LOW').toUpperCase()
                  const isHigh = risk === 'HIGH'
                  const isMed = risk === 'MEDIUM'
                  const relatedAcc = accounts.find(a => a.accountNumber === evt.accountNumber)
                  const isFrozen = relatedAcc?.status === 'FROZEN'

                  return (
                    <tr key={evt.id}>
                      <td style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>
                        #RISK-{evt.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{evt.performedBy || 'Unknown Client'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {evt.accountNumber ? `Acc: ${evt.accountNumber}` : evt.userEmail || '—'}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-indigo">
                          {evt.action}
                        </span>
                      </td>
                      <td style={{ maxWidth: 280, color: 'var(--text-muted)', fontSize: '12px' }}>
                        {evt.description}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: evt.amount ? 'var(--text-main)' : 'var(--text-dim)' }}>
                        {evt.amount ? `₹${Number(evt.amount).toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: 4,
                            background: isHigh ? 'rgba(244, 63, 94, 0.18)' : (isMed ? 'rgba(245, 158, 11, 0.18)' : 'rgba(16, 185, 129, 0.15)'),
                            color: isHigh ? 'var(--accent-rose)' : (isMed ? 'var(--accent-amber)' : 'var(--accent-emerald)')
                          }}
                        >
                          {risk}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${evt.status === 'FAILED' ? 'badge-rose' : 'badge-emerald'}`}>
                          {evt.status || 'SUCCESS'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {evt.accountNumber && evt.accountNumber !== '—' && (
                          <button
                            type="button"
                            className={`btn btn-sm ${isFrozen ? 'btn-secondary' : 'btn-danger'}`}
                            onClick={() => handleToggleFreezeAccount(evt.accountNumber)}
                            style={{ fontSize: '11px', padding: '3px 8px', gap: 4 }}
                          >
                            {isFrozen ? <Unlock size={12} /> : <Lock size={12} />}
                            {isFrozen ? 'Unfreeze' : 'Freeze Acc'}
                          </button>
                        )}
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
