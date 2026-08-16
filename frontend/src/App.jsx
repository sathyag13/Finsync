import { Routes, Route, useLocation } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicNavbar from './components/PublicNavbar.jsx'
import PublicFooter from './components/PublicFooter.jsx'
import { Sidebar, TopHeader } from './components/Navbar.jsx'
import { useAuth } from './context/AuthContext.jsx'

// Common Pages
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Accounts from './pages/Accounts.jsx'
import Transfer from './pages/Transfer.jsx'
import Expenses from './pages/Expenses.jsx'
import Savings from './pages/Savings.jsx'
import Profile from './pages/Profile.jsx'
import RoleBasedAccess from './pages/RoleBasedAccess.jsx'

// Analyst Pages
import AnalystDashboard from './pages/analyst/AnalystDashboard.jsx'
import AnalystAccounts from './pages/analyst/AnalystAccounts.jsx'
import AnalystTransactions from './pages/analyst/AnalystTransactions.jsx'
import AnalystExpenses from './pages/analyst/AnalystExpenses.jsx'
import AnalystSavings from './pages/analyst/AnalystSavings.jsx'
import AnalystCustomers from './pages/analyst/AnalystCustomers.jsx'
import AnalystReports from './pages/analyst/AnalystReports.jsx'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import UserManagement from './pages/admin/UserManagement.jsx'
import AdminAccounts from './pages/admin/AdminAccounts.jsx'
import AdminTransactions from './pages/admin/AdminTransactions.jsx'
import AdminExpenses from './pages/admin/AdminExpenses.jsx'
import AdminSavings from './pages/admin/AdminSavings.jsx'
import AdminReports from './pages/admin/AdminReports.jsx'
import AdminRisk from './pages/admin/AdminRisk.jsx'
import AdminAuditLogs from './pages/admin/AdminAuditLogs.jsx'
import AdminSettings from './pages/admin/AdminSettings.jsx'

export default function App() {
  const { user } = useAuth()
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  if (user) {
    // Authenticated App Shell with Dynamic Role Sidebar
    const defaultLanding = user.role === 'ADMIN' ? <AdminDashboard /> : user.role === 'ANALYST' ? <AnalystDashboard /> : <Dashboard />

    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-wrapper">
          <TopHeader />
          <main className="app-content">
            <Routes>
              <Route path="/" element={defaultLanding} />
              <Route path="/home" element={<Home />} />

              {/* Customer Access Routes */}
              <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ANALYST', 'ADMIN']}><Dashboard /></ProtectedRoute>} />
              <Route path="/accounts" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ANALYST', 'ADMIN']}><Accounts /></ProtectedRoute>} />
              <Route path="/transfer" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ANALYST', 'ADMIN']}><Transfer /></ProtectedRoute>} />
              <Route path="/expenses" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ANALYST', 'ADMIN']}><Expenses /></ProtectedRoute>} />
              <Route path="/savings" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ANALYST', 'ADMIN']}><Savings /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ANALYST', 'ADMIN']}><Profile /></ProtectedRoute>} />

              {/* Financial Analyst Clearance Routes */}
              <Route path="/analyst" element={<ProtectedRoute allowedRoles={['ANALYST', 'ADMIN']}><AnalystDashboard /></ProtectedRoute>} />
              <Route path="/analyst/accounts" element={<ProtectedRoute allowedRoles={['ANALYST', 'ADMIN']}><AnalystAccounts /></ProtectedRoute>} />
              <Route path="/analyst/transactions" element={<ProtectedRoute allowedRoles={['ANALYST', 'ADMIN']}><AnalystTransactions /></ProtectedRoute>} />
              <Route path="/analyst/expenses" element={<ProtectedRoute allowedRoles={['ANALYST', 'ADMIN']}><AnalystExpenses /></ProtectedRoute>} />
              <Route path="/analyst/savings" element={<ProtectedRoute allowedRoles={['ANALYST', 'ADMIN']}><AnalystSavings /></ProtectedRoute>} />
              <Route path="/analyst/customers" element={<ProtectedRoute allowedRoles={['ANALYST', 'ADMIN']}><AnalystCustomers /></ProtectedRoute>} />
              <Route path="/analyst/reports" element={<ProtectedRoute allowedRoles={['ANALYST', 'ADMIN']}><AnalystReports /></ProtectedRoute>} />

              {/* System Admin Clearance Routes */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><UserManagement /></ProtectedRoute>} />
              <Route path="/admin/accounts" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminAccounts /></ProtectedRoute>} />
              <Route path="/admin/transactions" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminTransactions /></ProtectedRoute>} />
              <Route path="/admin/expenses" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminExpenses /></ProtectedRoute>} />
              <Route path="/admin/savings" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminSavings /></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminReports /></ProtectedRoute>} />
              <Route path="/admin/risk" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminRisk /></ProtectedRoute>} />
              <Route path="/admin/audit-logs" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminAuditLogs /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminSettings /></ProtectedRoute>} />

              {/* Global Role Access Matrix */}
              <Route path="/rbac" element={<ProtectedRoute allowedRoles={['ANALYST', 'ADMIN']}><RoleBasedAccess /></ProtectedRoute>} />

              <Route path="/login" element={defaultLanding} />
              <Route path="/register" element={defaultLanding} />
            </Routes>
          </main>
        </div>
      </div>
    )
  }

  // Unauthenticated Public Portal Layout
  return (
    <div className="public-portal">
      <PublicNavbar />
      <main style={{ minHeight: '75vh', padding: isHomePage ? 0 : '36px 24px', maxWidth: isHomePage ? '100%' : 1200, margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <PublicFooter />
    </div>
  )
}
