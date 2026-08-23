import { Link } from 'react-router-dom'
import { Building2, ShieldCheck, PhoneCall, Mail, MapPin } from 'lucide-react'

export default function PublicFooter() {
  return (
    <footer className="bank-footer" style={{ background: '#090d16', borderTop: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', padding: '56px 0 28px 0' }}>
      <div className="footer-inner" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32, marginBottom: 40 }}>
          {/* Column 1: FinSync Brand & Contact Info */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Building2 size={24} />
              </div>
              <div>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px' }}>FINSYNC BANK</span>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#a7f3d0', letterSpacing: 1.2, textTransform: 'uppercase' }}>ALWAYS WITH YOU</div>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.75)', marginBottom: 20, maxWidth: 380 }}>
              FinSync Bank Ltd. is a scheduled commercial bank regulated by the Reserve Bank of India. Providing multi-currency accounts, instant atomic transfers, expense analytics, and high-yield savings goals.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#ffffff' }}>
                <PhoneCall size={16} color="#a7f3d0" />
                <span>1800-425-1199 (Toll-Free 24/7 Helpline)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#ffffff' }}>
                <Mail size={16} color="#a7f3d0" />
                <span>support@finsyncbank.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.85)' }}>
                <MapPin size={16} color="#a7f3d0" />
                <span>FinSync Tower, Financial District, Bandra Kurla Complex, Mumbai - 400051</span>
              </div>
            </div>
          </div>

          {/* Column 2: Digital Banking Services */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.95rem', marginBottom: 16, borderBottom: '2px solid #6366f1', paddingBottom: 6 }}>
              Banking Services
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.86rem' }}>
              <li style={{ color: 'rgba(255,255,255,0.82)', cursor: 'default' }}>Multi-Currency Accounts</li>
              <li style={{ color: 'rgba(255,255,255,0.82)', cursor: 'default' }}>ISO 7810 Virtual Debit Cards</li>
              <li style={{ color: 'rgba(255,255,255,0.82)', cursor: 'default' }}>Atomic P2P Money Transfer</li>
              <li style={{ color: 'rgba(255,255,255,0.82)', cursor: 'default' }}>Categorized Expense Logs</li>
              <li style={{ color: 'rgba(255,255,255,0.82)', cursor: 'default' }}>5.50% APY Vault Savings</li>
              <li style={{ color: 'rgba(255,255,255,0.82)', cursor: 'default' }}>Instant Wire & NEFT Transfer</li>
              <li style={{ color: 'rgba(255,255,255,0.82)', cursor: 'default' }}>Recurring Deposit & Fixed Vaults</li>
            </ul>
          </div>

          {/* Column 3: Client Security & Access */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.95rem', marginBottom: 16, borderBottom: '2px solid #6366f1', paddingBottom: 6 }}>
              Security & Compliance
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.86rem' }}>
              <li style={{ color: 'rgba(255,255,255,0.82)', cursor: 'default' }}>NetBanking Dashboard</li>
              <li style={{ color: 'rgba(255,255,255,0.82)', cursor: 'default' }}>Daily Transfer Limits (₹5 Lakhs)</li>
              <li style={{ color: 'rgba(255,255,255,0.82)', cursor: 'default' }}>Secure Client Sign In</li>
              <li style={{ color: 'rgba(255,255,255,0.82)', cursor: 'default' }}>Instant Online Onboarding</li>
              <li style={{ color: 'rgba(255,255,255,0.82)', cursor: 'default' }}>256-Bit SSL Data Encryption</li>
              <li style={{ color: 'rgba(255,255,255,0.82)', cursor: 'default' }}>RBI Scheduled Bank Compliance</li>
              <li style={{ color: 'rgba(255,255,255,0.82)', cursor: 'default' }}>DICGC Deposit Cover (₹5 Lakhs)</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & DICGC Insurance Compliance */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: '#ffffff' }}>
            <ShieldCheck size={16} color="#a7f3d0" />
            <span>256-Bit SSL Encrypted • DICGC Deposit Insurance Covered up to ₹5 Lakhs per depositor.</span>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
            © {new Date().getFullYear()} FinSync Bank Ltd. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
