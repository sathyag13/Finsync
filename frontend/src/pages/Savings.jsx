import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import Modal from '../components/Modal.jsx'
import { useToast } from '../context/ToastContext.jsx'
import {
  PiggyBank,
  Plus,
  Trophy,
  Target,
  CheckCircle2,
  Trash2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react'

export default function Savings() {
  const { addToast } = useToast()
  const [goals, setGoals] = useState([])
  const [goalName, setGoalName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [contributions, setContributions] = useState({})

  // Contribution Modal State
  const [activeGoal, setActiveGoal] = useState(null)
  const [contribAmount, setContribAmount] = useState('')

  const loadGoals = () => {
    api.get('/savings-goals').then((res) => setGoals(res.data))
  }

  useEffect(() => {
    loadGoals()
  }, [])

  const createGoal = async (e) => {
    e.preventDefault()
    try {
      await api.post('/savings-goals', { goalName, targetAmount })
      addToast(`Savings Vault "${goalName}" created!`, 'success')
      setGoalName('')
      setTargetAmount('')
      loadGoals()
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not create goal.', 'error')
    }
  }

  const handleContributeSubmit = async (e) => {
    e.preventDefault()
    if (!activeGoal || !contribAmount) return
    try {
      const updated = await api.post(`/savings-goals/${activeGoal.id}/contribute`, { amount: contribAmount })
      if (updated.data && updated.data.achieved) {
        addToast(`🎉 Congratulations! You achieved your goal: "${activeGoal.goalName}"!`, 'success')
      } else {
        addToast(`Added ₹${Number(contribAmount).toLocaleString('en-IN')} to "${activeGoal.goalName}"`, 'success')
      }
      setContribAmount('')
      setActiveGoal(null)
      loadGoals()
    } catch (err) {
      addToast('Contribution failed', 'error')
    }
  }

  const deleteGoal = async (id) => {
    try {
      await api.delete(`/savings-goals/${id}`)
      addToast('Savings goal deleted', 'info')
      loadGoals()
    } catch (err) {
      addToast('Could not delete goal', 'error')
    }
  }

  const totalVaultSaved = goals.reduce((sum, g) => sum + Number(g.savedAmount), 0)
  const totalVaultTarget = goals.reduce((sum, g) => sum + Number(g.targetAmount), 0)

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
          <PiggyBank size={24} color="var(--primary)" /> Savings Goals & Automated Vaults
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Lock funds into dedicated high-yield savings goals and track your progress to financial milestones
        </p>
      </div>

      {/* Summary Header Cards */}
      <div className="grid grid-3" style={{ marginBottom: 28 }}>
        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Vault Savings</span>
            <div className="stat-icon emerald"><PiggyBank size={20} /></div>
          </div>
          <div className="stat-value">₹{totalVaultSaved.toLocaleString('en-IN')}</div>
        </div>

        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-label">Target Milestone Goal</span>
            <div className="stat-icon indigo"><Target size={20} /></div>
          </div>
          <div className="stat-value">₹{totalVaultTarget.toLocaleString('en-IN')}</div>
        </div>

        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-label">Goals Completed</span>
            <div className="stat-icon amber"><Trophy size={20} /></div>
          </div>
          <div className="stat-value">
            {goals.filter(g => g.achieved).length} of {goals.length}
          </div>
        </div>
      </div>

      {/* Create New Goal Card */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 16 }}>
          <Plus size={18} color="var(--primary)" /> Create New Savings Goal
        </h3>
        <form onSubmit={createGoal}>
          <div className="grid grid-3" style={{ gap: 16 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Goal Name</label>
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="e.g. Emergency Fund, New Laptop"
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label>Target Amount (₹)</label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="e.g. 150000"
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
                Create Vault Goal
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-2">
        {goals.map((g) => {
          const pct = Number(g.targetAmount) > 0
            ? Math.min((Number(g.savedAmount) / Number(g.targetAmount)) * 100, 100)
            : 0

          return (
            <div key={g.id} className="card" style={{ borderColor: g.achieved ? 'rgba(16,185,129,0.4)' : 'var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{g.goalName}</h3>
                    {g.achieved && (
                      <span className="badge badge-emerald">
                        <CheckCircle2 size={12} /> Achieved!
                      </span>
                    )}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
                    Target: ₹{Number(g.targetAmount).toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => deleteGoal(g.id)}
                  style={{ color: 'var(--accent-rose)', padding: '4px 8px' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                    Saved: ₹{Number(g.savedAmount).toLocaleString('en-IN')}
                  </span>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                    {Math.round(pct)}%
                  </span>
                </div>

                <div className="progress-bar-bg" style={{ height: 12 }}>
                  <div
                    className={`progress-bar-fill ${g.achieved ? 'emerald' : ''}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {!g.achieved && (
                <button
                  className="btn btn-emerald btn-sm"
                  onClick={() => setActiveGoal(g)}
                  style={{ width: '100%' }}
                >
                  <Plus size={14} /> Add Contribution
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Contribution Modal */}
      <Modal
        isOpen={Boolean(activeGoal)}
        onClose={() => setActiveGoal(null)}
        title={activeGoal ? `Contribute to "${activeGoal.goalName}"` : ''}
      >
        <form onSubmit={handleContributeSubmit}>
          <div className="form-group">
            <label>Contribution Amount (₹)</label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={contribAmount}
              onChange={(e) => setContribAmount(e.target.value)}
              placeholder="e.g. 5000"
              required
            />
          </div>

          <div className="preset-pills" style={{ marginBottom: 20 }}>
            {[1000, 5000, 10000, 25000].map((amt) => (
              <button
                key={amt}
                type="button"
                className="preset-pill"
                onClick={() => setContribAmount(amt.toString())}
              >
                +₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          <button className="btn btn-emerald" type="submit" style={{ width: '100%' }}>
            Confirm Deposit to Vault
          </button>
        </form>
      </Modal>
    </div>
  )
}
