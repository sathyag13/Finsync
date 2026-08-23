import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import {
  ShieldCheck,
  Users,
  CreditCard,
  Send,
  PiggyBank,
  CheckCircle2,
  Lock,
  Search,
  RefreshCw,
  History
} from 'lucide-react'

export default function RoleBasedAccess() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [dbUsers, setDbUsers] = useState([])
  const [dbAccounts, setDbAccounts] = useState([])
  const [dbTransactions, setDbTransactions] = useState([])

  const [userRoleFilter, setUserRoleFilter] = useState('ALL')
  const [userSearchQuery, setUserSearchQuery] = useState('')

  const actualRole = user?.role || 'CUSTOMER'

  const fetchRealData = async () => {
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
      console.error('Failed to load database analytics', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (actualRole !== 'CUSTOMER') {
      fetchRealData()
    }
  }, [actualRole])

  // Strict Access Guard for Customer Role
  if (actualRole === 'CUSTOMER') {
    return (
      <div className="card" style={{ padding: 48, textAlign: 'center', maxWidth: 700, margin: '60px auto', borderRadius: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239,68,68,0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
          <Lock size={32} />
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: 10, color: 'var(--text-main)' }}>
          Access Restricted: Customer Account Clearance
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 28 }}>
          The System Administration & Database Analytics Portal is reserved exclusively for verified Staff and System Security Administrators. Retail customer accounts do not have clearance to access administrative ledgers.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ padding: '12px 24px', fontWeight: 800 }}>
          Return to Personal Banking Dashboard
        </button>
      </div>
    )
  }

  const totalUsersCount = dbUsers.length
  const totalAccountsCount = dbAccounts.length
  const totalBankLiquidity = dbAccounts.reduce((sum, a) => sum + (Number(a.balance) || 0), 0)
  const totalTxCount = dbTransactions.length

  const filteredUsers = dbUsers.filter(u => {
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter
    const term = userSearchQuery.toLowerCase().trim()
    const matchesSearch = !term ||
                          (u.fullName || '').toLowerCase().includes(term) ||
                          (u.email || '').toLowerCase().includes(term) ||
                          (u.phoneNumber || '').toLowerCase().includes(term)
    return matchesRole && matchesSearch
  })

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Header Section */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={28} color="var(--primary)" /> Bank Administration & Real Database Control Center
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
            Original database records for registered users, bank accounts, and user transaction audit trail
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={fetchRealData} style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800 }}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh Real Database Data
          </button>
        </div>
      </div>

      {/* Role Clearance Banner */}
      <div style={{
        padding: '16px 20px',
        borderRadius: 16,
        marginBottom: 28,
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(67, 56, 202, 0.08))',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'var(--primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            fontWeight: 900
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
              {user?.fullName} ({actualRole})
              <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.2)', color: 'var(--text-main)', fontWeight: 800 }}>
                {user?.empNo ? `Emp ID: ${user.empNo}` : 'Verified Staff'}
              </span>
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Authenticated Session Clearance: Strictly original user, account, and transaction data from the database.
            </div>
          </div>
        </div>
      </div>

      {/* REAL DATABASE KEY METRICS GRID */}
      <div className="grid grid-4" style={{ marginBottom: 28 }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Registered Users</div>
            <Users size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)' }}>
            {totalUsersCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800, marginTop: 4 }}>
            Registered Users in Database
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Active Bank Accounts</div>
            <CreditCard size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#10b981' }}>
            {totalAccountsCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: 4 }}>
            Savings & Current Bank Vaults
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Bank Liquidity</div>
            <PiggyBank size={18} color="#ec4899" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ec4899' }}>
            ₹{totalBankLiquidity.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800, marginTop: 4 }}>
            Stored in Common Repository
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>User Transactions Logged</div>
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

      {/* ORIGINAL USER DIRECTORY LEDGER */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={20} color="var(--primary)" /> Registered User Directory ({filteredUsers.length})
          </h3>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <select
              className="input-field"
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '0.82rem', width: 'auto' }}
            >
              <option value="ALL">All Roles</option>
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
            </select>

            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search name or email..."
                className="input-field"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                style={{ paddingLeft: 30, padding: '6px 12px 6px 30px', fontSize: '0.82rem', width: 220 }}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
            Loading database user records...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
            No registered users found in database.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>USER ID</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>FULL NAME</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>EMAIL ADDRESS</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>PHONE NUMBER</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>ROLE</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--primary)' }}>#{u.id}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-main)' }}>{u.fullName}</td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{u.email}</td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{u.phoneNumber || 'N/A'}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: 99,
                        background: u.role === 'ADMIN' ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.1)',
                        color: u.role === 'ADMIN' ? 'var(--primary)' : 'var(--text-main)'
                      }}>
                        {u.role || 'CUSTOMER'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: 99, background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                        {u.accountStatus || 'ACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ORIGINAL USER TRANSACTIONS AUDIT LOG LEDGER */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
          <History size={20} color="var(--primary)" /> Real User Transactions Audit Log
        </h3>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
            Loading user transactions audit logs from database...
          </div>
        ) : dbTransactions.length === 0 ? (
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
                      <td style={{ padding: '12px 14px', color: 'var(--text-main)', fontWeight: 600 }}>{t.target || t.description || 'Bank Operation'}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: isCredit ? '#10b981' : '#ef4444' }}>
                        {isCredit ? '+' : '-'}₹{amtVal.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: 99, background: 'rgba(16,185,129,0.15)', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <CheckCircle2 size={12} /> {t.status || 'SUCCESS'}
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
