import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import Modal from '../components/Modal.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import { useToast } from '../context/ToastContext.jsx'
import {
  PiggyBank,
  Plus,
  Trophy,
  Target,
  Trash2,
  Sparkles,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react'

export default function Savings() {
  const { addToast } = useToast()
  const [goals, setGoals] = useState([])
  const [accounts, setAccounts] = useState([])
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [goalName, setGoalName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [activeGoal, setActiveGoal] = useState(null)
  const [contribAmount, setContribAmount] = useState('')

  const loadData = async () => {
    try {
      const [goalsRes, accRes] = await Promise.all([
        api.get('/savings-goals').catch(() => ({ data: [] })),
        api.get('/accounts').catch(() => ({ data: [] }))
      ])
      setGoals(goalsRes.data || [])
      setAccounts(accRes.data || [])
      if (accRes.data && accRes.data.length > 0 && !selectedAccountId) {
        setSelectedAccountId(accRes.data[0].id.toString())
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const selectedAccount = accounts.find(a => a.id.toString() === selectedAccountId) || accounts[0]

  const createGoal = async (e) => {
    e.preventDefault()
    try {
      await api.post('/savings-goals', { goalName, targetAmount: Number(targetAmount) })
      addToast(`Savings Vault "${goalName}" created!`, 'success')
      setGoalName('')
      setTargetAmount('')
      loadData()
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not create goal.', 'error')
    }
  }

  const handleContributeSubmit = async (e) => {
    e.preventDefault()
    if (!activeGoal || !contribAmount) return
    try {
      const updated = await api.post(`/savings-goals/${activeGoal.id}/contribute`, {
        amount: Number(contribAmount),
        accountId: selectedAccount?.id
      })
      if (updated.data && updated.data.achieved) {
        addToast(`🎉 Goal achieved! ₹${Number(contribAmount).toLocaleString('en-IN')} allocated for "${activeGoal.goalName}"!`, 'success')
      } else {
        addToast(`₹${Number(contribAmount).toLocaleString('en-IN')} allocated to "${activeGoal.goalName}"`, 'success')
      }
      setContribAmount('')
      setActiveGoal(null)
      loadData()
    } catch (err) {
      addToast(err.response?.data?.message || 'Insufficient balance', 'error')
    }
  }

  const deleteGoal = async (id) => {
    try {
      await api.delete(`/savings-goals/${id}`)
      addToast('Savings goal removed', 'info')
      loadData()
    } catch (err) {
      addToast('Could not delete goal', 'error')
    }
  }

  const totalVaultSaved = goals.reduce((sum, g) => sum + Number(g.savedAmount || 0), 0)
  const totalVaultTarget = goals.reduce((sum, g) => sum + Number(g.targetAmount || 0), 0)
  const completedGoals = goals.filter(g => g.achieved).length

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Savings Vaults & Goal Tracking"
        description="Earn 5.50% APY return by locking liquid funds into customized savings targets"
        icon={PiggyBank}
      />

      {/* 3-Column Equal-Height Stat Cards Grid */}
      <div className="grid grid-3" style={{ marginBottom: 'var(--section-gap)' }}>
        <StatCard
          label="Total Funds in Vaults"
          value={`₹${totalVaultSaved.toLocaleString('en-IN')}`}
          icon={PiggyBank}
          iconTheme="emerald"
          valueColor="var(--accent-emerald)"
          trend="+5.50% APY"
          trendType="up"
          subtitle="Compounding Yield"
        />

        <StatCard
          label="Aggregate Target Value"
          value={`₹${totalVaultTarget.toLocaleString('en-IN')}`}
          icon={Target}
          iconTheme="indigo"
          subtitle={`Across ${goals.length} Active Targets`}
        />

        <StatCard
          label="Completed Goals"
          value={`${completedGoals} / ${goals.length}`}
          icon={Trophy}
          iconTheme="amber"
          subtitle="Achieved Milestones"
        />
      </div>

      {/* 2-Column Grid: Create Goal & Goals List */}
      <div className="grid grid-1-2" style={{ gap: 24, marginBottom: 'var(--section-gap)' }}>
        {/* Left Column: Create Goal Form */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3 className="card-title">
              <Plus size={18} color="var(--accent-emerald)" />
              <span>Open New Vault</span>
            </h3>
          </div>

          <form onSubmit={createGoal}>
            <div className="form-group">
              <label>Target Goal Name</label>
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="e.g. Emergency Fund, New Car"
                required
              />
            </div>

            <div className="form-group">
              <label>Target Amount (₹)</label>
              <input
                type="number"
                min="1000"
                step="500"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="e.g. 50000"
                required
              />
            </div>

            <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: 8 }}>
              <Plus size={15} /> Create Savings Vault
            </button>
          </form>
        </div>

        {/* Right Column: Savings Goals Grid */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3 className="card-title">
              <Target size={18} color="var(--primary)" />
              <span>Active Vault Targets</span>
            </h3>
            <span className="badge badge-indigo">{goals.length} Active</span>
          </div>

          {goals.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No savings vaults created yet. Open your first goal on the left!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {goals.map((g) => {
                const percent = Math.min(100, Math.round((Number(g.savedAmount || 0) / Number(g.targetAmount || 1)) * 100))
                return (
                  <div
                    key={g.id}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 8,
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{g.goalName}</span>
                        {g.achieved && <span className="badge badge-emerald">Achieved 🎉</span>}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setActiveGoal(g)}
                        >
                          <Plus size={13} /> Allocate
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => deleteGoal(g.id)}
                          style={{ color: 'var(--accent-rose)', padding: '2px 8px' }}
                          title="Remove Goal"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: 6 }}>
                      <span>Saved: <strong style={{ color: 'var(--accent-emerald)' }}>₹{Number(g.savedAmount || 0).toLocaleString('en-IN')}</strong></span>
                      <span>Target: ₹{Number(g.targetAmount || 0).toLocaleString('en-IN')} ({percent}%)</span>
                    </div>

                    <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, height: '100%', background: percent >= 100 ? 'var(--accent-emerald)' : 'var(--primary)', borderRadius: 99 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Allocate Contribution Modal */}
      <Modal isOpen={activeGoal !== null} onClose={() => setActiveGoal(null)} title={`Allocate Funds to "${activeGoal?.goalName}"`}>
        <form onSubmit={handleContributeSubmit}>
          <div className="form-group">
            <label>Select Debit Account</label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id.toString()}>
                  {acc.accountType} — {acc.accountNumber} (Available: ₹{Number(acc.balance || 0).toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Allocation Amount (₹)</label>
            <input
              type="number"
              min="100"
              step="100"
              value={contribAmount}
              onChange={(e) => setContribAmount(e.target.value)}
              placeholder="e.g. 5000"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setActiveGoal(null)}>
              Cancel
            </button>
            <button className="btn btn-emerald" type="submit">
              Confirm Allocation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
