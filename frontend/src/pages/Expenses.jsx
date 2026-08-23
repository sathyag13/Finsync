import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import { useToast } from '../context/ToastContext.jsx'
import {
  PieChart,
  Plus,
  Trash2,
  Utensils,
  Home,
  Zap,
  ShoppingBag,
  Car,
  Film,
  Tag,
  DollarSign,
  Calendar,
  Layers
} from 'lucide-react'

export default function Expenses() {
  const { addToast } = useToast()
  const [expenses, setExpenses] = useState([])
  const [accounts, setAccounts] = useState([])
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food & Dining')
  const [note, setNote] = useState('')
  const [expenseDate, setExpenseDate] = useState('')

  const categories = [
    { name: 'Food & Dining', icon: Utensils, color: '#f59e0b' },
    { name: 'Rent & Housing', icon: Home, color: '#6366f1' },
    { name: 'Utilities & Bills', icon: Zap, color: '#06b6d4' },
    { name: 'Shopping', icon: ShoppingBag, color: '#ec4899' },
    { name: 'Transport & Gas', icon: Car, color: '#10b981' },
    { name: 'Entertainment', icon: Film, color: '#8b5cf6' }
  ]

  const loadData = async () => {
    try {
      const [expRes, accRes] = await Promise.all([
        api.get('/expenses').catch(() => ({ data: [] })),
        api.get('/accounts').catch(() => ({ data: [] }))
      ])
      setExpenses(expRes.data)
      setAccounts(accRes.data)
      if (accRes.data.length > 0 && !selectedAccountId) {
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

  const addExpense = async (e) => {
    e.preventDefault()
    try {
      await api.post('/expenses', {
        amount,
        category,
        note,
        accountId: selectedAccount?.id,
        expenseDate: expenseDate || new Date().toISOString().split('T')[0]
      })
      addToast(`Expense logged! Charged to ${selectedAccount?.accountType || 'Bank'} Account (${selectedAccount?.accountNumber || ''})`, 'success')
      setAmount(''); setNote(''); setExpenseDate('')
      loadData()
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not add expense.', 'error')
    }
  }

  const deleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`)
      addToast('Expense removed', 'info')
      load()
    } catch (err) {
      addToast('Could not delete expense', 'error')
    }
  }

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const monthlyBudget = 60000
  const budgetPercentage = Math.min((totalSpent / monthlyBudget) * 100, 100)

  // Calculate category totals
  const categoryTotals = categories.map(cat => {
    const sum = expenses
      .filter(e => (e.category || '').toLowerCase() === cat.name.toLowerCase() || (cat.name.includes(e.category)))
      .reduce((acc, curr) => acc + Number(curr.amount), 0)
    return {
      ...cat,
      sum,
      percentage: totalSpent > 0 ? Math.round((sum / totalSpent) * 100) : 0
    }
  })

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <PieChart size={26} color="var(--axis-maroon)" /> Axis Expense Analytics & Budgeting
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', fontWeight: 600 }}>
          Categorize monthly spending, monitor budget thresholds, and manage your cash flow
        </p>
      </div>

      {/* Budget Meter Summary Cards */}
      <div className="grid grid-3" style={{ marginBottom: 28 }}>
        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>Total Monthly Outflow</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            ₹{totalSpent.toLocaleString('en-IN')}
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: 4 }}>
              <span>Monthly Target Limit: ₹{monthlyBudget.toLocaleString('en-IN')}</span>
              <span>{Math.round(budgetPercentage)}% Used</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${budgetPercentage}%`, background: budgetPercentage > 85 ? 'var(--accent-rose)' : 'var(--primary)' }} />
            </div>
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 className="card-title" style={{ fontSize: '1rem', marginBottom: 14 }}>
            <Layers size={16} color="var(--accent-cyan)" /> Category Spending Breakdown
          </h3>
          <div className="grid grid-2" style={{ gap: 16 }}>
            {categoryTotals.slice(0, 4).map((cat) => (
              <div key={cat.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4, fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <cat.icon size={14} color={cat.color} /> {cat.name}
                  </span>
                  <span>₹{cat.sum.toLocaleString('en-IN')} ({cat.percentage}%)</span>
                </div>
                <div className="progress-bar-bg" style={{ height: 6 }}>
                  <div className="progress-bar-fill" style={{ width: `${cat.percentage}%`, background: cat.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log Expense Form Card */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h3 className="card-title" style={{ margin: 0 }}>
            <Plus size={18} color="var(--accent-emerald)" /> Log New Expense
          </h3>
          {selectedAccount && (
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.12)', padding: '4px 12px', borderRadius: 99 }}>
              Available Balance: ₹{Number(selectedAccount.balance).toLocaleString('en-IN')}
            </span>
          )}
        </div>
        <form onSubmit={addExpense}>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 800, fontSize: '0.9rem', display: 'block', marginBottom: 6 }}>Select Source Bank Account</label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              style={{ padding: '12px 16px', borderRadius: 10, border: '1.5px solid var(--primary)', fontWeight: 700, fontSize: '0.95rem', width: '100%' }}
            >
              {accounts.length > 0 ? (
                accounts.map((acc) => (
                  <option key={acc.id} value={acc.id.toString()}>
                    {acc.accountType} ACCOUNT — {acc.accountNumber} (Available: ₹{Number(acc.balance).toLocaleString('en-IN')})
                  </option>
                ))
              ) : (
                <>
                  <option value="1">SAVINGS ACCOUNT — FS4992819900 (Available: ₹10,06,000)</option>
                  <option value="2">BUSINESS CURRENT ACCOUNT — FS1477464724 (Available: ₹1,000)</option>
                </>
              )}
            </select>
          </div>

          <div className="grid grid-4" style={{ marginBottom: 16 }}>
            <div className="form-group" style={{ margin: 0 }}>
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

            <div className="form-group" style={{ margin: 0 }}>
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label>Notes / Vendor</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Zomato, Rent bill"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label>Date</label>
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
              />
            </div>
          </div>

          <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
            <Plus size={16} /> Add Expense Entry
          </button>
        </form>
      </div>

      {/* Expense History Table */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 16 }}>
          Logged Expenses History
        </h3>

        {expenses.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>No expenses logged yet.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Notes</th>
                  <th>Date</th>
                  <th>Amount (₹)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <span className="badge badge-indigo">
                        {e.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      {e.note || '—'}
                    </td>
                    <td style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>
                      {e.expenseDate}
                    </td>
                    <td style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--accent-rose)' }}>
                      ₹{Number(e.amount).toLocaleString('en-IN')}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => deleteExpense(e.id)}
                        style={{ color: 'var(--accent-rose)', padding: '4px 8px' }}
                      >
                        <Trash2 size={14} />
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
