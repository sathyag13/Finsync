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
  RefreshCw
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

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/admin/users', createForm)
      addToast(`Customer ${createForm.fullName} registered successfully!`, 'success')
      setShowCreateModal(false)
      setCreateForm({ fullName: '', email: '', password: 'SecretPassword123!', phoneNumber: '', empNo: '', role: 'CUSTOMER' })
      fetchUsers()
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create user', 'error')
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
    const matchesStatus = statusFilter === 'ALL' || u.accountStatus === statusFilter
    const matchesSearch =
      (u.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.phoneNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.id || '').toString().includes(search)
    return matchesRole && matchesStatus && matchesSearch
  })

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Customer Directory & Overview"
        description="Inspect client portfolios, virtual debit cards, balances, account freeze controls & activity status"
        icon={UserCheck}
        actions={
          <>
            <button className="btn btn-secondary btn-sm" onClick={fetchUsers}>
              <RefreshCw size={15} /> Refresh
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
              <UserPlus size={15} /> Register Client
            </button>
          </>
        }
      />

      {/* Filter & Search Bar Card */}
      <div className="card" style={{ padding: 16, marginBottom: 'var(--section-gap)' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by customer name, email, phone or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
            <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ minWidth: 140 }}>
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="LOCKED">LOCKED</option>
            </select>

            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ minWidth: 140 }}>
              <option value="ALL">All Roles</option>
              <option value="CUSTOMER">CUSTOMERS ONLY</option>
              <option value="ADMIN">ADMINS ONLY</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Directory Table Card */}
      <div className="card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>Loading customer directory…</div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>No customers matching your search criteria.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Client / Email</th>
                  <th>Role & KYC</th>
                  <th>Accounts & Cards</th>
                  <th style={{ textAlign: 'right' }}>Total Balance</th>
                  <th>Txns Count</th>
                  <th>Last Session</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isActive = u.accountStatus === 'ACTIVE'
                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: 'var(--primary)',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border-color)' }}>
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

            {/* Owned Accounts List & Freeze Toggles */}
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Building2 size={15} color="var(--primary)" /> Owned Bank Accounts & Cards
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {(selectedUserOverview.accounts || []).map((acc) => (
                <div
                  key={acc.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{acc.accountType} ({acc.accountNumber})</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Balance: ₹{Number(acc.balance || 0).toLocaleString('en-IN')} • Limit: ₹{Number(acc.dailyLimit || 50000).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className={`badge ${acc.status === 'FROZEN' ? 'badge-rose' : 'badge-emerald'}`} style={{ fontSize: '11px' }}>
                      {acc.status || 'ACTIVE'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleAccountFreeze(acc.id)}
                      className="btn btn-secondary btn-sm"
                    >
                      {acc.status === 'FROZEN' ? 'Unfreeze' : 'Freeze'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setShowOverviewModal(false)} className="btn btn-primary" style={{ width: '100%' }}>
              Close Overview
            </button>
          </div>
        ) : null}
      </Modal>

      {/* Register Customer Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Register New Customer / Client">
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
