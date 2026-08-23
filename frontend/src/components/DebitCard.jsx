import { useState } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Wifi, Eye, EyeOff, Lock, RotateCw, ShieldCheck } from 'lucide-react'

export default function DebitCard({ account, userName = 'VALUED CLIENT', index = 0, onToggleFreeze }) {
  const [showBalance, setShowBalance] = useState(true)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showCvv, setShowCvv] = useState(false)

  // Mouse tilt motion values
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth Spring Physics
  const springConfig = { damping: 20, stiffness: 250, mass: 0.5 }
  const rotateX = useSpring(useTransform(y, [-150, 150], [12, -12]), springConfig)
  const rotateY = useSpring(useTransform(x, [-150, 150], [-12, 12]), springConfig)
  const glareX = useTransform(x, [-150, 150], ['0%', '100%'])
  const glareY = useTransform(y, [-150, 150], ['0%', '100%'])

  if (!account) return null

  const isFrozen = !!account.cardFrozen

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  // Distinct FinSync Bank card themes per account type
  let cardThemeStyle = {
    background: 'linear-gradient(135deg, #6366f1 0%, #312e81 100%)', // FinSync Violet
    badgeBg: 'rgba(99, 102, 241, 0.35)',
    cardTypeLabel: 'SELECT VIRTUAL DEBIT'
  }

  if (account.accountType === 'SAVINGS') {
    cardThemeStyle = {
      background: 'linear-gradient(135deg, #064e3b 0%, #047857 60%, #10b981 100%)', // Emerald Savings
      badgeBg: 'rgba(16, 185, 129, 0.35)',
      cardTypeLabel: 'SAVINGS DEBIT'
    }
  } else if (account.accountType === 'CURRENT') {
    cardThemeStyle = {
      background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 60%, #6366f1 100%)', // Royal Indigo Current
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

  const rawNum = account.accountNumber || 'FS6142018953'
  const formattedNumber = `4532 •••• •••• ${rawNum.slice(-4)}`

  return (
    <div style={{ perspective: 1000, width: '100%', maxWidth: 420, margin: '0 auto' }}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          position: 'relative',
          borderRadius: 18,
          cursor: 'pointer'
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', damping: 20, stiffness: 140 }}
      >
        {/* ================= CARD FRONT ================= */}
        <div
          className="debit-card"
          style={{
            background: isFrozen ? 'linear-gradient(135deg, #374151 0%, #111827 100%)' : cardThemeStyle.background,
            borderRadius: 18,
            padding: '24px 26px',
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 16px 36px rgba(0,0,0,0.3)',
            aspectRatio: '1.586 / 1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: isFrozen ? '2px solid rgba(239, 68, 68, 0.6)' : '1.5px solid rgba(255, 255, 255, 0.2)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          {/* Holographic Glare Overlay */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.35) 0%, transparent 65%)`,
              mixBlendMode: 'overlay',
              zIndex: 2
            }}
          />

          {/* Frozen Badge Banner */}
          {isFrozen && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                background: '#ef4444',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: '0.72rem',
                fontWeight: 900,
                letterSpacing: 1.5,
                padding: '3px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                zIndex: 10
              }}
            >
              <Lock size={12} /> CARD IS TEMPORARILY FROZEN
            </div>
          )}

          {/* Top Header Row: Chip & FinSync Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 3, marginTop: isFrozen ? 8 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Gold Metallic EMV Chip */}
              <div
                style={{
                  width: 44,
                  height: 32,
                  borderRadius: 6,
                  background: isFrozen ? 'linear-gradient(135deg, #9ca3af 0%, #4b5563 100%)' : 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: 'inset 0 0 5px rgba(0,0,0,0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  padding: '2px 4px'
                }}
              >
                <div style={{ width: '100%', height: 1, background: 'rgba(0,0,0,0.2)' }} />
                <div style={{ width: '100%', height: 1, background: 'rgba(0,0,0,0.2)' }} />
              </div>
              <Wifi size={22} style={{ opacity: isFrozen ? 0.4 : 0.9, transform: 'rotate(90deg)' }} />
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, letterSpacing: '-0.3px', color: '#ffffff' }}>
                FINSYNC <span style={{ fontWeight: 600, opacity: 0.9 }}>BANK</span>
              </div>
              <div style={{ fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: isFrozen ? 'rgba(239, 68, 68, 0.35)' : cardThemeStyle.badgeBg, letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 2, display: 'inline-block' }}>
                {isFrozen ? 'FROZEN CARD' : ((account.isPrimary || index === 0) ? `PRIMARY • ${cardThemeStyle.cardTypeLabel}` : cardThemeStyle.cardTypeLabel)}
              </div>
            </div>
          </div>

          {/* Middle Row: Card Number */}
          <div style={{ margin: '12px 0', zIndex: 3 }}>
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: 1.2, opacity: 0.8, marginBottom: 4 }}>
              Virtual Debit Card Number
            </div>
            <div style={{ fontSize: '1.25rem', fontFamily: 'monospace', fontWeight: 900, letterSpacing: 3, opacity: isFrozen ? 0.6 : 1, textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
              {formattedNumber}
            </div>
          </div>

          {/* Bottom Row: Cardholder Name & Live Balance */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 3 }}>
            <div>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1, opacity: 0.8 }}>
                Cardholder Name
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {userName}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1, opacity: 0.8 }}>
                <span>Available Balance</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowBalance(!showBalance)
                  }}
                  style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: 0 }}
                  title="Toggle Balance Visibility"
                >
                  {showBalance ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              </div>
              <div style={{ fontSize: '1.18rem', fontWeight: 900, color: '#ffffff' }}>
                {showBalance ? `₹${Number(account.balance || 0).toLocaleString('en-IN')}` : '••••••••'}
              </div>
            </div>
          </div>
        </div>

        {/* ================= CARD BACK ================= */}
        <div
          className="debit-card"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: 18,
            padding: '24px',
            color: '#ffffff',
            boxShadow: '0 16px 36px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          {/* Magnetic Stripe */}
          <div style={{ position: 'absolute', top: 20, left: 0, right: 0, height: 40, background: '#090d16', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)' }} />

          <div style={{ marginTop: 44, display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>
            <span>24/7 Helpline: 1800-425-1199</span>
            <span>Authorized Signature</span>
          </div>

          {/* CVV Panel */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: 8 }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Security Code:</span>
            <div style={{ flex: 1, background: '#ffffff', color: '#0f172a', padding: '4px 10px', borderRadius: 4, fontFamily: 'monospace', fontWeight: 900, textAlign: 'right', fontSize: '13px' }}>
              {showCvv ? (account.cvv || '882') : '•••'}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setShowCvv(!showCvv)
              }}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
            >
              {showCvv ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.3 }}>
            Issued by FinSync Bank under RBI License. Use of this virtual debit card is subject to all terms of the client cardholder agreement.
          </div>
        </div>
      </motion.div>

      {/* Flip Button Toggle Below Card */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
        <button
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '12px',
            fontWeight: 700,
            padding: '6px 14px',
            borderRadius: 8,
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <RotateCw size={13} style={{ transform: isFlipped ? 'rotate(180deg)' : 'none', transition: 'transform 0.4s ease' }} />
          <span>{isFlipped ? 'Show Card Front' : 'Flip to View CVV'}</span>
        </button>
      </div>
    </div>
  )
}

