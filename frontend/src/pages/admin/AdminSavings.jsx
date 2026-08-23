import { useState } from 'react'
import { PiggyBank } from 'lucide-react'
import { useToast } from '../../context/ToastContext.jsx'
import PageHeader from '../../components/PageHeader.jsx'

export default function AdminSavings() {
  const { addToast } = useToast()
  const [apyRate, setApyRate] = useState('5.50')

  const handleUpdateRate = (e) => {
    e.preventDefault()
    addToast(`Savings Vault APY updated to ${apyRate}%`, 'success')
  }

  return (
    <div>
      <PageHeader
        title="Savings & Financial Product Interest Rate Management"
        description="System Administration: Configure Savings Vault APY interest rates & deposit parameters"
        icon={PiggyBank}
        iconColor="var(--accent-emerald)"
      />

      <div className="card" style={{ maxWidth: 500 }}>
        <h3 className="card-title" style={{ marginBottom: 16 }}>Savings Vault Global APY Rate</h3>
        <form onSubmit={handleUpdateRate}>
          <div className="form-group">
            <label>Global APY Percentage (%)</label>
            <input
              type="text"
              value={apyRate}
              onChange={(e) => setApyRate(e.target.value)}
              style={{ fontWeight: 700, fontSize: '15px' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
            Update Interest Rate
          </button>
        </form>
      </div>
    </div>
  )
}
