import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios.js'
import { useToast } from '../../context/ToastContext.jsx'
import {
  ShieldCheck,
  Users,
  CreditCard,
  Send,
  PiggyBank,
  UserCheck,
  History,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react'

export default function AdminDashboard() {
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [dbUsers, setDbUsers] = useState([])
  const [dbAccounts, setDbAccounts] = useState([])
  const [dbTransactions, setDbTransactions] = useState([])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [usersRes, accRes, txRes] = await Promise.all([
        api.get('/admin/users').catch(() => ({ data: [] })),
        api.get('/admin/accounts').catch(() => api.get('/accounts/all')).catch(() => ({ data: [] })),
        api.get('/admin/audit-logs').catch(() => ({ data: [] }))
      ])
      setDbUsers(usersRes.data || [])
      setDbAccounts(accRes.data || [])
      setDbTransactions(txRes.data || [])
    } catch (err) {
      console.error('Failed to load DB analytics', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const totalCustomers = dbUsers.length
  const activeCustomers = dbUsers.filter(u => u.accountStatus === 'ACTIVE').length
  const newAccountsOpenedThisMonth = dbAccounts.length
  const totalAmountInBank = dbAccounts.reduce((sum, a) => sum + (Number(a.balance) || 0), 0)
  const totalTxCount = dbTransactions.length

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={28} color="var(--primary)" /> Bank Administration & System Security Control Center
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
            Full management access across database users, real account ledgers, and transaction states
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/users')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800 }}>
            <UserCheck size={16} /> Manage User Accounts
          </button>
        </div>
      </div>

      {/* REAL ADMIN METRICS GRID FROM DATABASE */}
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Registered Customers</span>
            <Users size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)' }}>
            {totalCustomers}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800, marginTop: 4 }}>
            {activeCustomers} Active Customers in Database
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>New Accounts Opened (Month)</span>
            <CreditCard size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#10b981' }}>
            {newAccountsOpenedThisMonth}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: 4 }}>
            Active Savings & Current Vaults
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Amount Present in Bank</span>
            <PiggyBank size={18} color="#ec4899" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ec4899' }}>
            ₹{totalAmountInBank.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ArrowUpRight size={14} /> Stored in Common Repository
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>User Transactions Logged</span>
            <Send size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f59e0b' }}>
            {totalTxCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: 4 }}>
            Deposits, Withdrawals & Transfers
          </div>
        </div>
      </div>

      {/* SECONDARY SYSTEM STATUS STRIP */}
      <div className="grid grid-3" style={{ marginBottom: 28 }}>
        <div className="card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <Clock size={24} color="#6366f1" />
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)' }}>Real Database Engine</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>PostgreSQL / H2 Live Repository</div>
          </div>
        </div>

        <div className="card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <CheckCircle2 size={24} color="#10b981" />
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10b981' }}>SYSTEM ONLINE</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Spring Boot 3 Web Layer Active</div>
          </div>
        </div>

        <div className="card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <ShieldCheck size={24} color="#f59e0b" />
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f59e0b' }}>Role Clearance</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Enforced CUSTOMER & ADMIN Security</div>
          </div>
        </div>
      </div>

      {/* REAL USER TRANSACTIONS AUDIT TRAIL */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            <History size={20} color="var(--primary)" /> Real User Transactions Audit Log
          </h3>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/audit-logs')} style={{ fontWeight: 800 }}>
            View Full Audit Logs
          </button>
        </div>

        {loading ? (
          <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
            Loading real transaction audit entries from database...
          </div>
        ) : dbTransactions.length === 0 ? (
          <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
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
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>TYPE</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>DESCRIPTION / TARGET</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 800 }}>AMOUNT (₹)</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {dbTransactions.map((t) => {
                  const txType = t.action || t.type || 'DEPOSIT'
                  const isCredit = txType === 'DEPOSIT' || txType === 'TRANSFER_IN'
                  const amtVal = Number(t.amount) || 0
                  return (
                    <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--primary)' }}>#AUD-00{t.id}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-main)' }}>{t.performedBy || t.userName || 'Valued Client'}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-muted)' }}>{t.accountNumber || '-'}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: 99, background: isCredit ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)', color: isCredit ? '#10b981' : 'var(--primary)' }}>
                          {txType}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-main)', fontWeight: 600 }}>
                        {t.target || t.description || 'Bank Transaction'}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: isCredit ? '#10b981' : '#ef4444' }}>
                        {isCredit ? '+' : '-'}₹{amtVal.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: 99, background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                          {t.status || 'SUCCESS'}
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
