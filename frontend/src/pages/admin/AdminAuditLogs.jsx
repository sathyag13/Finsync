import { useState, useEffect } from 'react'
import { History, RefreshCw, CheckCircle2, Search, AlertTriangle } from 'lucide-react'
import api from '../../api/axios.js'
import PageHeader from '../../components/PageHeader.jsx'

export default function AdminAuditLogs() {
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState([])

  // Filters
  const [customerSearch, setCustomerSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [riskFilter, setRiskFilter] = useState('ALL')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const loadAuditLogs = async () => {
    try {
      setLoading(true)
      const params = {}
      if (customerSearch) params.customer = customerSearch
      if (actionFilter !== 'ALL') params.action = actionFilter
      if (statusFilter !== 'ALL') params.status = statusFilter
      if (riskFilter !== 'ALL') params.riskLevel = riskFilter
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate

      const res = await api.get('/admin/audit-logs', { params })
      setLogs(res.data || [])
    } catch (err) {
      console.error('Failed to load audit logs:', err)
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAuditLogs()
  }, [actionFilter, statusFilter, riskFilter, startDate, endDate])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    loadAuditLogs()
  }

  const handleResetFilters = () => {
    setCustomerSearch('')
    setActionFilter('ALL')
    setStatusFilter('ALL')
    setRiskFilter('ALL')
    setStartDate('')
    setEndDate('')
    setTimeout(loadAuditLogs, 50)
  }

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="User Transactions Audit Logs"
        description="Official bank security ledger tracking all user transfers, deposits, card freezes, logins & risk indicators"
        icon={History}
        actions={
          <button className="btn btn-secondary btn-sm" onClick={loadAuditLogs}>
            <RefreshCw size={15} /> Refresh Trail
          </button>
        }
      />

      {/* Multi-Filter Bar Card */}
      <div className="card" style={{ padding: 18, marginBottom: 'var(--section-gap)' }}>
        <form onSubmit={handleSearchSubmit}>
          <div className="grid grid-3" style={{ gap: 12, marginBottom: 12 }}>
            {/* Customer Search */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search by customer name, email or account..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                style={{ paddingLeft: 36 }}
              />
              <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
            </div>

            {/* Action / Type Filter */}
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="ALL">All Actions / Transaction Types</option>
              <option value="TRANSFER">TRANSFER</option>
              <option value="DEPOSIT">DEPOSIT</option>
              <option value="WITHDRAWAL">WITHDRAWAL</option>
              <option value="CARD_FREEZE">CARD FREEZE</option>
              <option value="CARD_UNFREEZE">CARD UNFREEZE</option>
              <option value="BENEFICIARY_ADD">BENEFICIARY ADD</option>
              <option value="BENEFICIARY_DELETE">BENEFICIARY DELETE</option>
              <option value="LOGIN">LOGIN</option>
              <option value="SETTINGS_UPDATE">SETTINGS UPDATE</option>
            </select>

            {/* Risk Level Filter */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="ALL">All Risk Levels</option>
              <option value="LOW">LOW RISK</option>
              <option value="MEDIUM">MEDIUM RISK</option>
              <option value="HIGH">HIGH RISK</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>From:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ width: 140 }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>To:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ width: 140 }}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ width: 130 }}
              >
                <option value="ALL">All Statuses</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="FAILED">FAILED</option>
                <option value="PENDING">PENDING</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-primary btn-sm">
                Filter Logs
              </button>
              <button type="button" onClick={handleResetFilters} className="btn btn-secondary btn-sm">
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Audit Logs Table Card */}
      <div className="card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>Loading security audit logs…</div>
        ) : logs.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>No audit log records match your filter criteria.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Audit ID</th>
                  <th>Performed By / Client</th>
                  <th>Account No</th>
                  <th>Action</th>
                  <th>Description / Target</th>
                  <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                  <th>Risk Score</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => {
                  const risk = l.riskLevel || 'LOW'
                  const isSuccess = l.status === 'SUCCESS'
                  return (
                    <tr key={l.id}>
                      <td style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>#AUD-00{l.id}</td>
                      <td>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '13px' }}>{l.performedBy || 'Customer'}</div>
                          {l.userEmail && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{l.userEmail}</div>}
                        </div>
                      </td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '13px' }}>{l.accountNumber || '—'}</td>
                      <td>
                        <span className="badge badge-indigo" style={{ fontSize: '11px' }}>
                          {l.action}
                        </span>
                      </td>
                      <td className="cell-desc" style={{ color: 'var(--text-main)', fontSize: '13px' }}>
                        {l.description || 'System Operation'}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: l.amount ? 'var(--text-main)' : 'var(--text-dim)', fontSize: '13px' }}>
                        {l.amount ? `₹${Number(l.amount).toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: risk === 'HIGH' ? 'rgba(244, 63, 94, 0.15)' : (risk === 'MEDIUM' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)'),
                            color: risk === 'HIGH' ? 'var(--accent-rose)' : (risk === 'MEDIUM' ? 'var(--accent-amber)' : 'var(--accent-emerald)')
                          }}
                        >
                          {risk}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span
                          className={`badge ${isSuccess ? 'badge-emerald' : 'badge-rose'}`}
                        >
                          {isSuccess ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                          {l.status || 'SUCCESS'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                        {l.timestamp ? new Date(l.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : 'Just now'}
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
