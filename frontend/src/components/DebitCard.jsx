import { useState } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Wifi, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react'

export default function DebitCard({ account, userName = 'VALUED CLIENT', index = 0, onToggleFreeze }) {
  const [showBalance, setShowBalance] = useState(true)

  // Mouse tilt motion values
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth Spring Physics
  const springConfig = { damping: 22, stiffness: 260, mass: 0.45 }
  const rotateX = useSpring(useTransform(y, [-150, 150], [9, -9]), springConfig)
  const rotateY = useSpring(useTransform(x, [-150, 150], [-9, 9]), springConfig)
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

  // Realistic FinSync Bank card textures and palettes
  let cardTheme = {
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 35%, #4338ca 75%, #6366f1 100%)',
    overlayMesh: 'radial-gradient(at 80% 0%, rgba(99, 102, 241, 0.4) 0px, transparent 60%)',
    badgeBg: 'rgba(255, 255, 255, 0.18)',
    tier: 'PLATINUM'
  }

  if (account.accountType === 'SAVINGS') {
    cardTheme = {
      background: 'linear-gradient(135deg, #022c22 0%, #064e3b 30%, #047857 70%, #059669 100%)',
      overlayMesh: 'radial-gradient(at 85% 10%, rgba(52, 211, 153, 0.35) 0px, transparent 65%)',
      badgeBg: 'rgba(16, 185, 129, 0.3)',
      tier: 'SAVINGS PLATINUM'
    }
  } else if (account.accountType === 'CURRENT') {
    cardTheme = {
      background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 40%, #312e81 80%, #4338ca 100%)',
      overlayMesh: 'radial-gradient(at 85% 10%, rgba(129, 140, 248, 0.35) 0px, transparent 65%)',
      badgeBg: 'rgba(99, 102, 241, 0.3)',
      tier: 'BUSINESS CURRENT'
    }
  } else if (account.accountType === 'BUSINESS') {
    cardTheme = {
      background: 'linear-gradient(135deg, #0b0f19 0%, #182234 45%, #23324d 100%)',
      overlayMesh: 'radial-gradient(at 85% 10%, rgba(245, 158, 11, 0.25) 0px, transparent 65%)',
      badgeBg: 'rgba(245, 158, 11, 0.25)',
      tier: 'TITANIUM PRIVILEGE'
    }
  } else if (account.accountType === 'INVESTMENT') {
    cardTheme = {
      background: 'linear-gradient(135deg, #041f2d 0%, #083344 35%, #0e7490 80%, #06b6d4 100%)',
      overlayMesh: 'radial-gradient(at 85% 10%, rgba(34, 211, 238, 0.35) 0px, transparent 65%)',
      badgeBg: 'rgba(34, 211, 238, 0.25)',
      tier: 'SAPPHIRE WEALTH'
    }
  }

  const rawNum = account.accountNumber || 'FS6142018953'
  const formattedNumber = `4532 •••• •••• ${rawNum.slice(-4)}`

  return (
    <div style={{ perspective: 1200, width: '100%', maxWidth: 430, margin: '0 auto' }}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          position: 'relative',
          borderRadius: 20,
          cursor: 'default',
          transformStyle: 'preserve-3d'
        }}
      >
        <div
          className="debit-card"
          style={{
            background: isFrozen ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' : cardTheme.background,
            borderRadius: 20,
            padding: '24px 26px',
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 24px 48px -12px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.2) inset',
            aspectRatio: '1.586 / 1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: isFrozen ? '2px solid rgba(239, 68, 68, 0.7)' : '1px solid rgba(255, 255, 255, 0.25)'
          }}
        >
          {/* Subtle Brushed Mesh Texture */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: isFrozen ? 'none' : cardTheme.overlayMesh,
              pointerEvents: 'none'
            }}
          />

          {/* Holographic Cursor Glare */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.05) 45%, transparent 70%)`,
              mixBlendMode: 'color-dodge',
              zIndex: 2
            }}
          />

          {/* Frozen State Ribbon */}
          {isFrozen && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(90deg, #dc2626 0%, #ef4444 50%, #dc2626 100%)',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: '0.72rem',
                fontWeight: 900,
                letterSpacing: 1.5,
                padding: '4px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                zIndex: 10,
                boxShadow: '0 2px 8px rgba(220,38,38,0.5)'
              }}
            >
              <Lock size={12} /> CARD TEMPORARILY FROZEN
            </div>
          )}

          {/* Top Row: Authentic Gold EMV Chip, Contactless Symbol & Bank Branding */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 3, marginTop: isFrozen ? 6 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Realistic Gold EMV Smart Chip */}
              <div
                style={{
                  width: 46,
                  height: 34,
                  borderRadius: 6,
                  background: isFrozen
                    ? 'linear-gradient(135deg, #9ca3af 0%, #4b5563 100%)'
                    : 'linear-gradient(135deg, #ffe082 0%, #ffca28 35%, #e09e06 70%, #b78103 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.65)',
                  boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 2px 6px rgba(0,0,0,0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* Etched Circuit Lines */}
                <div style={{ position: 'absolute', width: '100%', height: 1, background: 'rgba(0,0,0,0.25)', top: 11 }} />
                <div style={{ position: 'absolute', width: '100%', height: 1, background: 'rgba(0,0,0,0.25)', bottom: 11 }} />
                <div style={{ position: 'absolute', height: '100%', width: 1, background: 'rgba(0,0,0,0.25)', left: 16 }} />
                <div style={{ position: 'absolute', height: '100%', width: 1, background: 'rgba(0,0,0,0.25)', right: 16 }} />
                <div
                  style={{
                    width: 14,
                    height: 12,
                    borderRadius: 3,
                    border: '1px solid rgba(0,0,0,0.3)',
                    background: 'rgba(255,255,255,0.25)'
                  }}
                />
              </div>

              {/* Contactless Wave Antenna */}
              <Wifi size={24} style={{ opacity: isFrozen ? 0.35 : 0.9, transform: 'rotate(90deg)', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
            </div>

            {/* FinSync Bank Logo & Tier Pill */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.2px', color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
                FINSYNC <span style={{ fontWeight: 600, opacity: 0.9 }}>BANK</span>
              </div>
              <div
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '3px 9px',
                  borderRadius: 6,
                  background: isFrozen ? 'rgba(239, 68, 68, 0.4)' : cardTheme.badgeBg,
                  backdropFilter: 'blur(6px)',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  marginTop: 2,
                  display: 'inline-block',
                  border: '1px solid rgba(255,255,255,0.25)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                }}
              >
                {isFrozen ? 'FROZEN' : ((account.isPrimary || index === 0) ? `PRIMARY • ${cardTheme.tier}` : cardTheme.tier)}
              </div>
            </div>
          </div>

          {/* Middle Row: Embossed Plastic Card Number */}
          <div style={{ margin: '14px 0', zIndex: 3 }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1.5, opacity: 0.75, marginBottom: 3, fontWeight: 700 }}>
              Virtual Debit Card Number
            </div>
            <div
              style={{
                fontSize: '1.32rem',
                fontFamily: '"SF Mono", "Fira Code", monospace, "Courier New"',
                fontWeight: 900,
                letterSpacing: 3.5,
                opacity: isFrozen ? 0.6 : 1,
                textShadow: '0 1px 0 rgba(255,255,255,0.7), 0 -1px 1px rgba(0,0,0,0.8), 0 2px 5px rgba(0,0,0,0.5)',
                color: '#ffffff'
              }}
            >
              {formattedNumber}
            </div>
          </div>

          {/* Bottom Row: Cardholder Name, Expiry & Visa Hologram */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 3 }}>
            <div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 2 }}>
                <div>
                  <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: 1, opacity: 0.75, fontWeight: 700 }}>
                    Cardholder
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.6, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                    {userName}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: 1, opacity: 0.75, fontWeight: 700 }}>
                    Valid Thru
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 900, letterSpacing: 1, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                    08/29
                  </div>
                </div>
              </div>
            </div>

            {/* Live Balance & Visa Logo */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: 1, opacity: 0.8, fontWeight: 700 }}>
                <span>Balance</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowBalance(!showBalance)
                  }}
                  style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: 0 }}
                  title="Toggle Balance Visibility"
                >
                  {showBalance ? <EyeOff size={11} /> : <Eye size={11} />}
                </button>
              </div>

              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.35)' }}>
                {showBalance ? `₹${Number(account.balance || 0).toLocaleString('en-IN')}` : '••••••••'}
              </div>

              {/* Visa Holographic Wordmark */}
              <div
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  letterSpacing: '-1px',
                  color: '#ffffff',
                  textShadow: '0 2px 6px rgba(0,0,0,0.4)',
                  marginTop: -2
                }}
              >
                VISA
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}


