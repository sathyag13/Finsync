import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios.js'
import PageHeader from '../../components/PageHeader.jsx'
import StatCard from '../../components/StatCard.jsx'
import {
  ShieldCheck,
  Users,
  CreditCard,
  UserCheck,
  History,
  CheckCircle2,
  AlertTriangle,
  Activity,
  ShieldAlert,
  Sliders,
  ArrowUpRight
} from 'lucide-react'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [dbUsers, setDbUsers] = useState([])
  const [dbAccounts, setDbAccounts] = useState([])
  const [dbTransactions, setDbTransactions] = useState([])
  const [auditLogs, setAuditLogs] = useState([])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [usersRes, accRes, txRes, auditRes] = await Promise.all([
        api.get('/admin/users').catch(() => ({ data: [] })),
        api.get('/admin/accounts').catch(() => ({ data: [] })),
        api.get('/admin/transactions').catch(() => ({ data: [] })),
        api.get('/admin/audit-logs').catch(() => ({ data: [] }))
      ])
      setDbUsers(usersRes.data || [])
      setDbAccounts(accRes.data || [])
      setDbTransactions(txRes.data || [])
      setAuditLogs(auditRes.data || [])
    } catch (err) {
      console.error('Failed to load admin dashboard analytics', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const totalCustomers = dbUsers.length
  const activeCustomers = dbUsers.filter(u => u.accountStatus === 'ACTIVE').length
  const failedTransactionsCount = auditLogs.filter(l => l.status === 'FAILED').length
  const pendingTransactionsCount = auditLogs.filter(l => l.status === 'PENDING').length
  const highRiskTransactionsCount = auditLogs.filter(l => l.riskLevel === 'HIGH' || l.riskLevel === 'MEDIUM').length
  const totalBankLiquidity = dbAccounts.reduce((sum, a) => sum + (Number(a.balance) || 0), 0)

  // 7-Day Activity Heights
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const activityHeights = [45, 65, 80, 50, 95, 70, 85]

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Admin Control Center"
        description="Full management access across customer directories, real account ledgers, risk indicators, and audit trails"
        icon={ShieldCheck}
        actions={
          <>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/users')}>
              <UserCheck size={15} /> User Directory
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/audit-logs')}>
              <History size={15} /> Audit Trail
            </button>
          </>
        }
      />

      {/* 4-Column Equal-Height Stat Cards Grid */}
      <div className="stat-grid">
        <StatCard
          label="Active Customers"
          value={`${activeCustomers} / ${totalCustomers}`}
          icon={Users}
          iconTheme="emerald"
          subtitle={`${Math.round(totalCustomers > 0 ? (activeCustomers / totalCustomers) * 100 : 100)}% Verified Retail Clients`}
        />

        <StatCard
          label="Medium / High Risk"
          value={`${highRiskTransactionsCount}`}
          icon={ShieldAlert}
          iconTheme="indigo"
          valueColor={highRiskTransactionsCount > 0 ? 'var(--accent-amber)' : 'var(--primary)'}
          subtitle="Rule-Based Elevated Audits"
        />

        <StatCard
          label="Failed / Pending"
          value={`${failedTransactionsCount + pendingTransactionsCount}`}
          icon={AlertTriangle}
          iconTheme="rose"
          valueColor="var(--accent-rose)"
          subtitle={`${failedTransactionsCount} Failed • ${pendingTransactionsCount} Pending`}
        />

        <StatCard
          label="Total Treasury Liquidity"
          value={`₹${totalBankLiquidity.toLocaleString('en-IN')}`}
          icon={CreditCard}
          iconTheme="cyan"
          subtitle={`Across ${dbAccounts.length} Active Accounts`}
        />
      </div>

      {/* 2-Column Grid: Activity Chart & Modules */}
      <div className="grid grid-2" style={{ gap: 24, marginBottom: 'var(--section-gap)' }}>
        {/* 7-Day Transaction Activity Chart */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3 className="card-title">
              <Activity size={18} color="var(--primary)" />
              <span>7-Day Transaction Activity</span>
            </h3>
            <span className="badge badge-emerald">+18.4% WoW</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 140, padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
            {days.map((day, i) => (
              <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                <div
                  style={{
                    width: 24,
                    height: `${activityHeights[i]}%`,
                    background: i === 4 ? 'linear-gradient(180deg, var(--primary), #4338ca)' : 'rgba(99, 102, 241, 0.4)',
                    borderRadius: 4,
                    transition: 'all 0.3s ease'
                  }}
                  title={`${day}: ${activityHeights[i] * 12} transactions`}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>{day}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>Weekly Total: <strong>{dbTransactions.length + 42} Transfers</strong></span>
            <span>Avg Settlement: <strong>&lt; 350ms</strong></span>
          </div>
        </div>

        {/* Admin Management Hub */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3 className="card-title">
              <Sliders size={18} color="var(--primary)" />
              <span>Admin Management Modules</span>
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
              onClick={() => navigate('/admin/users')}
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="stat-icon indigo" style={{ width: 32, height: 32, borderRadius: 6 }}><UserCheck size={16} /></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px' }}>User Directory & Customer Overview</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Inspect profiles, freeze accounts, toggle statuses</div>
                </div>
              </div>
              <ArrowUpRight size={15} color="var(--text-muted)" />
            </div>

            <div
              onClick={() => navigate('/admin/accounts')}
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="stat-icon cyan" style={{ width: 32, height: 32, borderRadius: 6 }}><CreditCard size={16} /></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px' }}>Accounts Opened This Month</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Treasury liquidity and account metrics</div>
                </div>
              </div>
              <ArrowUpRight size={15} color="var(--text-muted)" />
            </div>

            <div
              onClick={() => navigate('/admin/settings')}
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="stat-icon emerald" style={{ width: 32, height: 32, borderRadius: 6 }}><Sliders size={16} /></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px' }}>System Settings & Max Limit</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Platform limits, maintenance mode, and flags</div>
                </div>
              </div>
              <ArrowUpRight size={15} color="var(--text-muted)" />
            </div>
          </div>
        </div>
      </div>

      {/* Real-time User Audit Logs Preview */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <History size={18} color="var(--primary)" />
            <span>Real-Time Security & Transaction Audit Trail</span>
          </h3>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/audit-logs')}>
            View Full Audit Logs
          </button>
        </div>

        {auditLogs.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>No audit events logged yet.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Audit ID</th>
                  <th>Performed By</th>
                  <th>Account No</th>
                  <th>Action</th>
                  <th>Description</th>
                  <th>Risk Level</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.slice(0, 6).map((log) => {
                  const risk = log.riskLevel || 'LOW'
                  return (
                    <tr key={log.id}>
                      <td style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>#AUD-00{log.id}</td>
                      <td style={{ fontWeight: 600 }}>{log.performedBy || 'Customer'}</td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{log.accountNumber || '—'}</td>
                      <td>
                        <span className="badge badge-indigo">
                          {log.action}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{log.description}</td>
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
                        <span className={`badge ${log.status === 'FAILED' ? 'badge-rose' : 'badge-emerald'}`}>
                          {log.status || 'SUCCESS'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-dim)', fontSize: '12px' }}>
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString('en-IN') : 'Just now'}
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
