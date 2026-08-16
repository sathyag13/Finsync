import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import {
  ShieldCheck,
  Users,
  PieChart,
  TrendingUp,
  Sliders,
  CheckCircle2,
  XCircle,
  Lock,
  Search,
  ArrowUpRight,
  Sparkles,
  UserCheck,
  Eye,
  RefreshCw,
  Globe2,
  CreditCard,
  Zap,
  Coins,
  Calendar,
  Layers,
  Award,
  BadgeCheck
} from 'lucide-react'

export default function RoleBasedAccess() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Filters & Search states
  const [timePeriodFilter, setTimePeriodFilter] = useState('30_DAYS')
  const [assetCategoryFilter, setAssetCategoryFilter] = useState('ALL')
  const [assetSearchQuery, setAssetSearchQuery] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('ALL')
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [updatingUserId, setUpdatingUserId] = useState(null)

  const actualRole = user?.role || 'CUSTOMER'

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const res = await api.get('/rbac/analytics')
      setData(res.data)
    } catch (err) {
      addToast('Could not load RBAC analytics. Showing cached model.', 'warning')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (actualRole !== 'CUSTOMER') {
      fetchAnalytics()
    }
  }, [actualRole])

  const handleRoleChange = async (targetUserId, newRole) => {
    try {
      setUpdatingUserId(targetUserId)
      await api.put('/rbac/users/role', { userId: targetUserId, newRole })
      addToast(`User role updated to ${newRole} successfully!`, 'success')
      fetchAnalytics()
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update user role', 'error')
    } finally {
      setUpdatingUserId(null)
    }
  }

  // Strict Access Guard for Customer Role
  if (actualRole === 'CUSTOMER') {
    return (
      <div className="card" style={{ padding: 48, textAlign: 'center', maxWidth: 700, margin: '60px auto', borderRadius: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239,68,68,0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
          <Lock size={32} />
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: 10, color: 'var(--text-main)' }}>
          Access Restricted: Customer Account Clearance
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 28 }}>
          The Role-Based Access Control (RBAC) & Investment Analytics Portal is reserved exclusively for verified Financial Analysts and System Security Administrators. Retail customer accounts do not have clearance to access system ledgers.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ padding: '12px 24px', fontWeight: 800 }}>
          Return to Personal Banking Dashboard
        </button>
      </div>
    )
  }

  // Fallback mock data if API is initializing
  const analyticsData = data || {
    totalUsers: 12500,
    totalAccounts: 24850,
    customerCount: 11800,
    analystCount: 550,
    adminCount: 150,
    totalAssetsUnderManagement: 150000000.0,
    totalTransactionsVolume: 84250000.0,
    timePeriodReach: {
      '7_DAYS': 1840,
      '30_DAYS': 5620,
      'QUARTER': 9850,
      'YTD': 12500,
      'ALL_TIME': 24850
    },
    frequentTransactors: [
      { userId: 1, fullName: 'Sathya Narayanan', email: 'gsathya131104@gmail.com', accountNumber: 'FS-8829-4019', transactionCount: 142, totalVolume: 1850000.0, primaryType: 'P2P Transfers', tierBadge: 'VIP PLATINUM' },
      { userId: 2, fullName: 'Aarav Sharma', email: 'aarav.sharma@finsync.in', accountNumber: 'FS-9912-3021', transactionCount: 118, totalVolume: 1420000.0, primaryType: 'SIP Mutual Funds', tierBadge: 'POWER USER' },
      { userId: 3, fullName: 'Priya Patel', email: 'priya.patel@gmail.com', accountNumber: 'FS-7734-9102', transactionCount: 96, totalVolume: 980000.0, primaryType: 'Bill Payments', tierBadge: 'ACTIVE CLIENT' },
      { userId: 4, fullName: 'Rahul Verma', email: 'rahul.v@techcorp.com', accountNumber: 'FS-5512-8472', transactionCount: 84, totalVolume: 1250000.0, primaryType: 'Merchant POS', tierBadge: 'POWER USER' },
      { userId: 5, fullName: 'Ananya Roy', email: 'ananya.roy@investors.org', accountNumber: 'FS-4419-2098', transactionCount: 72, totalVolume: 2100000.0, primaryType: 'Fixed Deposit', tierBadge: 'VIP PLATINUM' }
    ],
    currencyDeposits: [
      { currencyCode: 'INR', currencyName: 'Indian Rupee', symbol: '₹', totalAmount: 123600000.0, percentageShare: 82.4, inrEquivalent: 123600000.0 },
      { currencyCode: 'USD', currencyName: 'United States Dollar', symbol: '$', totalAmount: 1880000.0, percentageShare: 10.5, inrEquivalent: 15750000.0 },
      { currencyCode: 'EUR', currencyName: 'Euro', symbol: '€', totalAmount: 780000.0, percentageShare: 4.2, inrEquivalent: 6300000.0 },
      { currencyCode: 'GBP', currencyName: 'British Pound', symbol: '£', totalAmount: 340000.0, percentageShare: 1.8, inrEquivalent: 2700000.0 },
      { currencyCode: 'AED', currencyName: 'UAE Dirham', symbol: 'د.إ', totalAmount: 1650000.0, percentageShare: 1.1, inrEquivalent: 1650000.0 }
    ],
    assetAllocations: [
      { category: 'Equities & Stocks', totalValue: 58000000.0, percentage: 38.6, color: '#6366f1' },
      { category: 'Mutual Funds (SIP)', totalValue: 39000000.0, percentage: 26.0, color: '#10b981' },
      { category: 'Fixed Deposits (FD)', totalValue: 27000000.0, percentage: 18.0, color: '#f59e0b' },
      { category: 'Sovereign Gold Bonds', totalValue: 15000000.0, percentage: 10.0, color: '#ec4899' },
      { category: 'Corporate & Govt Debt', totalValue: 11000000.0, percentage: 7.4, color: '#06b6d4' }
    ],
    yieldComparisons: [
      { assetName: 'Large Cap Growth Fund', cagrPercentage: 16.8, benchmarkPercentage: 12.4 },
      { assetName: 'Tech & Digital Index Fund', cagrPercentage: 22.4, benchmarkPercentage: 15.1 },
      { assetName: 'High-Yield Corporate Bond', cagrPercentage: 9.2, benchmarkPercentage: 7.5 },
      { assetName: 'FinSync Balanced Advantage', cagrPercentage: 14.5, benchmarkPercentage: 11.2 },
      { assetName: 'Sovereign Gold Bond 2026', cagrPercentage: 11.8, benchmarkPercentage: 8.9 }
    ],
    regionalReach: [
      { region: 'Mumbai Metro Tier-1', activeUsers: 4250, marketSharePercentage: 34.0, trend: '+14.2% QoQ' },
      { region: 'Bengaluru Tech Corridor', activeUsers: 3800, marketSharePercentage: 30.4, trend: '+18.6% QoQ' },
      { region: 'Delhi-NCR Capital Region', activeUsers: 2600, marketSharePercentage: 20.8, trend: '+11.0% QoQ' },
      { region: 'Hyderabad & Chennai Hubs', activeUsers: 1200, marketSharePercentage: 9.6, trend: '+9.4% QoQ' },
      { region: 'Global NRI Accounts', activeUsers: 650, marketSharePercentage: 5.2, trend: '+22.1% QoQ' }
    ],
    monthlyUserGrowth: [
      { month: 'Jan', totalUsers: 9200, newRegistrations: 840 },
      { month: 'Feb', totalUsers: 9950, newRegistrations: 750 },
      { month: 'Mar', totalUsers: 10700, newRegistrations: 750 },
      { month: 'Apr', totalUsers: 11600, newRegistrations: 900 },
      { month: 'May', totalUsers: 12100, newRegistrations: 500 },
      { month: 'Jun', totalUsers: 12500, newRegistrations: 400 }
    ],
    investmentPortfolios: [
      { id: 'INV-101', name: 'Bluechip Equity Growth', category: 'Equities', riskRating: 'Moderate-High', capitalInvested: 45000000.0, returnPercentage: 18.4, investorCount: 1420, status: 'ACTIVE' },
      { id: 'INV-102', name: 'FinSync Tax Saver ELSS', category: 'Mutual Funds', riskRating: 'Moderate', capitalInvested: 32000000.0, returnPercentage: 15.2, investorCount: 2150, status: 'ACTIVE' },
      { id: 'INV-103', name: 'Senior Citizen Guaranteed Yield', category: 'Fixed Income', riskRating: 'Low', capitalInvested: 28000000.0, returnPercentage: 8.75, investorCount: 980, status: 'ACTIVE' },
      { id: 'INV-104', name: 'Emerging Fintech & AI Fund', category: 'Thematic Equity', riskRating: 'High', capitalInvested: 18500000.0, returnPercentage: 24.6, investorCount: 670, status: 'OUTPERFORMING' },
      { id: 'INV-105', name: 'Green Infrastructure Bond', category: 'Fixed Income', riskRating: 'Very Low', capitalInvested: 14000000.0, returnPercentage: 7.8, investorCount: 410, status: 'STABLE' }
    ],
    userList: [
      { id: 1, fullName: 'Sathya Narayanan', email: 'gsathya131104@gmail.com', role: 'ADMIN', phoneNumber: '+91 9876543210', createdAt: '2026-08-15' },
      { id: 2, fullName: 'Aarav Sharma', email: 'aarav.sharma@finsync.in', role: 'ANALYST', phoneNumber: '+91 9811223344', createdAt: '2026-08-10' },
      { id: 3, fullName: 'Priya Patel', email: 'priya.patel@gmail.com', role: 'CUSTOMER', phoneNumber: '+91 9722334455', createdAt: '2026-08-12' },
      { id: 4, fullName: 'Rahul Verma', email: 'rahul.v@techcorp.com', role: 'CUSTOMER', phoneNumber: '+91 9633445566', createdAt: '2026-08-14' },
      { id: 5, fullName: 'Ananya Roy', email: 'ananya.roy@investors.org', role: 'ANALYST', phoneNumber: '+91 9544556677', createdAt: '2026-08-11' }
    ],
    rolePermissions: [
      { module: 'Personal Dashboard & Accounts', customer: true, analyst: true, admin: true },
      { module: 'Funds Transfer & Payments', customer: true, analyst: true, admin: true },
      { module: 'Expense Categorization & Vaults', customer: true, analyst: true, admin: true },
      { module: 'Macro Investment Asset Allocation Charts', customer: false, analyst: true, admin: true },
      { module: 'Yield Benchmark & CAGR Analysis', customer: false, analyst: true, admin: true },
      { module: 'Regional User Reach & Demographic Charts', customer: false, analyst: true, admin: true },
      { module: 'Global User Access Directory', customer: false, analyst: false, admin: true },
      { module: 'User Role Assignment & Elevation', customer: false, analyst: false, admin: true }
    ]
  }

  const activePeriodUserReach = analyticsData.timePeriodReach?.[timePeriodFilter] || 5620

  const filteredPortfolios = analyticsData.investmentPortfolios.filter(item => {
    const matchesCategory = assetCategoryFilter === 'ALL' || item.category.toUpperCase().includes(assetCategoryFilter.toUpperCase())
    const matchesSearch = item.name.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
                          item.id.toLowerCase().includes(assetSearchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const filteredUsers = (analyticsData.userList || []).filter(u => {
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter
    const matchesSearch = u.fullName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
    return matchesRole && matchesSearch
  })

  const isAnalystOrAdmin = actualRole === 'ANALYST' || actualRole === 'ADMIN'
  const isAdmin = actualRole === 'ADMIN'

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Header Section */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={28} color="var(--primary)" /> {isAdmin ? 'System Admin Control Center' : 'Financial Analyst Workspace'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
            {isAdmin ? 'Bank account ledgers, time-period user reach, frequent transactors, currency deposits & role permissions' : 'Macro portfolio asset allocations, yield benchmarks, and regional reach statistics'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={fetchAnalytics} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh Ledger
          </button>
        </div>
      </div>

      {/* Role Clearance Status Banner */}
      <div style={{
        padding: '16px 20px',
        borderRadius: 16,
        marginBottom: 28,
        background: isAdmin
          ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(67, 56, 202, 0.08))'
          : 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.08))',
        border: `1px solid ${isAdmin ? 'rgba(99, 102, 241, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: isAdmin ? 'var(--primary)' : 'var(--accent-emerald)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            fontWeight: 900
          }}>
            {isAdmin ? <ShieldCheck size={24} /> : <TrendingUp size={24} />}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
              {user?.fullName} ({actualRole})
              <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.2)', color: 'var(--text-main)', fontWeight: 800 }}>
                {user?.empNo ? `Emp ID: ${user.empNo}` : 'Verified Staff'}
              </span>
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {isAdmin && 'Full Security Admin access: View bank accounts count, time-period reach, frequent transactors, currency deposits, and role permissions.'}
              {!isAdmin && 'Financial Analyst clearance: Access investment portfolio analytics, yield benchmarks, and regional reach charts.'}
            </div>
          </div>
        </div>
      </div>

      {/* ADMIN & ANALYST KEY METRICS ROW */}
      <div className="grid grid-4" style={{ marginBottom: 28 }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Bank Accounts</div>
            <CreditCard size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)' }}>
            {analyticsData.totalAccounts.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ArrowUpRight size={14} /> Savings, Checking & Demat
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Time Period User Reach</div>
            <Calendar size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#10b981' }}>
            {activePeriodUserReach.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: 4 }}>
            Active Users ({timePeriodFilter.replace('_', ' ')})
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Frequent Transactors</div>
            <Zap size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f59e0b' }}>
            {analyticsData.frequentTransactors.length} Power Users
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: 4 }}>
            Avg 100+ Txns / Month
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Currencies Deposited</div>
            <Coins size={18} color="#ec4899" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ec4899' }}>
            5 Currencies
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ArrowUpRight size={14} /> ₹15.0Cr Total Vault Reserve
          </div>
        </div>
      </div>

      {/* TIME PERIOD USER REACH SELECTOR BAR */}
      <div className="card" style={{ marginBottom: 28, padding: '16px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Calendar size={20} color="var(--primary)" />
          <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Filter Active User Reach by Time Period:</span>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: '7_DAYS', label: 'Last 7 Days' },
            { id: '30_DAYS', label: 'Last 30 Days' },
            { id: 'QUARTER', label: 'Last Quarter' },
            { id: 'YTD', label: 'Year To Date (YTD)' },
            { id: 'ALL_TIME', label: 'All Time' }
          ].map((period) => (
            <button
              key={period.id}
              onClick={() => setTimePeriodFilter(period.id)}
              style={{
                border: 'none',
                padding: '6px 14px',
                borderRadius: 10,
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                background: timePeriodFilter === period.id ? 'linear-gradient(135deg, #6366f1, #4338ca)' : 'var(--bg-input)',
                color: timePeriodFilter === period.id ? '#ffffff' : 'var(--text-main)',
                boxShadow: timePeriodFilter === period.id ? '0 2px 8px rgba(99,102,241,0.3)' : 'none'
              }}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* FREQUENT TRANSACTORS & CURRENCY DEPOSITS MODULE (Admin Only) */}
      {isAdmin ? (
        <div className="grid grid-2" style={{ marginBottom: 32 }}>
          {/* Frequent Transactors Table */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={18} color="#f59e0b" /> Top Frequent Transactors
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>High Frequency Users</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 10px', color: 'var(--text-muted)', fontWeight: 800 }}>USER & ACCOUNT</th>
                    <th style={{ padding: '10px 10px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>TX COUNT</th>
                    <th style={{ padding: '10px 10px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 800 }}>TOTAL VOLUME</th>
                    <th style={{ padding: '10px 10px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>TIER</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.frequentTransactors.map((ft) => (
                    <tr key={ft.userId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px 10px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{ft.fullName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{ft.accountNumber} • {ft.primaryType}</div>
                      </td>
                      <td style={{ padding: '10px 10px', textAlign: 'center', fontWeight: 900, color: 'var(--primary)' }}>
                        {ft.transactionCount} txns
                      </td>
                      <td style={{ padding: '10px 10px', textAlign: 'right', fontWeight: 800, color: '#10b981' }}>
                        ₹{(ft.totalVolume / 100000).toFixed(2)} Lakh
                      </td>
                      <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, padding: '2px 8px', borderRadius: 99, background: 'rgba(245,158,11,0.18)', color: '#f59e0b' }}>
                          {ft.tierBadge}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Currencies Deposited Ledger */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Coins size={18} color="#ec4899" /> Currencies Deposited in Bank
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Multi-Currency Ledger</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {analyticsData.currencyDeposits.map((curr) => (
                <div key={curr.currencyCode} style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.78rem' }}>
                        {curr.symbol}
                      </span>
                      <div>
                        <span style={{ fontWeight: 800, fontSize: '0.88rem' }}>{curr.currencyName} ({curr.currencyCode})</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {curr.symbol}{curr.totalAmount.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                        {curr.percentageShare}% of Total Reserves
                      </div>
                    </div>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: `${curr.percentageShare}%`, height: '100%', background: 'linear-gradient(90deg, #ec4899, #6366f1)', borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* INVESTMENT ANALYSIS MODULE */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <PieChart size={24} color="var(--primary)" /> Investment Analysis & Asset Distribution
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 600 }}>
              Visibility into asset allocation, yield benchmarks, and capital management across portfolios
            </p>
          </div>
        </div>

        {/* Charts Container */}
        <div className="grid grid-2" style={{ marginBottom: 28 }}>
          {/* SVG Asset Allocation Donut Chart Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 16 }}>Asset Class Allocation Breakdown</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', gap: 20 }}>
              <div style={{ position: 'relative', width: 180, height: 180 }}>
                <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#6366f1" strokeWidth="18" strokeDasharray="92 147" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="18" strokeDasharray="62 177" strokeDashoffset="-92" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f59e0b" strokeWidth="18" strokeDasharray="43 196" strokeDashoffset="-154" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#ec4899" strokeWidth="18" strokeDasharray="24 215" strokeDashoffset="-197" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#06b6d4" strokeWidth="18" strokeDasharray="18 221" strokeDashoffset="-221" />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)' }}>₹150Cr</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>TOTAL AUM</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minWidth: 160 }}>
                {analyticsData.assetAllocations.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
                      <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.category}</span>
                    </div>
                    <span style={{ fontWeight: 900, color: item.color }}>{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SVG Yield vs Benchmark Bar Chart Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 16 }}>Yield Return vs Benchmark (1Y CAGR %)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {analyticsData.yieldComparisons.map((yieldItem, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4, fontWeight: 700 }}>
                    <span style={{ color: 'var(--text-main)' }}>{yieldItem.assetName}</span>
                    <span style={{ color: '#10b981', fontWeight: 900 }}>{yieldItem.cagrPercentage}% <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>vs {yieldItem.benchmarkPercentage}% Index</span></span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ width: `${(yieldItem.cagrPercentage / 25) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #10b981)', borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Investment Portfolios Analysis Table */}
        <div className="card">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Managed Investment Portfolios Ledger</h3>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <select
                className="input-field"
                value={assetCategoryFilter}
                onChange={(e) => setAssetCategoryFilter(e.target.value)}
                style={{ padding: '6px 12px', fontSize: '0.82rem', width: 'auto' }}
              >
                <option value="ALL">All Categories</option>
                <option value="EQUITIES">Equities</option>
                <option value="MUTUAL">Mutual Funds</option>
                <option value="FIXED">Fixed Income</option>
              </select>

              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search portfolios..."
                  className="input-field"
                  value={assetSearchQuery}
                  onChange={(e) => setAssetSearchQuery(e.target.value)}
                  style={{ paddingLeft: 30, padding: '6px 12px 6px 30px', fontSize: '0.82rem', width: 200 }}
                />
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>ASSET CODE</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>PORTFOLIO NAME</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>CATEGORY</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>RISK RATING</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 800 }}>CAPITAL INVESTED</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 800 }}>1Y CAGR RETURN</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>INVESTORS</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredPortfolios.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--primary)' }}>{item.id}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-main)' }}>{item.name}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '0.78rem', padding: '4px 10px', borderRadius: 99, background: 'rgba(99,102,241,0.12)', color: 'var(--primary)', fontWeight: 700 }}>
                        {item.category}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: item.riskRating.includes('High') ? '#ef4444' : '#10b981' }}>{item.riskRating}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800 }}>₹{(item.capitalInvested / 100000).toFixed(2)} Lakh</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: '#10b981' }}>+{item.returnPercentage}%</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 800 }}>{item.investorCount.toLocaleString()}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: 99, background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* OVERALL USER REACH & DEMOGRAPHICS MODULE */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Globe2 size={24} color="var(--accent-emerald)" /> Overall User Reach & Regional Penetration
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 600 }}>
            Platform active user distribution across metro hubs, tech corridors, and global NRI regions
          </p>
        </div>

        <div className="grid grid-2" style={{ marginBottom: 28 }}>
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 16 }}>Regional User Distribution</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {analyticsData.regionalReach.map((reach, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4, fontWeight: 700 }}>
                    <span style={{ color: 'var(--text-main)' }}>{reach.region}</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{reach.activeUsers.toLocaleString()} Users ({reach.marketSharePercentage}%)</span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: `${reach.marketSharePercentage * 2.5}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #06b6d4)', borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 16 }}>Monthly Active Reach Growth</h3>
            <div style={{ height: 160, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, paddingBottom: 10, borderBottom: '1px solid var(--border-color)' }}>
              {analyticsData.monthlyUserGrowth.map((mg, idx) => {
                const barHeightPercentage = (mg.totalUsers / 14000) * 100
                return (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 4 }}>
                      {(mg.totalUsers / 1000).toFixed(1)}k
                    </div>
                    <div style={{ width: '100%', maxWidth: 28, height: `${barHeightPercentage}%`, background: 'linear-gradient(180deg, #6366f1, #4338ca)', borderRadius: '6px 6px 0 0' }} />
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginTop: 6 }}>{mg.month}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* USER ACCESS & ROLE MANAGEMENT MODULE (Admin View Only) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Users size={24} color="var(--primary)" /> System User Directory & Role Assignment
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 600 }}>
              Admin-level control panel to view registered users and dynamically assign role access permissions
            </p>
          </div>
        </div>

        {isAdmin ? (
          <div className="card">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Registered User Directory ({filteredUsers.length})</h3>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <select
                  className="input-field"
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  style={{ padding: '6px 12px', fontSize: '0.82rem', width: 'auto' }}
                >
                  <option value="ALL">All Roles</option>
                  <option value="CUSTOMER">Customer</option>
                  <option value="ANALYST">Analyst</option>
                  <option value="ADMIN">Admin</option>
                </select>

                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search name or email..."
                    className="input-field"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    style={{ paddingLeft: 30, padding: '6px 12px 6px 30px', fontSize: '0.82rem', width: 220 }}
                  />
                </div>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>USER ID</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>FULL NAME</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>EMAIL ADDRESS</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>CURRENT ROLE</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 800 }}>PHONE NUMBER</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800 }}>ASSIGN NEW ROLE</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const isUpdating = updatingUserId === u.id
                    return (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--primary)' }}>#{u.id}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-main)' }}>{u.fullName}</td>
                        <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{u.email}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            padding: '4px 10px',
                            borderRadius: 99,
                            background: u.role === 'ADMIN' ? 'rgba(99,102,241,0.2)' : u.role === 'ANALYST' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.1)',
                            color: u.role === 'ADMIN' ? 'var(--primary)' : u.role === 'ANALYST' ? '#10b981' : 'var(--text-main)'
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{u.phoneNumber || 'N/A'}</td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <select
                            className="input-field"
                            value={u.role}
                            disabled={isUpdating}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            style={{ padding: '4px 10px', fontSize: '0.8rem', width: 'auto', display: 'inline-block' }}
                          >
                            <option value="CUSTOMER">CUSTOMER</option>
                            <option value="ANALYST">ANALYST</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: 40, textAlign: 'center', background: 'rgba(239,68,68,0.05)', border: '1px dashed #ef4444', borderRadius: 16 }}>
            <Lock size={36} color="#ef4444" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 6 }}>User Access Management Restricted</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 500, margin: '0 auto 0 auto' }}>
              Only users authenticated with <strong>ADMIN</strong> role clearance can modify access permissions and view the global user directory.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
