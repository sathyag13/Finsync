import { useState } from 'react'
import { PiggyBank, Edit3 } from 'lucide-react'
import { useToast } from '../../context/ToastContext.jsx'

export default function AdminSavings() {
  const { addToast } = useToast()
  const [apyRate, setApyRate] = useState('5.50')

  const handleUpdateRate = (e) => {
    e.preventDefault()
    addToast(`Savings Vault APY updated to ${apyRate}%`, 'success')
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <PiggyBank size={28} color="#10b981" /> Savings & Financial Product Interest Rate Management
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', fontWeight: 600, marginTop: 4 }}>
          System Administration: Configure Savings Vault APY interest rates & deposit parameters
        </p>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 18 }}>Savings Vault Global APY Rate</h3>
        <form onSubmit={handleUpdateRate}>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, marginBottom: 6 }}>Global APY Percentage (%)</label>
            <input
              type="text"
              value={apyRate}
              onChange={(e) => setApyRate(e.target.value)}
              className="input-field"
              style={{ fontWeight: 800, fontSize: '1.1rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ fontWeight: 800 }}>
            Update Interest Rate
          </button>
        </form>
      </div>
    </div>
  )
}
