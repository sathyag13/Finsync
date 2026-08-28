import { useState } from 'react'
import { FileText, Download, Users, CreditCard, History, ShieldCheck, CheckCircle2 } from 'lucide-react'
import api from '../../api/axios.js'
import { useToast } from '../../context/ToastContext.jsx'
import PageHeader from '../../components/PageHeader.jsx'

export default function AdminReports() {
  const { addToast } = useToast()
  const [downloading, setDownloading] = useState(null)

  const downloadCSV = (filename, headers, rows) => {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportUsers = async () => {
    try {
      setDownloading('users')
      const res = await api.get('/admin/users')
      const users = res.data || []
      const headers = ['User ID', 'Full Name', 'Email', 'Role', 'Account Status', 'KYC Status', 'Total Balance (INR)', 'Accounts Count', 'Phone', 'Employee ID', 'Created At']
      const rows = users.map(u => [
        u.id,
        u.fullName,
        u.email,
        u.role,
        u.accountStatus,
        u.kycStatus,
        u.totalBalance || 0,
        u.accountsCount || 0,
        u.phoneNumber || '',
        u.empNo || '',
        u.createdAt || ''
      ])
      downloadCSV(`FinSync_Master_Users_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows)
      addToast(`Exported ${users.length} user records to CSV`, 'success')
    } catch (err) {
      addToast('Failed to export master users', 'error')
    } finally {
      setDownloading(null)
    }
  }

  const handleExportTransactions = async () => {
    try {
      setDownloading('txns')
      const res = await api.get('/admin/transactions')
      const txns = res.data || []
      const headers = ['Transaction ID', 'Customer Name', 'Account Number', 'Type', 'Amount (INR)', 'Balance After (INR)', 'Counterparty Account', 'Description', 'Status', 'Risk Level', 'Date']
      const rows = txns.map(t => [
        t.id,
        t.userName || 'Client',
        t.accountNumber || '',
        t.type || '',
        t.amount || 0,
        t.balanceAfter || 0,
        t.counterpartyAccountNumber || '',
        t.description || '',
        t.status || 'SUCCESS',
        t.riskLevel || 'LOW',
        t.createdAt || ''
      ])
      downloadCSV(`FinSync_Transaction_Ledger_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows)
      addToast(`Exported ${txns.length} transaction records to CSV`, 'success')
    } catch (err) {
      addToast('Failed to export transaction ledger', 'error')
    } finally {
      setDownloading(null)
    }
  }

  const handleExportAuditLogs = async () => {
    try {
      setDownloading('audit')
      const res = await api.get('/admin/audit-logs')
      const logs = res.data || []
      const headers = ['Audit ID', 'Performed By', 'User Email', 'Account Number', 'Action', 'Description', 'Amount (INR)', 'Risk Level', 'Status', 'Timestamp']
      const rows = logs.map(l => [
        l.id,
        l.performedBy || '',
        l.userEmail || '',
        l.accountNumber || '',
        l.action || '',
        l.description || '',
        l.amount || 0,
        l.riskLevel || 'LOW',
        l.status || 'SUCCESS',
        l.timestamp || ''
      ])
      downloadCSV(`FinSync_Security_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows)
      addToast(`Exported ${logs.length} audit logs to CSV`, 'success')
    } catch (err) {
      addToast('Failed to export audit logs', 'error')
    } finally {
      setDownloading(null)
    }
  }

  const handleExportAccounts = async () => {
    try {
      setDownloading('accounts')
      const res = await api.get('/admin/accounts')
      const accounts = res.data || []
      const headers = ['Account ID', 'Account Number', 'Account Holder', 'Holder Email', 'Account Type', 'Balance (INR)', 'Status', 'Card Frozen', 'Daily Limit', 'Primary', 'Created At']
      const rows = accounts.map(a => [
        a.id,
        a.accountNumber || '',
        a.userName || '',
        a.userEmail || '',
        a.accountType || '',
        a.balance || 0,
        a.status || 'ACTIVE',
        a.cardFrozen ? 'YES' : 'NO',
        a.dailyLimit || 0,
        a.isPrimary ? 'YES' : 'NO',
        a.createdAt || ''
      ])
      downloadCSV(`FinSync_Bank_Accounts_Portfolios_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows)
      addToast(`Exported ${accounts.length} bank account records to CSV`, 'success')
    } catch (err) {
      addToast('Failed to export bank accounts', 'error')
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Administrative Reports & Regulatory Compliance"
        description="Generate real-time RBI regulatory compliance exports, user directories, financial ledgers & audit records from MySQL database"
        icon={FileText}
      />

      <div className="grid grid-2" style={{ gap: 20 }}>
        {/* Report Card 1: User Directory */}
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Users size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>Full Master User Directory & Role Audit</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Customer profiles, KYC statuses & account counts • Live CSV</div>
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleExportUsers}
            disabled={downloading === 'users'}
          >
            <Download size={14} /> {downloading === 'users' ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>

        {/* Report Card 2: Transaction Ledger */}
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CreditCard size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>Core Transaction & Transfer Financial Ledger</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Real deposits, withdrawals & P2P transfers • Live CSV</div>
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleExportTransactions}
            disabled={downloading === 'txns'}
          >
            <Download size={14} /> {downloading === 'txns' ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>

        {/* Report Card 3: Security Audit Trail */}
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <History size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>Security Audit Trail & Compliance Log</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>High-risk triggers, admin actions & security events • Live CSV</div>
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleExportAuditLogs}
            disabled={downloading === 'audit'}
          >
            <Download size={14} /> {downloading === 'audit' ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>

        {/* Report Card 4: Treasury & Account Portfolios */}
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>Bank Accounts & Treasury Portfolios Report</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Account numbers, balances, card freeze statuses • Live CSV</div>
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleExportAccounts}
            disabled={downloading === 'accounts'}
          >
            <Download size={14} /> {downloading === 'accounts' ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>
    </div>
  )
}
