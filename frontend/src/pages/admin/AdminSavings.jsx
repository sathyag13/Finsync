import { useState, useEffect } from 'react'
import { PiggyBank, RefreshCw, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react'
import api from '../../api/axios.js'
import { useToast } from '../../context/ToastContext.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import StatCard from '../../components/StatCard.jsx'

export default function AdminSavings() {
  const { addToast } = useToast()
  const [apyRate, setApyRate] = useState('5.50')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadSavingsSettings = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/settings')
      if (res.data?.savingsVaultApy !== undefined) {
        setApyRate(String(res.data.savingsVaultApy))
      }
    } catch (err) {
      console.error('Failed to load APY settings:', err)
      addToast('Could not load current APY settings', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSavingsSettings()
  }, [])

  const handleUpdateRate = async (e) => {
    e.preventDefault()
    const rateNum = Number(apyRate)
    if (isNaN(rateNum) || rateNum <= 0 || rateNum > 25) {
      addToast('Please enter a valid APY rate between 0.1% and 25.0%', 'error')
      return
    }

    try {
      setSaving(true)
      await api.put('/admin/settings', { savingsVaultApy: rateNum })
      addToast(`Global Savings Vault APY successfully updated to ${rateNum}% in MySQL database!`, 'success')
      window.dispatchEvent(new Event('finsync:activity'))
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update interest rate', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Savings & Vault Product Rate Controls"
        description="System Administration: Configure real-time platform Savings Vault APY interest rates & yields saved in database"
        icon={PiggyBank}
        iconColor="var(--accent-emerald)"
        actions={
          <button className="btn btn-secondary btn-sm" onClick={loadSavingsSettings}>
            <RefreshCw size={14} /> Refresh Parameters
          </button>
        }
      />

      <div className="stat-grid">
        <StatCard
          label="Active APY Yield"
          value={`${apyRate}%`}
          icon={TrendingUp}
          iconTheme="emerald"
          valueColor="var(--accent-emerald)"
          subtitle="Applied on customer deposit vaults"
        />

        <StatCard
          label="Interest Compounding"
          value="Daily Accrual"
          icon={PiggyBank}
          iconTheme="indigo"
          subtitle="Monthly credit settlement"
        />

        <StatCard
          label="DICGC Insurance"
          value="₹5,00,000"
          icon={ShieldCheck}
          iconTheme="cyan"
          subtitle="RBI Scheduled Bank Guarantee"
        />
      </div>

      <div className="card" style={{ maxWidth: 540 }}>
        <h3 className="card-title" style={{ marginBottom: 16 }}>
          <PiggyBank size={18} color="var(--accent-emerald)" />
          <span>Savings Vault Global APY Rate</span>
        </h3>

        {loading ? (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            Loading platform parameters from MySQL database...
          </div>
        ) : (
          <form onSubmit={handleUpdateRate}>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Global APY Percentage (%)</label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="25"
                value={apyRate}
                onChange={(e) => setApyRate(e.target.value)}
                required
                style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-main)' }}
              />
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 4 }}>
                This rate is stored in platform `system_settings` and governs annual interest payouts across retail customer savings vaults.
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ width: '100%', marginTop: 8 }}
            >
              {saving ? 'Updating Database...' : 'Update Interest Rate'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
