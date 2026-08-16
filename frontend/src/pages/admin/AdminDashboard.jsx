import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios.js'
import { useToast } from '../../context/ToastContext.jsx'
import {
  ShieldCheck,
  Users,
  CreditCard,
  Send,
  PieChart,
  PiggyBank,
  AlertTriangle,
  Activity,
  UserCheck,
  ShieldAlert,
  History,
  Settings,
  ArrowUpRight,
  TrendingUp,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react'

export default function AdminDashboard() {
  const { addToast } = useToast()
  const navigate = useNavigate()

  const adminMetrics = {
    totalCustomers: 12500,
    activeUsers: 11800,
    totalAccounts: 24850,
    activeCards: 18400,
    txnsToday: 1840,
    txVolume: 84250000.0,
    totalSavings: 150000000.0,
    pendingActions: 3,
    fraudAlerts: 2,
    failedTxns: 295,
    systemStatus: 'ONLINE_OPTIMAL'
  }

  const recentAdminActivities = [
    { id: 1, action: 'Role Elevation', admin: 'Sathya Narayanan', target: 'Aarav Sharma → ANALYST', timestamp: '10 mins ago', status: 'SUCCESS' },
    { id: 2, action: 'Account Status Lock', admin: 'Sathya Narayanan', target: 'Priya Patel (Flagged AML)', timestamp: '45 mins ago', status: 'LOCKED' },
    { id: 3, action: 'System Backup Complete', admin: 'Automated Daemon', target: 'PostgreSQL DB Dump', timestamp: '2 hours ago', status: 'SUCCESS' },
    { id: 4, action: 'APY Yield Parameter Change', admin: 'Sathya Narayanan', target: 'Savings Vault Rate → 5.5%', timestamp: '4 hours ago', status: 'UPDATED' }
  ]

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={28} color="var(--primary)" /> Bank Administration & System Security Control Center
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
            Full management access across users, account ledgers, transaction states, risk alerts & system parameters
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/users')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800 }}>
            <UserCheck size={16} /> Manage User Accounts
          </button>
        </div>
      </div>

      {/* ADMIN METRICS GRID - 11 KEY INDICATORS */}
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Customers</span>
            <Users size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)' }}>
            {adminMetrics.totalCustomers.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800, marginTop: 4 }}>
            {adminMetrics.activeUsers.toLocaleString()} Active (94.4%)
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Accounts & Cards</span>
            <CreditCard size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#10b981' }}>
            {adminMetrics.totalAccounts.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: 4 }}>
            {adminMetrics.activeCards.toLocaleString()} Active Cards
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Tx Volume Today</span>
            <Send size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f59e0b' }}>
            ₹8.42 Cr
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: 4 }}>
            {adminMetrics.txnsToday.toLocaleString()} Txns Processed
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Bank Savings</span>
            <PiggyBank size={18} color="#ec4899" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ec4899' }}>
            ₹15.0 Cr
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ArrowUpRight size={14} /> Vault Reserves Secure
          </div>
        </div>
      </div>

      {/* SECONDARY ADMIN KPI STATUS STRIP */}
      <div className="grid grid-4" style={{ marginBottom: 28 }}>
        <div className="card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <Clock size={24} color="#f59e0b" />
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f59e0b' }}>{adminMetrics.pendingActions} Pending</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Admin Actions</div>
          </div>
        </div>

        <div className="card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <ShieldAlert size={24} color="#ef4444" />
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ef4444' }}>{adminMetrics.fraudAlerts} Security Flags</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Fraud Alerts</div>
          </div>
        </div>

        <div className="card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <XCircle size={24} color="#ef4444" />
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ef4444' }}>{adminMetrics.failedTxns} Failures</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Low Balance Rejections</div>
          </div>
        </div>

        <div className="card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <CheckCircle2 size={24} color="#10b981" />
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10b981' }}>SYSTEM ONLINE</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Spring Boot 3 + Postgres</div>
          </div>
        </div>
      </div>

      {/* ADMIN CHARTS GRID */}
      <div className="grid grid-2" style={{ marginBottom: 28 }}>
        {/* Customer Growth Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Customer Onboarding Growth</h3>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800 }}>+18.4% Q-o-Q</span>
          </div>

          <div style={{ height: 160, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
            {[
              { month: 'Oct', users: 8400 },
              { month: 'Nov', users: 9200 },
              { month: 'Dec', users: 10100 },
              { month: 'Jan', users: 11500 },
              { month: 'Feb', users: 12500 }
            ].map((c, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--primary)', marginBottom: 4 }}>{(c.users / 1000).toFixed(1)}k</span>
                <div style={{ width: '100%', maxWidth: 32, height: `${(c.users / 14000) * 100}%`, background: 'linear-gradient(180deg, #6366f1, #4338ca)', borderRadius: '6px 6px 0 0' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: 6 }}>{c.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Account Distribution Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Bank Account Type Distribution</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800 }}>24,850 Total</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: 4, fontWeight: 700 }}>
                <span>Retail Savings Accounts</span>
                <span style={{ color: 'var(--primary)', fontWeight: 900 }}>14,200 (57.1%)</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: '57.1%', height: '100%', background: 'var(--primary)', borderRadius: 99 }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: 4, fontWeight: 700 }}>
                <span>Salary & Checking Accounts</span>
                <span style={{ color: '#10b981', fontWeight: 900 }}>6,400 (25.7%)</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: '25.7%', height: '100%', background: '#10b981', borderRadius: 99 }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: 4, fontWeight: 700 }}>
                <span>Fixed Deposit & Demat Accounts</span>
                <span style={{ color: '#f59e0b', fontWeight: 900 }}>4,250 (17.2%)</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: '17.2%', height: '100%', background: '#f59e0b', borderRadius: 99 }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ADMINISTRATIVE ACTIVITIES TRAIL */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            <History size={20} color="var(--primary)" /> Administrative Activity Trail
          </h3>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/audit-logs')} style={{ fontWeight: 800 }}>
            View Full Audit Logs
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>ACTION TYPE</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>PERFORMED BY</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>TARGET DETAILS</th>
                <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>TIMESTAMP</th>
                <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {recentAdminActivities.map((act) => (
                <tr key={act.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--primary)' }}>{act.action}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-main)' }}>{act.admin}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{act.target}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{act.timestamp}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: 99, background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                      {act.status}
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
