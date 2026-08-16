import { useState, useEffect } from 'react'
import api from '../../api/axios.js'
import { useToast } from '../../context/ToastContext.jsx'
import {
  TrendingUp,
  Users,
  CreditCard,
  Send,
  PieChart,
  PiggyBank,
  Download,
  Filter,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Zap,
  Activity,
  Layers
} from 'lucide-react'

export default function AnalystDashboard() {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [dateFilter, setDateFilter] = useState('30_DAYS')
  const [txTypeFilter, setTxTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // KPI Metrics
  const metrics = {
    totalCustomers: 12500,
    totalAccounts: 24850,
    activeAccounts: 22100,
    txnsToday: 1840,
    totalVolume: 84250000.0,
    avgTxValue: 45788.0,
    customerGrowthRate: '+14.8%',
    highValueCount: 42
  }

  const highValueTxns = [
    { id: 'TX-99482', user: 'Sathya Narayanan', type: 'Wire Transfer', amount: 1850000.0, status: 'SUCCESS', date: '2026-08-16 00:15:20', riskFlag: 'NORMAL' },
    { id: 'TX-99481', user: 'Aarav Sharma', type: 'SIP Mutual Fund', amount: 1420000.0, status: 'SUCCESS', date: '2026-08-15 23:40:12', riskFlag: 'NORMAL' },
    { id: 'TX-99480', user: 'TechCorp International', type: 'Corporate Payroll', amount: 4500000.0, status: 'SUCCESS', date: '2026-08-15 21:10:05', riskFlag: 'ELEVATED_VOL' },
    { id: 'TX-99479', user: 'Priya Patel', type: 'P2P Transfer', amount: 980000.0, status: 'SUCCESS', date: '2026-08-15 19:25:44', riskFlag: 'NORMAL' },
    { id: 'TX-99478', user: 'Unknown Entity', type: 'International SWIFT', amount: 2800000.0, status: 'FLAGGED', date: '2026-08-15 18:05:10', riskFlag: 'HIGH_RISK' }
  ]

  const exportReport = () => {
    addToast('Financial Analyst Analytics Report exported to CSV!', 'success')
  }

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrendingUp size={28} color="var(--primary)" /> Financial Analyst Analytics Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
            Macro transaction analytics, customer growth curves, expense trends & risk indicators (Read-Only Clearance)
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={exportReport} style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800 }}>
            <Download size={15} /> Export CSV Report
          </button>
        </div>
      </div>

      {/* KPI METRICS ROW 1 */}
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Customers</span>
            <Users size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)' }}>
            {metrics.totalCustomers.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ArrowUpRight size={14} /> {metrics.customerGrowthRate} YoY Growth
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Bank Accounts</span>
            <CreditCard size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#10b981' }}>
            {metrics.totalAccounts.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: 4 }}>
            {metrics.activeAccounts.toLocaleString()} Active (88.9%)
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Transactions Today</span>
            <Activity size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f59e0b' }}>
            {metrics.txnsToday.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ArrowUpRight size={14} /> +8.4% vs Yesterday
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Tx Volume</span>
            <Send size={18} color="#ec4899" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ec4899' }}>
            ₹8.42 Cr
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: 4 }}>
            Avg ₹{metrics.avgTxValue.toLocaleString()} / Transaction
          </div>
        </div>
      </div>

      {/* ANALYST FILTER BAR */}
      <div className="card" style={{ marginBottom: 28, padding: '16px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Filter size={18} color="var(--primary)" />
          <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>Analyst Filter Controls:</span>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="input-field" style={{ padding: '6px 12px', fontSize: '0.82rem', width: 'auto' }}>
            <option value="7_DAYS">Last 7 Days</option>
            <option value="30_DAYS">Last 30 Days</option>
            <option value="QUARTER">Last Quarter</option>
            <option value="YTD">Year to Date (YTD)</option>
          </select>

          <select value={txTypeFilter} onChange={(e) => setTxTypeFilter(e.target.value)} className="input-field" style={{ padding: '6px 12px', fontSize: '0.82rem', width: 'auto' }}>
            <option value="ALL">All Tx Types</option>
            <option value="P2P">P2P Transfers</option>
            <option value="WIRE">Wire Transfers</option>
            <option value="MUTUAL">SIP Mutual Funds</option>
            <option value="MERCHANT">Merchant POS</option>
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field" style={{ padding: '6px 12px', fontSize: '0.82rem', width: 'auto' }}>
            <option value="ALL">All Statuses</option>
            <option value="SUCCESS">Successful Only</option>
            <option value="FLAGGED">Flagged / Review</option>
          </select>
        </div>
      </div>

      {/* CHARTS GRID 1: Customer Growth & Transaction Trends */}
      <div className="grid grid-2" style={{ marginBottom: 28 }}>
        {/* Customer Growth Line SVG */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Customer Base Growth Curve</h3>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800 }}>+14.8% YoY</span>
          </div>

          <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', gap: 14, paddingTop: 20 }}>
            <svg viewBox="0 0 400 140" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <path
                d="M 0 120 Q 80 90, 160 70 T 320 30 T 400 10"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="4"
              />
              <path
                d="M 0 120 Q 80 90, 160 70 T 320 30 T 400 10 L 400 140 L 0 140 Z"
                fill="url(#indigoGradient)"
                opacity="0.25"
              />
              <defs>
                <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: 10 }}>
            <span>Q1 2025</span>
            <span>Q2 2025</span>
            <span>Q3 2025</span>
            <span>Q4 2025</span>
            <span>Q1 2026 (Current)</span>
          </div>
        </div>

        {/* Transaction Volume Trends Bar SVG */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Monthly Transaction Volume (₹ Cr)</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800 }}>Peak: ₹8.4Cr</span>
          </div>

          <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
            {[
              { month: 'Oct', vol: 4.2 },
              { month: 'Nov', vol: 5.1 },
              { month: 'Dec', vol: 6.8 },
              { month: 'Jan', vol: 7.4 },
              { month: 'Feb', vol: 8.4 }
            ].map((b, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--primary)', marginBottom: 4 }}>₹{b.vol}Cr</span>
                <div style={{ width: '100%', maxWidth: 36, height: `${(b.vol / 10) * 100}%`, background: 'linear-gradient(180deg, #10b981, #059669)', borderRadius: '6px 6px 0 0' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: 6 }}>{b.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CHARTS GRID 2: Successful vs Failed Donut & Expense Trends */}
      <div className="grid grid-2" style={{ marginBottom: 28 }}>
        {/* Successful vs Failed Transactions Donut */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 16 }}>Transaction Settlement Success Rate</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 20 }}>
            <div style={{ position: 'relative', width: 160, height: 160 }}>
              <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="18" strokeDasharray="225 238" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#ef4444" strokeWidth="18" strokeDasharray="13 238" strokeDashoffset="-225" />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#10b981' }}>98.4%</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 800 }}>SUCCESS</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.86rem' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>Successful (98.4%)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>18,145 Transactions</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.86rem' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>Failed / Rejected (1.6%)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>295 Insufficient Balance</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* High Value Transaction Indicators */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>High-Value Transaction Flags</h3>
            <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: 99, background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontWeight: 800 }}>
              42 Flagged Items
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--bg-input)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>Wire Transfer {'>'} ₹10 Lakhs</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Threshold limit triggered</div>
              </div>
              <div style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '0.9rem' }}>28 Txns</div>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--bg-input)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>International SWIFT Outflows</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Cross-border currency check</div>
              </div>
              <div style={{ fontWeight: 900, color: '#f59e0b', fontSize: '0.9rem' }}>9 Txns</div>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--bg-input)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>Rapid Successive P2P Transfers</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Frequency anomaly detection</div>
              </div>
              <div style={{ fontWeight: 900, color: '#ef4444', fontSize: '0.9rem' }}>5 Txns</div>
            </div>
          </div>
        </div>
      </div>

      {/* HIGH VALUE TRANSACTIONS TABLE */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>High-Value Transaction Analytical Ledger</h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>Read-Only Analysis</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>TX ID</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>ACCOUNT HOLDER</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>TYPE</th>
                <th style={{ padding: '12px 14px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 800 }}>AMOUNT</th>
                <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>TIMESTAMP</th>
                <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>RISK INDICATOR</th>
              </tr>
            </thead>
            <tbody>
              {highValueTxns.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--primary)' }}>{tx.id}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-main)' }}>{tx.user}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: '0.78rem', padding: '4px 10px', borderRadius: 99, background: 'rgba(99,102,241,0.12)', color: 'var(--primary)', fontWeight: 700 }}>
                      {tx.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: '#10b981' }}>
                    ₹{(tx.amount / 100000).toFixed(2)} Lakh
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{tx.date}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: 99,
                      background: tx.riskFlag === 'HIGH_RISK' ? 'rgba(239,68,68,0.18)' : tx.riskFlag === 'ELEVATED_VOL' ? 'rgba(245,158,11,0.18)' : 'rgba(16,185,129,0.15)',
                      color: tx.riskFlag === 'HIGH_RISK' ? '#ef4444' : tx.riskFlag === 'ELEVATED_VOL' ? '#f59e0b' : '#10b981'
                    }}>
                      {tx.riskFlag}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
