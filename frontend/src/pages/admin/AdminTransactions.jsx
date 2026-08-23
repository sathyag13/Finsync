import { useState, useEffect } from 'react'
import { Send, RefreshCw, CheckCircle2 } from 'lucide-react'
import api from '../../api/axios.js'
import { useToast } from '../../context/ToastContext.jsx'
import PageHeader from '../../components/PageHeader.jsx'

export default function AdminTransactions() {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [txns, setTxns] = useState([])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/transactions')
      setTxns(res.data || [])
    } catch (err) {
      console.error(err)
      addToast('Could not load system transactions.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  return (
    <div>
      <PageHeader
        title="Real System Transactions Directory"
        description="Live administrative transaction ledger: Monitoring real deposits, withdrawals, and P2P transfers in database"
        icon={Send}
        actions={
          <button className="btn btn-secondary btn-sm" onClick={loadTransactions}>
            <RefreshCw size={15} /> Refresh Transactions
          </button>
        }
      />

      <div className="card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            Fetching live bank transaction ledger from database...
          </div>
        ) : txns.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            No real transactions recorded in the bank database yet.
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>TX ID</th>
                  <th>Account Holder</th>
                  <th>Account No</th>
                  <th>Type</th>
                  <th>Description / Recipient</th>
                  <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                  <th style={{ textAlign: 'right' }}>Balance After</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {txns.map((t) => {
                  const isCredit = t.type === 'DEPOSIT' || t.type === 'TRANSFER_IN'
                  return (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>#TXN-00{t.id}</td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{t.userName || 'Valued Client'}</td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{t.accountNumber}</td>
                      <td>
                        <span className={`badge ${isCredit ? 'badge-emerald' : 'badge-indigo'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-main)', fontSize: '13px' }}>
                        {t.description || (t.counterpartyAccountNumber ? `Transfer to ${t.counterpartyAccountNumber}` : 'Bank Deposit / Operation')}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: isCredit ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                        {isCredit ? '+' : '-'}₹{Number(t.amount || 0).toLocaleString('en-IN')}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '13px' }}>
                        ₹{Number(t.balanceAfter || 0).toLocaleString('en-IN')}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="badge badge-emerald">
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
