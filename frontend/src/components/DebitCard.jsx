import { useState } from 'react'
import { Wifi, Eye, EyeOff } from 'lucide-react'

export default function DebitCard({ account, userName = 'VALUED CLIENT', index = 0 }) {
  const [showBalance, setShowBalance] = useState(true)

  if (!account) return null

  // Distinct FinSync Bank card themes per account type
  let cardThemeStyle = {
    background: 'linear-gradient(135deg, #6366f1 0%, #312e81 100%)', // FinSync Violet
    badgeBg: 'rgba(99, 102, 241, 0.35)',
    cardTypeLabel: 'SELECT VIRTUAL DEBIT'
  }

  if (account.accountType === 'SAVINGS') {
    cardThemeStyle = {
      background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)', // Emerald Savings
      badgeBg: 'rgba(16, 185, 129, 0.35)',
      cardTypeLabel: 'SAVINGS DEBIT'
    }
  } else if (account.accountType === 'CURRENT') {
    cardThemeStyle = {
      background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)', // Royal Indigo Current
      badgeBg: 'rgba(99, 102, 241, 0.35)',
      cardTypeLabel: 'BUSINESS CURRENT'
    }
  } else if (account.accountType === 'BUSINESS') {
    cardThemeStyle = {
      background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', // Titanium Obsidian
      badgeBg: 'rgba(245, 158, 11, 0.35)',
      cardTypeLabel: 'TITANIUM PRIVILEGE'
    }
  } else if (account.accountType === 'INVESTMENT') {
    cardThemeStyle = {
      background: 'linear-gradient(135deg, #083344 0%, #0284c7 100%)', // Sapphire Cyan
      badgeBg: 'rgba(34, 211, 238, 0.35)',
      cardTypeLabel: 'SAPPHIRE WEALTH'
    }
  } else if (account.accountType === 'GOLD') {
    cardThemeStyle = {
      background: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)', // Gold Bronze
      badgeBg: 'rgba(251, 191, 36, 0.35)',
      cardTypeLabel: 'GOLD PREMIER'
    }
  }

  const formattedNumber = account.accountNumber
    ? account.accountNumber.replace(/(.{4})/g, '$1 ').trim()
    : '4532 8920 1920 4491'

  return (
    <div
      className="debit-card"
      style={{
        background: cardThemeStyle.background,
        borderRadius: 16,
        padding: 24,
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 28px rgba(0,0,0,0.25)',
        aspectRatio: '1.586 / 1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '1px solid rgba(255, 255, 255, 0.15)'
      }}
    >
      {/* Background Watermark Curve */}
      <div
        style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          pointerEvents: 'none'
        }}
      />

      {/* Top Header Row: Chip & FinSync Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Gold Metallic EMV Chip */}
          <div
            style={{
              width: 42,
              height: 32,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: 'inset 0 0 4px rgba(0,0,0,0.3)'
            }}
          />
          <Wifi size={22} style={{ opacity: 0.9 }} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.05rem', fontWeight: 900, letterSpacing: '-0.3px', color: '#ffffff' }}>
            FINSYNC <span style={{ fontWeight: 600, opacity: 0.9 }}>BANK</span>
          </div>
          <div style={{ fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: cardThemeStyle.badgeBg, letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 2, display: 'inline-block' }}>
            {(account.isPrimary || index === 0) ? `PRIMARY • ${cardThemeStyle.cardTypeLabel}` : cardThemeStyle.cardTypeLabel}
          </div>
        </div>
      </div>

      {/* Middle Row: Card Number & Eye Privacy Toggle */}
      <div style={{ margin: '14px 0', zIndex: 1 }}>
        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1, opacity: 0.7, marginBottom: 4 }}>
          Virtual Debit Card Number
        </div>
        <div style={{ fontSize: '1.25rem', fontFamily: 'monospace', fontWeight: 800, letterSpacing: 2 }}>
          {formattedNumber}
        </div>
      </div>

      {/* Bottom Row: Cardholder Name & Live Balance */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 1 }}>
        <div>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1, opacity: 0.7 }}>
            Cardholder Name
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {userName}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1, opacity: 0.7 }}>
            <span>Available Balance</span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: 0 }}
              title="Toggle Balance Visibility"
            >
              {showBalance ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>
            {showBalance ? `₹${(account.balance || 0).toLocaleString('en-IN')}` : '••••••••'}
          </div>
        </div>
      </div>
    </div>
  )
}
