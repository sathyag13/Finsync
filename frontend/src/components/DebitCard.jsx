import { useState } from 'react'
import { Eye, EyeOff, Wifi } from 'lucide-react'

export default function DebitCard({ account, userName = 'VALUED CLIENT' }) {
  const [showBalance, setShowBalance] = useState(true)

  if (!account) return null

  const isBusiness = account.accountType === 'BUSINESS'
  const isCurrent = account.accountType === 'CURRENT'
  const cardClass = isBusiness ? 'debit-card business' : isCurrent ? 'debit-card secondary' : 'debit-card'

  const formattedNumber = account.accountNumber
    ? account.accountNumber.replace(/(.{4})/g, '$1 ').trim()
    : 'FS88 2940 1920 4491'

  return (
    <div className={cardClass}>
      <div className="card-bg-pattern" />

      <div className="card-top-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="card-chip" />
          <Wifi size={22} style={{ opacity: 100 }} />
        </div>
        <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: 1 }}>
          FINSYNC <span style={{ fontSize: '0.65rem', fontWeight: 600, opacity: 0.8 }}>PLATINUM</span>
        </div>
      </div>

      <div className="card-number">{formattedNumber}</div>

      <div className="card-bottom-row">
        <div>
          <div className="card-holder-label">Card Holder</div>
          <div className="card-holder-name">{userName}</div>
        </div>

        <div className="card-balance-display">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginBottom: 2 }}>
            <span className="card-holder-label">Available Balance</span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.8, display: 'flex' }}
            >
              {showBalance ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
          <div className="card-balance-val">
            {showBalance ? `₹${Number(account.balance).toLocaleString('en-IN')}` : '••••••••'}
          </div>
        </div>
      </div>
    </div>
  )
}
