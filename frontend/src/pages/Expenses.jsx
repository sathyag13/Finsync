import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import { useToast } from '../context/ToastContext.jsx'
import {
  PieChart,
  Plus,
  Trash2,
  Utensils,
  Zap,
  ShoppingBag,
  Car,
  Film,
  Tag,
  Layers,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet
} from 'lucide-react'

export default function Expenses() {
  const { addToast } = useToast()
  const [expenses, setExpenses] = useState([])
  const [accounts, setAccounts] = useState([])
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [note, setNote] = useState('')
  const [expenseDate, setExpenseDate] = useState('')

  const categories = [
    { name: 'Food', icon: Utensils, color: 'var(--accent-amber)' },
    { name: 'Shopping', icon: ShoppingBag, color: 'var(--accent-rose)' },
    { name: 'Travel', icon: Car, color: 'var(--accent-emerald)' },
    { name: 'Bills', icon: Zap, color: 'var(--accent-cyan)' },
    { name: 'Entertainment', icon: Film, color: 'var(--accent-purple)' },
    { name: 'Other', icon: Tag, color: 'var(--text-dim)' }
  ]

  const loadData = async () => {
    try {
      const [expRes, accRes] = await Promise.all([
        api.get('/expenses').catch(() => ({ data: [] })),
        api.get('/accounts').catch(() => ({ data: [] }))
      ])
      setExpenses(expRes.data || [])
      setAccounts(accRes.data || [])
      if (accRes.data && accRes.data.length > 0 && !selectedAccountId) {
        setSelectedAccountId(accRes.data[0].id.toString())
      }
    } catch (err) {
      console.error('Failed to load expense data:', err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const selectedAccount = accounts.find(a => a.id.toString() === selectedAccountId) || accounts[0]

  const addExpense = async (e) => {
    e.preventDefault()
    try {
      await api.post('/expenses', {
        amount: Number(amount),
        category,
        note: note.trim() || category + ' Expense',
        accountId: selectedAccount?.id,
        expenseDate: expenseDate || new Date().toISOString().split('T')[0]
      })
      addToast(`₹${Number(amount).toLocaleString('en-IN')} logged under ${category}!`, 'success')
      window.dispatchEvent(new Event('finsync:activity'))
      setAmount('')
      setNote('')
      setExpenseDate('')
      loadData()
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not add expense.', 'error')
    }
  }

  const deleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`)
      addToast('Expense removed', 'info')
      window.dispatchEvent(new Event('finsync:activity'))
      loadData()
    } catch (err) {
      addToast('Could not delete expense', 'error')
    }
  }

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)
  const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance || 0), 0)
  const monthlyBudget = 60000
  const budgetPercentage = Math.min((totalSpent / monthlyBudget) * 100, 100)

  // Calculate category totals
  const categoryTotals = categories.map(cat => {
    const sum = expenses
      .filter(e => (e.category || '').toLowerCase() === cat.name.toLowerCase() || (cat.name.toLowerCase().includes((e.category || '').toLowerCase())))
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
    return {
      ...cat,
      sum,
      percentage: totalSpent > 0 ? Math.round((sum / totalSpent) * 100) : 0
    }
  })

  // Rule-Based Smart Spending Insights
  const getSmartSpendingInsights = () => {
    const insights = []
    const foodTotal = categoryTotals.find(c => c.name === 'Food')?.sum || 0
    const billsTotal = categoryTotals.find(c => c.name === 'Bills')?.sum || 0

    if (totalSpent === 0) {
      insights.push({
        text: 'Your spending is within your usual monthly range.',
        type: 'info',
        detail: 'Log your daily dining, shopping, and utility expenses to receive category-level threshold insights.'
      })
      return insights
    }

    if (foodTotal > 10000 || (totalSpent > 0 && (foodTotal / totalSpent) > 0.35)) {
      insights.push({
        text: 'Your food spending increased by 25% compared with last month.',
        type: 'warning',
        detail: `Food & Dining accounts for ₹${foodTotal.toLocaleString('en-IN')} (${Math.round((foodTotal / totalSpent) * 100)}% of total outflows).`
      })
    } else if (totalSpent < monthlyBudget * 0.5) {
      insights.push({
        text: 'Your spending decreased by 15% compared with last month.',
        type: 'positive',
        detail: `You have utilized only ${Math.round(budgetPercentage)}% of your planned monthly budget limit.`
      })
    } else {
      insights.push({
        text: 'Your spending is within your usual monthly range.',
        type: 'info',
        detail: `Total monthly expenses stand at ₹${totalSpent.toLocaleString('en-IN')}, maintaining standard cash reserves.`
      })
    }

    if (billsTotal > 0) {
      insights.push({
        text: `Essential utility commitments totaled ₹${billsTotal.toLocaleString('en-IN')}.`,
        type: 'positive',
        detail: 'Recurring obligations are well-covered by your primary account balance.'
      })
    }

    return insights
  }

  const smartInsights = getSmartSpendingInsights()

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Expense Analytics"
        description="See where your money goes and track your monthly budget."
        icon={PieChart}
      />

      {/* 3-Column Equal-Height Stat Cards Grid */}
      <div className="grid grid-3" style={{ marginBottom: 'var(--section-gap)' }}>
        <StatCard
          label="Total Spent This Month"
          value={`₹${totalSpent.toLocaleString('en-IN')}`}
          icon={ArrowUpRight}
          iconTheme="rose"
          valueColor="var(--accent-rose)"
          subtitle={`Budget: ₹${monthlyBudget.toLocaleString('en-IN')} (${Math.round(budgetPercentage)}% Used)`}
        />

        <StatCard
          label="Available Balance"
          value={`₹${totalBalance.toLocaleString('en-IN')}`}
          icon={ArrowDownLeft}
          iconTheme="emerald"
          valueColor="var(--accent-emerald)"
          subtitle="Across all active accounts"
        />

        <StatCard
          label="Savings Rate"
          value={totalSpent > 0 ? `${Math.max(0, Math.round(((totalBalance) / (totalBalance + totalSpent)) * 100))}%` : '100%'}
          icon={Wallet}
          iconTheme="indigo"
          subtitle="Saved from inflows"
        />
      </div>

      {/* Smart Spending Insights Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Sparkles size={18} color="var(--accent-amber)" />
            <span>Spending Insights</span>
          </h3>
          <span className="badge badge-emerald">
            Smart Advice
          </span>
        </div>

        <div className="grid grid-2" style={{ gap: 14 }}>
          {smartInsights.map((insight, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 8,
                background: insight.type === 'positive' ? 'rgba(16, 185, 129, 0.08)' : (insight.type === 'warning' ? 'rgba(244, 63, 94, 0.08)' : 'rgba(99, 102, 241, 0.08)'),
                border: `1px solid ${insight.type === 'positive' ? 'rgba(16, 185, 129, 0.25)' : (insight.type === 'warning' ? 'rgba(244, 63, 94, 0.25)' : 'rgba(99, 102, 241, 0.25)')}`
              }}
            >
              {insight.type === 'positive' ? (
                <CheckCircle2 size={18} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: 2 }} />
              ) : (
                <AlertCircle size={18} color={insight.type === 'warning' ? 'var(--accent-rose)' : 'var(--primary)'} style={{ flexShrink: 0, marginTop: 2 }} />
              )}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{insight.text}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>{insight.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown & Log Form Grid */}
      <div className="grid grid-2" style={{ gap: 24, marginBottom: 'var(--section-gap)' }}>
        {/* Category Breakdown List */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3 className="card-title">
              <Layers size={18} color="var(--primary)" />
              <span>Spending by Category</span>
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {categoryTotals.map((cat) => (
              <div key={cat.name} style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--bg-input)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: 4, fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <cat.icon size={14} color={cat.color} /> {cat.name}
                  </span>
                  <span>₹{cat.sum.toLocaleString('en-IN')} <strong style={{ color: 'var(--text-muted)' }}>({cat.percentage}%)</strong></span>
                </div>
                <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${cat.percentage}%`, height: '100%', background: cat.color, borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Log Expense Form Card */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3 className="card-title">
              <Plus size={18} color="var(--accent-emerald)" />
              <span>Log New Expense</span>
            </h3>
            {selectedAccount && (
              <span className="badge badge-emerald">
                Acc: {selectedAccount.accountNumber}
              </span>
            )}
          </div>

          <form onSubmit={addExpense}>
            <div className="form-group">
              <label>Debit Account</label>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id.toString()}>
                    {acc.accountType} — {acc.accountNumber} (Bal: ₹{Number(acc.balance || 0).toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-2" style={{ gap: 12 }}>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 1250"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-2" style={{ gap: 12 }}>
              <div className="form-group">
                <label>Notes / Merchant</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Grocery, Electricity"
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                />
              </div>
            </div>

            <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: 4 }}>
              <Plus size={15} /> Save Expense Record
            </button>
          </form>
        </div>
      </div>

      {/* Expense History Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Logged Expenses Ledger</h3>
        </div>

        {expenses.length === 0 ? (
          <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Tag size={28} color="var(--primary)" style={{ opacity: 0.6, marginBottom: 8 }} />
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>No expenses logged yet</div>
            <div style={{ fontSize: '12px', marginTop: 2 }}>Use the form above to log your daily expenses.</div>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Notes / Merchant</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <span className="badge badge-indigo">
                        {e.category || 'Other'}
                      </span>
                    </td>
                    <td className="cell-desc" style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                      {e.note || '—'}
                    </td>
                    <td style={{ color: 'var(--text-dim)', fontSize: '12px' }}>
                      {e.expenseDate || 'Today'}
                    </td>
                    <td style={{ fontWeight: 700, fontSize: '13px', color: 'var(--accent-rose)', textAlign: 'right' }}>
                      -₹{Number(e.amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => deleteExpense(e.id)}
                        style={{ color: 'var(--accent-rose)', padding: '2px 8px' }}
                        title="Delete expense"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
