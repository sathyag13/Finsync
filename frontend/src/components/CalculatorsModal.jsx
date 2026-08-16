import { useState } from 'react'
import Modal from './Modal.jsx'
import { Calculator, Percent, DollarSign, ArrowRight, RefreshCw } from 'lucide-react'

export default function CalculatorsModal({ isOpen, onClose, initialTab = 'EMI' }) {
  const [activeTab, setActiveTab] = useState(initialTab)

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(500000)
  const [tenureYears, setTenureYears] = useState(5)
  const [interestRate, setInterestRate] = useState(8.5)

  // FD Calculator State
  const [fdDeposit, setFdDeposit] = useState(100000)
  const [fdRate, setFdRate] = useState(7.25)
  const [fdYears, setFdYears] = useState(3)

  // SIP Calculator State
  const [sipMonthly, setSipMonthly] = useState(5000)
  const [sipReturnRate, setSipReturnRate] = useState(12)
  const [sipYears, setSipYears] = useState(5)

  // Math Calculations
  // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const calculateEMI = () => {
    const p = Number(loanAmount)
    const r = Number(interestRate) / 12 / 100
    const n = Number(tenureYears) * 12
    if (!p || !r || !n) return 0
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    return Math.round(emi)
  }

  // FD Formula: A = P * (1 + r/n)^(n*t)
  const calculateFD = () => {
    const p = Number(fdDeposit)
    const r = Number(fdRate) / 100
    const t = Number(fdYears)
    const maturity = p * Math.pow(1 + r / 4, 4 * t)
    return Math.round(maturity)
  }

  // SIP Formula: M = P * [((1 + i)^n - 1) / i] * (1 + i)
  const calculateSIP = () => {
    const p = Number(sipMonthly)
    const i = Number(sipReturnRate) / 12 / 100
    const n = Number(sipYears) * 12
    if (!p || !i || !n) return 0
    const value = p * (((Math.pow(1 + i, n) - 1) / i) * (1 + i))
    return Math.round(value)
  }

  const emiVal = calculateEMI()
  const fdVal = calculateFD()
  const sipVal = calculateSIP()

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="FinSync Interactive Financial Calculators">
      <div>
        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--border-color)', paddingBottom: 12 }}>
          {['EMI', 'FD', 'SIP'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontWeight: 800, flex: 1 }}
            >
              {tab === 'EMI' && 'Personal/Home EMI'}
              {tab === 'FD' && 'Fixed Deposit (FD)'}
              {tab === 'SIP' && 'SIP Wealth Planner'}
            </button>
          ))}
        </div>

        {/* Tab 1: EMI Calculator */}
        {activeTab === 'EMI' && (
          <div>
            <div className="form-group">
              <label>Loan Amount (₹): ₹{Number(loanAmount).toLocaleString('en-IN')}</label>
              <input
                type="range"
                min="50000"
                max="5000000"
                step="50000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
              />
            </div>

            <div className="grid grid-2" style={{ gap: 16 }}>
              <div className="form-group">
                <label>Tenure (Years): {tenureYears} Years</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Interest Rate (% p.a.): {interestRate}%</label>
                <input
                  type="number"
                  step="0.1"
                  min="5"
                  max="20"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                />
              </div>
            </div>

            <div style={{ background: 'rgba(30, 90, 168, 0.08)', border: '1px solid rgba(30, 90, 168, 0.2)', borderRadius: 16, padding: 20, marginTop: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--bank-text-muted)', fontWeight: 700 }}>ESTIMATED MONTHLY EMI</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--bank-navy)', margin: '4px 0' }}>
                ₹{emiVal.toLocaleString('en-IN')} / mo
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--bank-text-muted)' }}>
                Total Repayment: ₹{(emiVal * tenureYears * 12).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: FD Calculator */}
        {activeTab === 'FD' && (
          <div>
            <div className="form-group">
              <label>Deposit Principal (₹): ₹{Number(fdDeposit).toLocaleString('en-IN')}</label>
              <input
                type="range"
                min="10000"
                max="2000000"
                step="10000"
                value={fdDeposit}
                onChange={(e) => setFdDeposit(e.target.value)}
              />
            </div>

            <div className="grid grid-2" style={{ gap: 16 }}>
              <div className="form-group">
                <label>Duration (Years): {fdYears} Years</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={fdYears}
                  onChange={(e) => setFdYears(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Interest Rate (% p.a.): {fdRate}%</label>
                <input
                  type="number"
                  step="0.05"
                  min="4"
                  max="10"
                  value={fdRate}
                  onChange={(e) => setFdRate(e.target.value)}
                />
              </div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 16, padding: 20, marginTop: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--bank-text-muted)', fontWeight: 700 }}>EXPECTED MATURITY AMOUNT</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#10b981', margin: '4px 0' }}>
                ₹{fdVal.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--bank-text-muted)' }}>
                Total Interest Earned: ₹{(fdVal - fdDeposit).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: SIP Calculator */}
        {activeTab === 'SIP' && (
          <div>
            <div className="form-group">
              <label>Monthly SIP Contribution (₹): ₹{Number(sipMonthly).toLocaleString('en-IN')}</label>
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={sipMonthly}
                onChange={(e) => setSipMonthly(e.target.value)}
              />
            </div>

            <div className="grid grid-2" style={{ gap: 16 }}>
              <div className="form-group">
                <label>Investment Period (Years): {sipYears} Years</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={sipYears}
                  onChange={(e) => setSipYears(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Expected Return (% p.a.): {sipReturnRate}%</label>
                <input
                  type="number"
                  step="0.5"
                  min="5"
                  max="25"
                  value={sipReturnRate}
                  onChange={(e) => setSipReturnRate(e.target.value)}
                />
              </div>
            </div>

            <div style={{ background: 'rgba(45, 140, 255, 0.08)', border: '1px solid rgba(45, 140, 255, 0.2)', borderRadius: 16, padding: 20, marginTop: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--bank-text-muted)', fontWeight: 700 }}>PROJECTED CORPUS VALUE</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--bank-accent)', margin: '4px 0' }}>
                ₹{sipVal.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--bank-text-muted)' }}>
                Invested: ₹{(sipMonthly * sipYears * 12).toLocaleString('en-IN')} | Wealth Gain: ₹{(sipVal - sipMonthly * sipYears * 12).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
