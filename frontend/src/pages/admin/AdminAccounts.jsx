import { useState, useEffect } from 'react'
import { CreditCard, RefreshCw, Building, ShieldCheck, Search } from 'lucide-react'
import api from '../../api/axios.js'
import PageHeader from '../../components/PageHeader.jsx'
import StatCard from '../../components/StatCard.jsx'

export default function AdminAccounts() {
  const [loading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')

  const loadAccounts = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/accounts')
      setAccounts(res.data || [])
    } catch (err) {
      console.error('Failed to load accounts:', err)
      setAccounts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAccounts()
  }, [])

  const totalOpened = accounts.length
  const savingsAccountsCount = accounts.filter(a => (a.accountType || '').toUpperCase().includes('SAVINGS')).length
  const currentAccountsCount = accounts.filter(a => (a.accountType || '').toUpperCase().includes('CURRENT')).length
  const businessAccountsCount = accounts.filter(a => (a.accountType || '').toUpperCase().includes('BUSINESS') || (a.accountType || '').toUpperCase().includes('INVESTMENT')).length
  const activeAccountsCount = accounts.filter(a => (a.status || 'ACTIVE') === 'ACTIVE').length
  const frozenAccountsCount = accounts.filter(a => a.status === 'FROZEN').length
  const totalLiquidity = accounts.reduce((sum, a) => sum + Number(a.balance || 0), 0)

  const filteredAccounts = accounts.filter((a) => {
    const matchesType = typeFilter === 'ALL' || (a.accountType || '').toUpperCase() === typeFilter
    const matchesSearch =
      (a.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.userEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.accountNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Accounts Opened This Month"
        description="Treasury breakdown, newly provisioned accounts, vault distribution & client portfolios"
        icon={CreditCard}
        actions={
          <button className="btn btn-secondary btn-sm" onClick={loadAccounts}>
            <RefreshCw size={15} /> Refresh Directory
          </button>
        }
      />

      {/* 4-Column Equal-Height Stat Cards Grid */}
      <div className="stat-grid">
        <StatCard
          label="Total Accounts Opened"
          value={`${totalOpened}`}
          icon={CreditCard}
          iconTheme="indigo"
          subtitle={`${activeAccountsCount} Active • ${frozenAccountsCount} Frozen`}
        />

        <StatCard
          label="Savings Vaults"
          value={`${savingsAccountsCount}`}
          icon={Building}
          iconTheme="emerald"
          valueColor="var(--accent-emerald)"
          subtitle="5.50% APY Retail Accounts"
        />

        <StatCard
          label="Current & Commercial"
          value={`${currentAccountsCount + businessAccountsCount}`}
          icon={Building}
          iconTheme="cyan"
          subtitle="Corporate Portfolios"
        />

        <StatCard
          label="Total Treasury Balance"
          value={`₹${totalLiquidity.toLocaleString('en-IN')}`}
          icon={ShieldCheck}
          iconTheme="indigo"
          subtitle="Verified Bank Reserves"
        />
      </div>

      {/* Filter & Search Bar Card */}
      <div className="card" style={{ padding: 16, marginBottom: 'var(--section-gap)' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by customer name, email or account number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
            <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ minWidth: 160 }}
          >
            <option value="ALL">All Account Types</option>
            <option value="SAVINGS">SAVINGS ONLY</option>
            <option value="CURRENT">CURRENT ONLY</option>
            <option value="INVESTMENT">INVESTMENT ONLY</option>
            <option value="GOLD">GOLD ONLY</option>
          </select>
        </div>
      </div>

      {/* Accounts Table Card */}
      <div className="card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>Loading opened accounts…</div>
        ) : filteredAccounts.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>No accounts found.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Customer / Account Holder</th>
                  <th>Account Type</th>
                  <th>Account Number</th>
                  <th style={{ textAlign: 'right' }}>Current Balance</th>
                  <th>Date Opened</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '13px' }}>{a.userName || 'Valued Client'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{a.userEmail || '-'}</div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-indigo" style={{ fontSize: '11px' }}>
                        {a.accountType}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, fontFamily: 'monospace', color: 'var(--primary)' }}>
                      {a.accountNumber}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--text-main)', fontSize: '14px' }}>
                      ₹{Number(a.balance || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                      {a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'August 2026'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${a.status === 'FROZEN' ? 'badge-rose' : 'badge-emerald'}`}>
                        {a.status || 'ACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
