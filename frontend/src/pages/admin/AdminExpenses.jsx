import { useState, useEffect } from 'react'
import { PieChart, RefreshCw, ArrowDownRight, ArrowUpRight, Sliders, CheckCircle2 } from 'lucide-react'
import api from '../../api/axios.js'
import { useToast } from '../../context/ToastContext.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import StatCard from '../../components/StatCard.jsx'

export default function AdminExpenses() {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [txns, setTxns] = useState([])
  const [maxLimit, setMaxLimit] = useState(500000)
  const [savingLimit, setSavingLimit] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [txRes, setRes] = await Promise.all([
        api.get('/admin/transactions').catch(() => ({ data: [] })),
        api.get('/admin/settings').catch(() => ({ data: {} }))
      ])
      setTxns(txRes.data || [])
      if (setRes.data?.maxTransactionLimit) {
        setMaxLimit(setRes.data.maxTransactionLimit)
      }
    } catch (err) {
      console.error('Failed to load outflow data:', err)
      addToast('Could not load transaction analytics', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleUpdateLimit = async (e) => {
    e.preventDefault()
    try {
      setSavingLimit(true)
      await api.put('/admin/settings', { maxTransactionLimit: Number(maxLimit) })
      addToast(`Platform maximum transaction limit updated to ₹${Number(maxLimit).toLocaleString('en-IN')}`, 'success')
      window.dispatchEvent(new Event('finsync:activity'))
    } catch (err) {
      addToast('Failed to update platform limit', 'error')
    } finally {
      setSavingLimit(false)
    }
  }

  // Calculate real outflow vs inflow
  const outflows = txns.filter(t => t.type === 'WITHDRAWAL' || t.type === 'TRANSFER_OUT' || t.type === 'TRANSFER')
  const inflows = txns.filter(t => t.type === 'DEPOSIT' || t.type === 'TRANSFER_IN')

  const totalOutflow = outflows.reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
  const totalInflow = inflows.reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
  const netFlow = totalInflow - totalOutflow

  return (
    <div>
      <PageHeader
        title="Bank Liquidity Flow & Outflow Controls"
        description="Monitor real-time system debit flows, customer withdrawals & enforce global transactional caps in database"
        icon={PieChart}
        actions={
          <button className="btn btn-secondary btn-sm" onClick={loadData}>
            <RefreshCw size={14} /> Refresh Analytics
          </button>
        }
      />

      <div className="stat-grid">
        <StatCard
          label="Total Debit Outflows"
          value={`₹${totalOutflow.toLocaleString('en-IN')}`}
          icon={ArrowDownRight}
          iconTheme="rose"
          valueColor="var(--accent-rose)"
          subtitle={`${outflows.length} Withdrawal & Transfer events`}
        />

        <StatCard
          label="Total Credit Inflows"
          value={`₹${totalInflow.toLocaleString('en-IN')}`}
          icon={ArrowUpRight}
          iconTheme="emerald"
          valueColor="var(--accent-emerald)"
          subtitle={`${inflows.length} Deposit & Inflow events`}
        />

        <StatCard
          label="Net Treasury Flow"
          value={`${netFlow >= 0 ? '+' : ''}₹${netFlow.toLocaleString('en-IN')}`}
          icon={PieChart}
          iconTheme={netFlow >= 0 ? 'emerald' : 'rose'}
          valueColor={netFlow >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)'}
          subtitle="Platform net liquidity delta"
        />
      </div>

      <div className="grid grid-2" style={{ gap: 24 }}>
        {/* Outflow Controls Card */}
        <div className="card" style={{ marginBottom: 0 }}>
          <h3 className="card-title" style={{ marginBottom: 16 }}>
            <Sliders size={18} color="var(--primary)" />
            <span>Platform Maximum Transaction Limit</span>
          </h3>

          <form onSubmit={handleUpdateLimit}>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Single Transaction Threshold (₹)</label>
              <input
                type="number"
                min="1000"
                step="5000"
                value={maxLimit}
                onChange={(e) => setMaxLimit(Number(e.target.value))}
                required
                style={{ fontWeight: 700, fontSize: '15px' }}
              />
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 4 }}>
                Any P2P transfer, QR payment or withdrawal exceeding ₹{Number(maxLimit).toLocaleString('en-IN')} is rejected by the backend.
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={savingLimit}
              style={{ width: '100%' }}
            >
              {savingLimit ? 'Saving to Database...' : 'Save Limit to System Settings'}
            </button>
          </form>
        </div>

        {/* Recent Real Outflow Ledger */}
        <div className="card" style={{ marginBottom: 0 }}>
          <h3 className="card-title" style={{ marginBottom: 16 }}>
            <ArrowDownRight size={18} color="var(--accent-rose)" />
            <span>Recent System Debit Transactions</span>
          </h3>

          {loading ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              Fetching real-time transactions...
            </div>
          ) : outflows.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No debit or withdrawal transactions recorded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {outflows.slice(0, 5).map(t => (
                <div
                  key={t.id}
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
                    <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-main)' }}>
                      {t.description || 'Transfer / Withdrawal'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      Acc: {t.accountNumber} • {t.userName || 'Customer'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--accent-rose)', fontSize: '14px' }}>
                      -₹{Number(t.amount || 0).toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                      {t.createdAt ? new Date(t.createdAt).toLocaleTimeString('en-IN') : 'Live'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
