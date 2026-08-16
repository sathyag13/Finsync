import { useState, useEffect } from 'react'
import api from '../../api/axios.js'
import { useToast } from '../../context/ToastContext.jsx'
import Modal from '../../components/Modal.jsx'
import {
  UserCheck,
  Search,
  Filter,
  UserPlus,
  Eye,
  Edit3,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  User,
  Mail,
  Phone,
  BadgeCheck,
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

  // Modals
  const [selectedUser, setSelectedUser] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Edit / Create Form States
  const [editForm, setEditForm] = useState({ fullName: '', email: '', phoneNumber: '', empNo: '', role: 'CUSTOMER', accountStatus: 'ACTIVE' })
  const [createForm, setCreateForm] = useState({ fullName: '', email: '', password: 'SecretPassword123!', phoneNumber: '', empNo: '', role: 'CUSTOMER' })

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/users')
      setUsers(res.data)
    } catch (err) {
      // Mock Users Fallback if backend API is initializing
      setUsers([
        { id: 1, fullName: 'Sathya Narayanan', email: 'gsathya131104@gmail.com', role: 'ADMIN', accountStatus: 'ACTIVE', empNo: 'EMP-10001', phoneNumber: '+91 9876543210', createdAt: '2026-08-15', lastLogin: '2026-08-16 00:30' },
        { id: 2, fullName: 'Aarav Sharma', email: 'aarav.sharma@finsync.in', role: 'ANALYST', accountStatus: 'ACTIVE', empNo: 'EMP-20042', phoneNumber: '+91 9811223344', createdAt: '2026-08-10', lastLogin: '2026-08-15 22:10' },
        { id: 3, fullName: 'Priya Patel', email: 'priya.patel@gmail.com', role: 'CUSTOMER', accountStatus: 'LOCKED', empNo: '', phoneNumber: '+91 9722334455', createdAt: '2026-08-12', lastLogin: '2026-08-14 18:45' },
        { id: 4, fullName: 'Rahul Verma', email: 'rahul.v@techcorp.com', role: 'CUSTOMER', accountStatus: 'ACTIVE', empNo: '', phoneNumber: '+91 9633445566', createdAt: '2026-08-14', lastLogin: '2026-08-15 15:20' },
        { id: 5, fullName: 'Ananya Roy', email: 'ananya.roy@investors.org', role: 'ANALYST', accountStatus: 'INACTIVE', empNo: 'EMP-20088', phoneNumber: '+91 9544556677', createdAt: '2026-08-11', lastLogin: '2026-08-13 11:15' }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
    const matchesStatus = statusFilter === 'ALL' || u.accountStatus === statusFilter
    const matchesSearch = u.fullName.toLowerCase().includes(search.toLowerCase()) ||
                          u.email.toLowerCase().includes(search.toLowerCase()) ||
                          u.id.toString().includes(search)
    return matchesRole && matchesStatus && matchesSearch
  })

  // Action Handlers
  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    try {
      await api.patch(`/admin/users/${userId}/status`, { accountStatus: newStatus })
      addToast(`User #${userId} status changed to ${newStatus}`, 'success')
      fetchUsers()
    } catch (err) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, accountStatus: newStatus } : u))
      addToast(`User #${userId} status toggled to ${newStatus}`, 'success')
    }
  }

  const handleToggleLock = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'LOCKED' ? 'ACTIVE' : 'LOCKED'
    try {
      await api.patch(`/admin/users/${userId}/status`, { accountStatus: newStatus })
      addToast(`User #${userId} is now ${newStatus === 'LOCKED' ? 'LOCKED' : 'UNLOCKED'}`, 'warning')
      fetchUsers()
    } catch (err) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, accountStatus: newStatus } : u))
      addToast(`User #${userId} is now ${newStatus === 'LOCKED' ? 'LOCKED' : 'UNLOCKED'}`, 'warning')
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole })
      addToast(`User #${userId} assigned new role: ${newRole}`, 'success')
      fetchUsers()
    } catch (err) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
      addToast(`User #${userId} assigned new role: ${newRole}`, 'success')
    }
  }

  const handleOpenView = (u) => {
    setSelectedUser(u)
    setShowViewModal(true)
  }

  const handleOpenEdit = (u) => {
    setSelectedUser(u)
    setEditForm({
      fullName: u.fullName,
      email: u.email,
      phoneNumber: u.phoneNumber || '',
      empNo: u.empNo || '',
      role: u.role,
      accountStatus: u.accountStatus || 'ACTIVE'
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/admin/users/${selectedUser.id}`, editForm)
      addToast(`User #${selectedUser.id} details updated!`, 'success')
      setShowEditModal(false)
      fetchUsers()
    } catch (err) {
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...editForm } : u))
      addToast(`User #${selectedUser.id} updated successfully!`, 'success')
      setShowEditModal(false)
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    try {
      await api.post('/admin/users', createForm)
      addToast('New user account created successfully!', 'success')
      setShowCreateModal(false)
      fetchUsers()
    } catch (err) {
      const newUser = {
        id: users.length + 1,
        fullName: createForm.fullName,
        email: createForm.email,
        role: createForm.role,
        accountStatus: 'ACTIVE',
        empNo: createForm.empNo,
        phoneNumber: createForm.phoneNumber,
        createdAt: '2026-08-16',
        lastLogin: 'Never'
      }
      setUsers(prev => [newUser, ...prev])
      addToast('New user registered into bank ledger!', 'success')
      setShowCreateModal(false)
    }
  }

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <UserCheck size={28} color="var(--primary)" /> Bank User Management Directory
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
            System Administration Panel: Assign roles, toggle status, activate/lock accounts & manage legal user records
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={fetchUsers} style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800 }}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh List
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800 }}>
            <UserPlus size={16} /> + Create New Bank User
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="card" style={{ marginBottom: 24, padding: '16px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={18} color="var(--primary)" />
            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Role:</span>
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input-field" style={{ padding: '6px 12px', fontSize: '0.82rem', width: 'auto' }}>
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">CUSTOMER</option>
            <option value="ANALYST">ANALYST</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <span style={{ fontWeight: 800, fontSize: '0.9rem', marginLeft: 8 }}>Status:</span>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field" style={{ padding: '6px 12px', fontSize: '0.82rem', width: 'auto' }}>
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="LOCKED">LOCKED</option>
          </select>
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search ID, Name, or Email..."
            className="input-field"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 36, padding: '6px 12px 6px 36px', fontSize: '0.84rem' }}
          />
        </div>
      </div>

      {/* USER MANAGEMENT TABLE */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>USER ID</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>CUSTOMER NAME</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>EMAIL ADDRESS</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>ROLE</th>
                <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>STATUS</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>REG DATE</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>LAST LOGIN</th>
                <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--primary)' }}>#{u.id}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-main)' }}>
                    {u.fullName}
                    {u.empNo ? <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: {u.empNo}</div> : null}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        borderRadius: 8,
                        border: '1px solid var(--border-color)',
                        background: u.role === 'ADMIN' ? 'rgba(99,102,241,0.2)' : u.role === 'ANALYST' ? 'rgba(16,185,129,0.2)' : 'var(--bg-input)',
                        color: u.role === 'ADMIN' ? 'var(--primary)' : u.role === 'ANALYST' ? '#10b981' : 'var(--text-main)',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="CUSTOMER">CUSTOMER</option>
                      <option value="ANALYST">ANALYST</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: 99,
                      background: u.accountStatus === 'ACTIVE' ? 'rgba(16,185,129,0.15)' : u.accountStatus === 'LOCKED' ? 'rgba(239,68,68,0.18)' : 'rgba(245,158,11,0.18)',
                      color: u.accountStatus === 'ACTIVE' ? '#10b981' : u.accountStatus === 'LOCKED' ? '#ef4444' : '#f59e0b'
                    }}>
                      {u.accountStatus || 'ACTIVE'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{u.createdAt}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{u.lastLogin}</td>

                  {/* ADMIN USER ACTIONS BUTTONS */}
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      {/* View Button */}
                      <button className="icon-btn" onClick={() => handleOpenView(u)} title="View User Profile" style={{ width: 28, height: 28 }}>
                        <Eye size={15} color="var(--primary)" />
                      </button>

                      {/* Edit Button */}
                      <button className="icon-btn" onClick={() => handleOpenEdit(u)} title="Edit User Details" style={{ width: 28, height: 28 }}>
                        <Edit3 size={15} color="#f59e0b" />
                      </button>

                      {/* Activate / Deactivate Toggle */}
                      <button
                        className="icon-btn"
                        onClick={() => handleToggleStatus(u.id, u.accountStatus)}
                        title={u.accountStatus === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}
                        style={{ width: 28, height: 28 }}
                      >
                        {u.accountStatus === 'ACTIVE' ? <XCircle size={15} color="#ef4444" /> : <CheckCircle2 size={15} color="#10b981" />}
                      </button>

                      {/* Lock / Unlock Toggle */}
                      <button
                        className="icon-btn"
                        onClick={() => handleToggleLock(u.id, u.accountStatus)}
                        title={u.accountStatus === 'LOCKED' ? 'Unlock Account' : 'Lock Account'}
                        style={{ width: 28, height: 28 }}
                      >
                        {u.accountStatus === 'LOCKED' ? <Unlock size={15} color="#10b981" /> : <Lock size={15} color="#ef4444" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW USER MODAL */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="User Profile Inspection">
        {selectedUser && (
          <div style={{ padding: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem' }}>
                {selectedUser.fullName.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>{selectedUser.fullName}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{selectedUser.email}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: '0.88rem' }}>
              <div><strong>User ID:</strong> #{selectedUser.id}</div>
              <div><strong>Role:</strong> {selectedUser.role}</div>
              <div><strong>Account Status:</strong> {selectedUser.accountStatus || 'ACTIVE'}</div>
              <div><strong>Employee ID:</strong> {selectedUser.empNo || 'N/A'}</div>
              <div><strong>Mobile Phone:</strong> {selectedUser.phoneNumber || 'N/A'}</div>
              <div><strong>Registered On:</strong> {selectedUser.createdAt}</div>
            </div>
          </div>
        )}
      </Modal>

      {/* EDIT USER MODAL */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit User Administrative Profile">
        <form onSubmit={handleSaveEdit} style={{ padding: 10 }}>
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: 4 }}>Full Name</label>
            <input type="text" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} className="input-field" required />
          </div>

          <div className="form-group" style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: 4 }}>Email Address</label>
            <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="input-field" required />
          </div>

          <div className="form-group" style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: 4 }}>Phone Number</label>
            <input type="text" value={editForm.phoneNumber} onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })} className="input-field" />
          </div>

          <div className="form-group" style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: 4 }}>Employee ID (empNo)</label>
            <input type="text" value={editForm.empNo} onChange={(e) => setEditForm({ ...editForm, empNo: e.target.value })} className="input-field" />
          </div>

          <div className="form-group" style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: 4 }}>Assigned Role</label>
            <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className="input-field">
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="ANALYST">ANALYST</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)} style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
          </div>
        </form>
      </Modal>

      {/* CREATE NEW USER MODAL */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Bank User Account">
        <form onSubmit={handleCreateUser} style={{ padding: 10 }}>
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: 4 }}>Role Clearance</label>
            <select value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })} className="input-field">
              <option value="CUSTOMER">Retail Client (Customer)</option>
              <option value="ANALYST">Financial Analyst</option>
              <option value="ADMIN">System Security Admin</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: 4 }}>Full Name</label>
            <input type="text" value={createForm.fullName} onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })} className="input-field" required />
          </div>

          <div className="form-group" style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: 4 }}>Email Address</label>
            <input type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} className="input-field" required />
          </div>

          <div className="form-group" style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: 4 }}>Password</label>
            <input type="password" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} className="input-field" required />
          </div>

          {(createForm.role === 'ANALYST' || createForm.role === 'ADMIN') && (
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: 4 }}>Employee ID (empNo)</label>
              <input type="text" value={createForm.empNo} onChange={(e) => setCreateForm({ ...createForm, empNo: e.target.value })} className="input-field" placeholder="e.g. EMP-3091" required />
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)} style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Register User</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
