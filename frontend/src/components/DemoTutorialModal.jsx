import { useState } from 'react'
import {
  Zap,
  CreditCard,
  Send,
  PieChart,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Layers,
  Award
} from 'lucide-react'

export default function DemoTutorialModal({ isOpen, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)

  if (!isOpen) return null

  const steps = [
    {
      title: 'Welcome to FinSync Digital Banking',
      subtitle: 'Next-Generation Banking & Wealth Management Platform',
      icon: Zap,
      color: '#3b82f6',
      content: (
        <div>
          <div style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.15))',
            border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: 24,
            marginBottom: 20,
            textAlign: 'center'
          }}>
            <div className="sidebar-logo-icon" style={{ width: 56, height: 56, margin: '0 auto 14px auto', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', boxShadow: '0 6px 20px rgba(59,130,246,0.4)' }}>
              <Zap size={30} color="white" />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8, color: 'var(--text-main)' }}>
              Experience Modern Financial Control
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5 }}>
              FinSync unifies multi-currency bank accounts, instant P2P money transfers, automated expense analytics, and high-yield savings vaults in one unified interface.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" />
              <span>Zero Account Opening Fees</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" />
              <span>Real-Time Balance Updates</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" />
              <span>AES-256 JWT Encryption</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" />
              <span>24/7 Availability</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Accounts & Virtual Debit Cards',
      subtitle: 'Manage Savings, Commercial & Business Accounts',
      icon: CreditCard,
      color: '#06b6d4',
      content: (
        <div>
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
            borderRadius: 'var(--radius-lg)',
            padding: 20,
            color: 'white',
            marginBottom: 20,
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="card-chip" />
              <span style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: 1 }}>FINSYNC PLATINUM</span>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.15rem', letterSpacing: 2, marginBottom: 16 }}>
              FS88 2940 1920 4491
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <div>
                <div style={{ opacity: 0.7, fontSize: '0.65rem' }}>CARD HOLDER</div>
                <div style={{ fontWeight: 700 }}>DEMO CLIENT</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ opacity: 0.7, fontSize: '0.65rem' }}>BALANCE</div>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>₹1,48,500.00</div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            <p style={{ marginBottom: 10 }}>
              <strong style={{ color: 'var(--text-main)' }}>Key Features:</strong>
            </p>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Open new Savings or Current accounts instantly with zero paperwork.</li>
              <li>Toggle balance privacy (`Eye` / `EyeOff`) with 1 click.</li>
              <li>Filter statement transaction ledgers with instant search.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'Instant Fund Transfers & Preset Amounts',
      subtitle: 'Send Money Anywhere with Zero Fees',
      icon: Send,
      color: '#10b981',
      content: (
        <div>
          <div style={{
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: 20,
            marginBottom: 20
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <Send size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>P2P & Bank Transfers</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Atomic double-entry transaction ledgers</div>
              </div>
            </div>

            <div className="preset-pills" style={{ marginTop: 12 }}>
              <span className="preset-pill active">+₹500</span>
              <span className="preset-pill active">+₹1,000</span>
              <span className="preset-pill active">+₹5,000</span>
              <span className="preset-pill active">+₹10,000</span>
            </div>
          </div>

          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            <p style={{ marginBottom: 8 }}><strong style={{ color: 'var(--text-main)' }}>Key Capabilities:</strong></p>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Use quick preset amount buttons for 1-tap transfer filling.</li>
              <li>Instant verification receipt overlays with unique Reference IDs.</li>
              <li>Strict ACID transactional guarantees (Atomicity, Consistency, Isolation, Durability).</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'Expense Analytics & Vault Savings Goals',
      subtitle: 'Track Spending Meters & Reach Financial Milestones',
      icon: PiggyBank,
      color: '#f59e0b',
      content: (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-md)', padding: 14 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Budget Target</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-amber)', margin: '4px 0' }}>₹60,000</div>
              <div className="progress-bar-bg" style={{ height: 6 }}>
                <div className="progress-bar-fill" style={{ width: '45%', background: 'var(--accent-amber)' }} />
              </div>
            </div>

            <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 'var(--radius-md)', padding: 14 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Savings Vault APY</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-purple)', margin: '4px 0' }}>5.50% p.a.</div>
              <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>Achieved 🎉</span>
            </div>
          </div>

          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            <p style={{ marginBottom: 8 }}><strong style={{ color: 'var(--text-main)' }}>Key Features:</strong></p>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Categorize expenses (Food, Rent, Bills, Shopping, Transport).</li>
              <li>Create dedicated savings goals with percentage progress bars.</li>
              <li>Automatic milestone celebration badges when goals reach 100%.</li>
            </ul>
          </div>
        </div>
      )
    }
  ]

  const step = steps[currentStep]
  const Icon = step.icon

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 580, padding: 32 }} onClick={(e) => e.stopPropagation()}>
        {/* Header Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 99, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', fontSize: '0.78rem', fontWeight: 700 }}>
            <Sparkles size={14} />
            <span>Interactive Product Tour ({currentStep + 1} of {steps.length})</span>
          </div>

          <button className="modal-close" style={{ position: 'static' }} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Step Title & Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `rgba(${step.color === '#3b82f6' ? '59,130,246' : step.color === '#06b6d4' ? '6,182,212' : step.color === '#10b981' ? '16,185,129' : '245,158,11'}, 0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.color }}>
            <Icon size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
              {step.title}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 2 }}>
              {step.subtitle}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div style={{ marginBottom: 28 }}>
          {step.content}
        </div>

        {/* Footer Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {steps.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentStep(idx)}
                style={{
                  width: idx === currentStep ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: idx === currentStep ? 'var(--primary)' : 'rgba(255,255,255,0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {currentStep > 0 && (
              <button className="btn btn-secondary btn-sm" onClick={handlePrev}>
                <ArrowLeft size={16} /> Back
              </button>
            )}

            <button className="btn btn-primary btn-sm" onClick={handleNext}>
              {currentStep === steps.length - 1 ? (
                <>
                  <Sparkles size={16} /> Launch Live Demo Workspace
                </>
              ) : (
                <>
                  Next <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
