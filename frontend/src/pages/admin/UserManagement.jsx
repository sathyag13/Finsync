import { useState, useEffect } from 'react'
import api from '../../api/axios.js'
import { useToast } from '../../context/ToastContext.jsx'
import Modal from '../../components/Modal.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import {
  UserCheck,
  Search,
  UserPlus,
  Eye,
  Building2,
  RefreshCw,
  Trash2,
  AlertTriangle
} from 'lucide-react'

export default function UserManagement() {
  const { addToast } = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters & Search
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  // Customer Overview & Modals State
  const [selectedUserOverview, setSelectedUserOverview] = useState(null)
  const [showOverviewModal, setShowOverviewModal] = useState(false)
  const [loadingOverview, setLoadingOverview] = useState(false)

  // Delete Customer State
  const [userToDelete, setUserToDelete] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Delete Individual Bank Account State
  const [bankAccountToDelete, setBankAccountToDelete] = useState(null)
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)

  // Create Form States
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({ fullName: '', email: '', password: 'SecretPassword123!', phoneNumber: '', empNo: '', role: 'CUSTOMER' })

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/users')
      setUsers(res.data || [])
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Customer Overview loader
  const handleOpenOverview = async (user) => {
    try {
      setLoadingOverview(true)
      setShowOverviewModal(true)
      const res = await api.get(`/admin/users/${user.id}/overview`)
      setSelectedUserOverview(res.data)
    } catch (err) {
      setSelectedUserOverview(user)
    } finally {
      setLoadingOverview(false)
    }
  }

  // Action Handlers
  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    try {
      await api.patch(`/admin/users/${userId}/status`, { accountStatus: newStatus })
      addToast(`Customer #${userId} status set to ${newStatus}`, 'success')
      fetchUsers()
      if (selectedUserOverview && selectedUserOverview.id === userId) {
        setSelectedUserOverview(prev => ({ ...prev, accountStatus: newStatus }))
      }
    } catch (err) {
      addToast('Failed to update status', 'error')
    }
  }

  const handleToggleAccountFreeze = async (accountId) => {
    try {
      const res = await api.patch(`/admin/accounts/${accountId}/freeze`)
      addToast(res.data?.message || 'Account status toggled', 'success')
      fetchUsers()
      if (selectedUserOverview) {
        handleOpenOverview(selectedUserOverview)
      }
    } catch (err) {
      addToast('Failed to toggle account freeze state', 'error')
    }
  }

  const handlePromptDelete = (user) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const handleConfirmDeleteCustomer = async () => {
    if (!userToDelete) return
    try {
      setDeleting(true)
      const res = await api.delete(`/admin/users/${userToDelete.id}`)
      addToast(res.data?.message || `Customer ${userToDelete.fullName} deleted successfully`, 'success')
      setShowDeleteModal(false)
      setUserToDelete(null)
      if (showOverviewModal) setShowOverviewModal(false)
      fetchUsers()
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete customer', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const handlePromptDeleteBankAccount = (acc) => {
    setBankAccountToDelete(acc)
    setShowDeleteAccountModal(true)
  }

  const handleConfirmDeleteBankAccount = async () => {
    if (!bankAccountToDelete) return
    try {
      setDeletingAccount(true)
      const res = await api.delete(`/admin/accounts/${bankAccountToDelete.id}`)
      addToast(res.data?.message || `Bank account ${bankAccountToDelete.accountNumber} deleted successfully`, 'success')
      setShowDeleteAccountModal(false)
      setBankAccountToDelete(null)
      if (selectedUserOverview) {
        handleOpenOverview(selectedUserOverview)
      }
      fetchUsers()
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete bank account', 'error')
    } finally {
      setDeletingAccount(false)
    }
  }

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/admin/users', createForm)
      addToast(`Customer ${createForm.fullName} registered successfully!`, 'success')
      setShowCreateModal(false)
      setCreateForm({ fullName: '', email: '', password: 'SecretPassword123!', phoneNumber: '', empNo: '', role: 'CUSTOMER' })
      fetchUsers()
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create customer', 'error')
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter
    const matchStatus = statusFilter === 'ALL' || (u.accountStatus || 'ACTIVE') === statusFilter
    const matchSearch =
      search === '' ||
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.empNo?.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchStatus && matchSearch
  })

  return (
    <div>
      <PageHeader
        title="User Management & Customer Directory"
        description="Inspect registered retail clients, manage account security, freeze cards, and delete customer accounts"
        icon={UserCheck}
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary btn-sm" onClick={fetchUsers}>
              <RefreshCw size={14} /> Refresh
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
              <UserPlus size={14} /> Add Customer
            </button>
          </div>
        }
      />

      {/* Filter & Search Bar */}
      <div className="card" style={{ marginBottom: 'var(--section-gap)', padding: '16px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 14, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by name, email, or employee ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Role:</span>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ width: 140 }}>
              <option value="ALL">All Roles</option>
              <option value="CUSTOMER">Customer</option>
              <option value="ANALYST">Analyst</option>
              <option value="AUDITOR">Auditor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 130 }}>
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 700, whiteSpace: 'nowrap' }}>
            {filteredUsers.length} Customers
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>Loading customers…</div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>No customers found matching the filters.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Role & KYC</th>
                  <th>Accounts & Cards</th>
                  <th style={{ textAlign: 'right' }}>Total Balance</th>
                  <th>Activity</th>
                  <th>Last Login</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isActive = (u.accountStatus || 'ACTIVE') === 'ACTIVE'
                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, var(--primary), #4338ca)',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '12px',
                              flexShrink: 0
                            }}
                          >
                            {u.fullName ? u.fullName.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '13px' }}>{u.fullName}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span className="badge badge-indigo" style={{ fontSize: '11px' }}>{u.role}</span>
                          <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 700 }}>KYC {u.kycStatus || 'VERIFIED'}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>
                          {(u.accountsCount === 1) ? '1 Account' : `${u.accountsCount || 0} Accounts`} • {(u.cardsCount === 1) ? '1 Card' : `${u.cardsCount || 0} Cards`}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 800, fontSize: '14px', color: 'var(--primary)' }}>
                        ₹{Number(u.totalBalance || 0).toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>{u.transactionCount || 0} Txns</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${isActive ? 'badge-emerald' : 'badge-rose'}`}>
                          {u.accountStatus || 'ACTIVE'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            type="button"
                            onClick={() => handleOpenOverview(u)}
                            className="btn btn-secondary btn-sm"
                            title="View Customer Overview"
                          >
                            <Eye size={13} /> Inspect
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u.id, u.accountStatus)}
                            className={`btn btn-sm ${isActive ? 'btn-secondary' : 'btn-emerald'}`}
                            title={isActive ? 'Deactivate Customer' : 'Activate Customer'}
                          >
                            {isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePromptDelete(u)}
                            className="btn btn-rose btn-sm"
                            title="Delete Customer Account"
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

      {/* Customer Overview Modal */}
      <Modal isOpen={showOverviewModal} onClose={() => setShowOverviewModal(false)} title="Customer Overview & Ledger Profile">
        {loadingOverview ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>Loading customer overview…</div>
        ) : selectedUserOverview ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), #4338ca)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 800,
                    flexShrink: 0
                  }}
                >
                  {selectedUserOverview.fullName ? selectedUserOverview.fullName.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>{selectedUserOverview.fullName}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
                    Customer ID: #FS-USR-00{selectedUserOverview.id} • {selectedUserOverview.email}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handlePromptDelete(selectedUserOverview)}
                className="btn btn-rose btn-sm"
                title="Delete Customer Account"
              >
                <Trash2 size={14} /> Delete Account
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-3" style={{ gap: 10, marginBottom: 16 }}>
              <div style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--bg-input)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL BALANCE</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--primary)', marginTop: 2 }}>
                  ₹{Number(selectedUserOverview.totalBalance || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--bg-input)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>ACCOUNTS & CARDS</div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginTop: 2 }}>
                  {selectedUserOverview.accountsCount || 0} Acc / {selectedUserOverview.cardsCount || 0} Cards
                </div>
              </div>
              <div style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--bg-input)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>TRANSACTIONS</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-emerald)', marginTop: 2 }}>
                  {selectedUserOverview.transactionCount || 0} Operations
                </div>
              </div>
            </div>

            {/* Linked Bank Accounts */}
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Linked Deposit Accounts & Virtual Debit Cards
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(selectedUserOverview.accounts || []).map((acc) => (
                  <div key={acc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px' }}>
                        {acc.accountType} • <span style={{ fontFamily: 'monospace' }}>{acc.accountNumber}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Balance: <strong>₹{Number(acc.balance || 0).toLocaleString('en-IN')}</strong> • Card Status: <span style={{ color: acc.cardFrozen ? 'var(--accent-rose)' : 'var(--accent-emerald)', fontWeight: 700 }}>{acc.cardFrozen ? 'FROZEN' : 'ACTIVE'}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => handleToggleAccountFreeze(acc.id)}
                        className={`btn btn-sm ${acc.cardFrozen ? 'btn-emerald' : 'btn-secondary'}`}
                      >
                        {acc.cardFrozen ? 'Unfreeze Card' : 'Freeze Card'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePromptDeleteBankAccount(acc)}
                        className="btn btn-rose btn-sm"
                        title="Delete Bank Account"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowOverviewModal(false)}>
                Close
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Delete Bank Account Confirmation Modal (Centered) */}
      <Modal isOpen={showDeleteAccountModal} onClose={() => !deletingAccount && setShowDeleteAccountModal(false)} title="Confirm Bank Account Deletion">
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <AlertTriangle size={28} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>
            Delete Account {bankAccountToDelete?.accountNumber}?
          </h3>

          <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.6, maxWidth: 380, margin: '0 auto 20px auto' }}>
            Are you sure you want to delete bank account <strong>{bankAccountToDelete?.accountNumber}</strong> ({bankAccountToDelete?.accountType})? Current balance is <strong>₹{Number(bankAccountToDelete?.balance || 0).toLocaleString('en-IN')}</strong>. All ledger transaction logs for this account will be removed.
          </p>

          <div className="modal-actions" style={{ justifyContent: 'center', gap: 12 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowDeleteAccountModal(false)}
              disabled={deletingAccount}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-rose"
              onClick={handleConfirmDeleteBankAccount}
              disabled={deletingAccount}
            >
              <Trash2 size={15} /> {deletingAccount ? 'Deleting…' : 'Yes, Delete Account'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Customer Confirmation Modal (Centered on Screen) */}
      <Modal isOpen={showDeleteModal} onClose={() => !deleting && setShowDeleteModal(false)} title="Confirm Customer Account Deletion">
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <AlertTriangle size={28} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>
            Delete {userToDelete?.fullName}?
          </h3>

          <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.6, maxWidth: 380, margin: '0 auto 20px auto' }}>
            Are you sure you want to permanently delete this customer account (<strong>{userToDelete?.email}</strong>)? All linked savings/current accounts, balances, virtual debit cards, and goal vaults will be permanently wiped.
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
              onClick={handleConfirmDeleteCustomer}
              disabled={deleting}
            >
              <Trash2 size={15} /> {deleting ? 'Deleting…' : 'Yes, Delete Customer'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Customer Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Register New Customer">
        <form onSubmit={handleCreateUserSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Priya Patel"
              value={createForm.fullName}
              onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g. priya.patel@example.com"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              placeholder="e.g. +91 98765 43210"
              value={createForm.phoneNumber}
              onChange={(e) => setCreateForm({ ...createForm, phoneNumber: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Default Password</label>
            <input
              type="password"
              value={createForm.password}
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              Register Customer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
