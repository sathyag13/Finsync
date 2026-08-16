import { Settings, ShieldCheck } from 'lucide-react'
import { useToast } from '../../context/ToastContext.jsx'

export default function AdminSettings() {
  const { addToast } = useToast()

  const handleSaveSettings = (e) => {
    e.preventDefault()
    addToast('Platform security parameters updated successfully!', 'success')
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Settings size={28} color="var(--primary)" /> Platform System Configuration & Security
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
          Manage global bank system settings, JWT token expiration, maintenance mode & database backup daemons
        </p>
      </div>

      <div className="card" style={{ maxWidth: 680 }}>
        <form onSubmit={handleSaveSettings}>
          <div className="form-group" style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: 6 }}>JWT Token Lifetime Expiration</label>
            <select className="input-field">
              <option value="24h">24 Hours (Default Bank Policy)</option>
              <option value="12h">12 Hours (High Security)</option>
              <option value="8h">8 Hours (Strict Corporate)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: 6 }}>Failed Password Max Lockout Threshold</label>
            <input type="number" defaultValue={3} className="input-field" />
          </div>

          <div style={{ padding: '14px 18px', borderRadius: 12, background: 'var(--bg-input)', border: '1px solid var(--border-color)', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 800 }}>Maintenance Mode Window</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Restrict retail client sign-ins during system upgrades</div>
            </div>
            <input type="checkbox" style={{ width: 18, height: 18, cursor: 'pointer' }} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ fontWeight: 800 }}>
            Save Platform Settings
          </button>
        </form>
      </div>
    </div>
  )
}
