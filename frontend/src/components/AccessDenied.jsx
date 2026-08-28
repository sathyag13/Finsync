import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react'

export default function AccessDenied({ requiredRoles }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const getDashboardPath = () => {
    if (user?.role === 'ADMIN') return '/admin'
    return '/dashboard'
  }

  const getDashboardLabel = () => {
    if (user?.role === 'ADMIN') return 'Admin Control Center'
    return 'Customer Dashboard'
  }

  return (
    <div className="card" style={{ maxWidth: 680, margin: '60px auto', padding: 48, textAlign: 'center', borderRadius: 20, boxShadow: 'var(--shadow-md)' }}>
      <div style={{
        width: 68,
        height: 68,
        borderRadius: '50%',
        background: 'rgba(239, 68, 68, 0.15)',
        color: '#ef4444',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px auto'
      }}>
        <ShieldAlert size={34} />
      </div>

      <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: 10, color: 'var(--text-main)' }}>
        403 Access Denied: Unauthorized Clearance
      </h2>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 24, maxWidth: 520, margin: '0 auto 24px auto' }}>
        Your account role <strong>({user?.role || 'CUSTOMER'})</strong> does not have permission clearance to access this module. Required role clearance: <strong>{(requiredRoles || []).join(' or ')}</strong>.
      </p>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 99, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 32 }}>
        <Lock size={14} color="#ef4444" /> Security Audit Logged • IP Clearance Restricted
      </div>

      <div>
        <button
          onClick={() => navigate(getDashboardPath())}
          className="btn btn-primary"
          style={{ padding: '12px 28px', fontWeight: 800, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <ArrowLeft size={18} />
          <span>Return to {getDashboardLabel()}</span>
        </button>
      </div>
    </div>
  )
}
