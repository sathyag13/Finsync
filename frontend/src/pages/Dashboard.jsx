import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Send,
  Plus,
  Clock,
  Sparkles,
  PieChart,
  ShieldAlert,
  Sliders,
  History,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState([])
  const [recentTransactions, setRecentTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const accRes = await api.get('/accounts')
      const accList = accRes.data || []
      setAccounts(accList)

      if (accList.length > 0) {
        const historyPromises = accList.map(a =>
          api.get(`/accounts/${a.id}/history`).then(r => r.data || []).catch(() => [])
        )
        const allHistories = await Promise.all(historyPromises)
        const combined = allHistories.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setRecentTransactions(combined.slice(0, 5))
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  // Calculate Metrics
  const totalBalance = accounts.reduce((sum, a) => sum + (Number(a.balance) || 0), 0)
  const savingsBalance = accounts
    .filter(a => (a.accountType || '').toUpperCase().includes('SAVINGS'))
    .reduce((sum, a) => sum + (Number(a.balance) || 0), 0)
  const currentBalance = accounts
    .filter(a => (a.accountType || '').toUpperCase().includes('CURRENT') || (a.accountType || '').toUpperCase().includes('BUSINESS'))
    .reduce((sum, a) => sum + (Number(a.balance) || 0), 0)

  let monthlyIncome = 0
  let monthlyExpenses = 0
  recentTransactions.forEach(t => {
    const amt = Number(t.amount) || 0
    if (t.type.includes('IN') || t.type === 'DEPOSIT') {
      monthlyIncome += amt
    } else {
      monthlyExpenses += amt
    }
  })

  const monthlySavings = Math.max(0, monthlyIncome - monthlyExpenses)
  const activeCardsCount = accounts.filter(a => !a.cardFrozen).length

  // Rule-Based Smart Financial Insights
  const generateRuleBasedInsights = () => {
    const insights = []
    if (monthlyExpenses > 0 && monthlyIncome > 0) {
      const expenseRatio = Math.round((monthlyExpenses / monthlyIncome) * 100)
      if (expenseRatio <= 40) {
        insights.push({
          title: 'Strong Savings Efficiency',
          text: `Your spending represents only ${expenseRatio}% of this month's inflows. You are saving ${100 - expenseRatio}% of your income.`,
          type: 'positive'
        })
      } else {
        insights.push({
          title: 'Outflow Advisory',
          text: `Monthly expenses stand at ${expenseRatio}% of total income. Consider adjusting your monthly budget allocation.`,
          type: 'warning'
        })
      }
    } else if (totalBalance > 100000) {
      insights.push({
        title: 'High Liquidity Reserve',
        text: 'Your current account balance exceeds ₹1,00,000. You may allocate surplus funds to higher-yield savings vaults.',
        type: 'positive'
      })
    } else {
      insights.push({
        title: 'Balanced Cash Position',
        text: 'Your transactions and deposit reserves are operating in healthy balance.',
        type: 'positive'
      })
    }

    if (activeCardsCount < accounts.length) {
      insights.push({
        title: 'Card Security Alert',
        text: `${accounts.length - activeCardsCount} card(s) are currently FROZEN for security. You can unfreeze them in Accounts & Cards.`,
        type: 'warning'
      })
    } else {
      insights.push({
        title: 'All Debit Cards Active',
        text: `${activeCardsCount} virtual card(s) are active and protected with biometric & daily spending limits.`,
        type: 'positive'
      })
    }
    return insights
  }

  const financialInsights = generateRuleBasedInsights()

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Dashboard Overview"
        description="Welcome back! Real-time financial summary, active cards & transaction settlement."
        icon={LayoutDashboard}
        actions={
          <>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/accounts')}>
              <CreditCard size={15} /> Card Controls
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/transfer')}>
              <Send size={15} /> Pay & Transfer
            </button>
          </>
        }
      />

      {/* 4-Column Equal-Height Stat Cards Grid */}
      <div className="stat-grid">
        <StatCard
          label="Total Balance"
          value={`₹${totalBalance.toLocaleString('en-IN')}`}
          icon={Wallet}
          iconTheme="indigo"
          subtitle={`Savings: ₹${savingsBalance.toLocaleString('en-IN')}`}
        />

        <StatCard
          label="Monthly Inflow"
          value={`+₹${monthlyIncome.toLocaleString('en-IN')}`}
          icon={ArrowDownLeft}
          iconTheme="emerald"
          valueColor="var(--accent-emerald)"
          trend="+12.5%"
          trendType="up"
          subtitle="Deposits & Credits"
        />

        <StatCard
          label="Monthly Outflow"
          value={`-₹${monthlyExpenses.toLocaleString('en-IN')}`}
          icon={ArrowUpRight}
          iconTheme="rose"
          valueColor="var(--accent-rose)"
          trend="-4.2%"
          trendType="down"
          subtitle="Transfers & Charges"
        />

        <StatCard
          label="Active Virtual Cards"
          value={`${activeCardsCount} / ${accounts.length || 1}`}
          icon={CreditCard}
          iconTheme="cyan"
          subtitle={activeCardsCount === accounts.length ? 'All Cards Protected' : '1 Card Frozen'}
        />
      </div>

      {/* 2-Column Grid: Financial Snapshot & Smart Insights */}
      <div className="grid grid-2" style={{ marginBottom: 'var(--section-gap)' }}>
        {/* Financial Snapshot Card */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3 className="card-title">
              <PieChart size={18} color="var(--primary)" />
              <span>Monthly Financial Snapshot</span>
            </h3>
            <span className="badge badge-indigo">
              Net Retained: ₹{monthlySavings.toLocaleString('en-IN')}
            </span>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: 16 }}>
            Consolidated breakdown of income, operational spending, and retained reserves.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Income Utilization</span>
                <span style={{ fontWeight: 700 }}>
                  {monthlyIncome > 0 ? `${Math.min(100, Math.round((monthlyExpenses / monthlyIncome) * 100))}%` : '0%'}
                </span>
              </div>
              <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${monthlyIncome > 0 ? Math.min(100, (monthlyExpenses / monthlyIncome) * 100) : 0}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
                    borderRadius: 99
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: 'var(--bg-input)' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Savings Account Balance</div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginTop: 2 }}>₹{savingsBalance.toLocaleString('en-IN')}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Current & Business Balance</div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginTop: 2 }}>₹{currentBalance.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Rule-Based Financial Insights Card */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3 className="card-title">
              <Sparkles size={18} color="var(--accent-amber)" />
              <span>Smart Financial Insights</span>
            </h3>
            <span className="badge badge-emerald">Rule-Based</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {financialInsights.map((insight, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 14px',
                  borderRadius: 8,
                  background: insight.type === 'warning' ? 'rgba(244, 63, 94, 0.08)' : 'rgba(99, 102, 241, 0.08)',
                  border: `1px solid ${insight.type === 'warning' ? 'rgba(244, 63, 94, 0.25)' : 'rgba(99, 102, 241, 0.25)'}`
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-main)', marginBottom: 2 }}>
                  {insight.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {insight.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <History size={18} color="var(--primary)" />
            <span>Recent Settlement Activity</span>
          </h3>
          <Link to="/accounts" className="btn btn-secondary btn-sm">
            View All Statement History
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            No recent transactions found. Open an account and initiate a transfer to view records.
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Transaction Type</th>
                  <th>Description</th>
                  <th>Date & Time</th>
                  <th>Risk Score</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((t) => {
                  const isCredit = t.type.includes('IN') || t.type === 'DEPOSIT'
                  const risk = t.riskLevel || 'LOW'
                  return (
                    <tr key={t.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className={`stat-icon ${isCredit ? 'emerald' : 'rose'}`} style={{ width: 28, height: 28, borderRadius: 6 }}>
                            {isCredit ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                          </div>
                          <span style={{ fontWeight: 600, fontSize: '13px' }}>
                            {t.type.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="cell-desc" style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                        {t.description || 'Electronic Transfer'}
                      </td>
                      <td style={{ color: 'var(--text-dim)', fontSize: '12px' }}>
                        {new Date(t.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 4,
                            background: risk === 'HIGH' ? 'rgba(244, 63, 94, 0.15)' : (risk === 'MEDIUM' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)'),
                            color: risk === 'HIGH' ? 'var(--accent-rose)' : (risk === 'MEDIUM' ? 'var(--accent-amber)' : 'var(--accent-emerald)')
                          }}
                        >
                          {risk}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="badge badge-emerald">
                          {t.status || 'SUCCESS'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={`badge ${isCredit ? 'badge-in' : 'badge-out'}`} style={{ fontSize: '13px', fontWeight: 700 }}>
                          {isCredit ? '+' : '-'} ₹{Number(t.amount || 0).toLocaleString('en-IN')}
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
