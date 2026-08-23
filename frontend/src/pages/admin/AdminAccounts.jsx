import { useState, useEffect } from 'react'
import { CreditCard, RefreshCw, Building, ShieldCheck, Search, Trash2, AlertTriangle } from 'lucide-react'
import api from '../../api/axios.js'
import { useToast } from '../../context/ToastContext.jsx'
import Modal from '../../components/Modal.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import StatCard from '../../components/StatCard.jsx'

export default function AdminAccounts() {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')

  // Delete Bank Account State
  const [accountToDelete, setAccountToDelete] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

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

  const handlePromptDeleteAccount = (acc) => {
    setAccountToDelete(acc)
    setShowDeleteModal(true)
  }

  const handleConfirmDeleteAccount = async () => {
    if (!accountToDelete) return
    try {
      setDeleting(true)
      const res = await api.delete(`/admin/accounts/${accountToDelete.id}`)
      addToast(res.data?.message || `Bank account ${accountToDelete.accountNumber} deleted successfully`, 'success')
      setShowDeleteModal(false)
      setAccountToDelete(null)
      loadAccounts()
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete bank account', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleFreeze = async (accountId) => {
    try {
      const res = await api.patch(`/admin/accounts/${accountId}/freeze`)
      addToast(res.data?.message || 'Account status updated', 'success')
      loadAccounts()
    } catch (err) {
      addToast('Failed to toggle account freeze status', 'error')
    }
  }

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
        title="Accounts Opened & Treasury Portfolios"
        description="Inspect provisioned bank accounts, deposit vaults, balances, and delete or freeze customer accounts"
        icon={CreditCard}
        actions={
          <button className="btn btn-secondary btn-sm" onClick={loadAccounts}>
            <RefreshCw size={14} /> Refresh Directory
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
      <div className="card" style={{ padding: '16px 20px', marginBottom: 'var(--section-gap)' }}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by customer name, email or account number…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Filter:</span>
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
      </div>

      {/* Accounts Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>Loading opened accounts…</div>
        ) : filteredAccounts.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>No accounts found matching search filters.</div>
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
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((a) => {
                  const isFrozen = a.status === 'FROZEN' || a.cardFrozen
                  return (
                    <tr key={a.id}>
                      <td>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '13px' }}>{a.userName || 'Valued Client'}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{a.userEmail || '-'}</div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-indigo" style={{ fontSize: '11px' }}>
                          {a.accountType} {a.isPrimary ? '• Primary' : ''}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>
                        {a.accountNumber}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--text-main)', fontSize: '14px' }}>
                        ₹{Number(a.balance || 0).toLocaleString('en-IN')}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                        {a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${isFrozen ? 'badge-rose' : 'badge-emerald'}`}>
                          {isFrozen ? 'FROZEN' : 'ACTIVE'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            type="button"
                            onClick={() => handleToggleFreeze(a.id)}
                            className={`btn btn-sm ${isFrozen ? 'btn-emerald' : 'btn-secondary'}`}
                            title={isFrozen ? 'Unfreeze Account' : 'Freeze Account'}
                          >
                            {isFrozen ? 'Unfreeze' : 'Freeze'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePromptDeleteAccount(a)}
                            className="btn btn-rose btn-sm"
                            title="Delete Bank Account"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Bank Account Confirmation Modal (Centered) */}
      <Modal isOpen={showDeleteModal} onClose={() => !deleting && setShowDeleteModal(false)} title="Confirm Bank Account Deletion">
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <AlertTriangle size={28} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>
            Delete Account {accountToDelete?.accountNumber}?
          </h3>

          <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.6, maxWidth: 380, margin: '0 auto 20px auto' }}>
            Are you sure you want to delete bank account <strong>{accountToDelete?.accountNumber}</strong> ({accountToDelete?.accountType}) belonging to <strong>{accountToDelete?.userName}</strong>? Current balance is <strong>₹{Number(accountToDelete?.balance || 0).toLocaleString('en-IN')}</strong>. All ledger transaction logs for this account will be removed.
          </p>

          <div className="modal-actions" style={{ justifyContent: 'center', gap: 12 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-rose"
              onClick={handleConfirmDeleteAccount}
              disabled={deleting}
            >
              <Trash2 size={15} /> {deleting ? 'Deleting…' : 'Yes, Delete Account'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

