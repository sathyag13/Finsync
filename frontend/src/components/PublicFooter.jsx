import { Link } from 'react-router-dom'
import { Building2, ShieldCheck, PhoneCall, Mail, MapPin } from 'lucide-react'

export default function PublicFooter() {
  return (
    <footer className="bank-footer" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', color: '#475569', padding: '64px 0 32px 0' }}>
      <div className="footer-inner" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 36, marginBottom: 44 }}>
          {/* Column 1: FinSync Brand & Contact Info */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
                <Building2 size={24} />
              </div>
              <div>
                <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>FINSYNC BANK</span>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#059669', letterSpacing: 1.2, textTransform: 'uppercase' }}>ALWAYS WITH YOU</div>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: '#64748b', marginBottom: 24, maxWidth: 420 }}>
              FinSync Bank Ltd. is a scheduled commercial bank regulated by the Reserve Bank of India. Providing multi-currency accounts, instant atomic transfers, expense analytics, and high-yield savings goals.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#1e293b', fontWeight: 600 }}>
                <PhoneCall size={16} color="#059669" />
                <span>1800-425-1199 (Toll-Free 24/7 Helpline)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#1e293b', fontWeight: 600 }}>
                <Mail size={16} color="#059669" />
                <span>support@finsyncbank.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748b' }}>
                <MapPin size={16} color="#059669" />
                <span>FinSync Tower, Financial District, Bandra Kurla Complex, Mumbai - 400051</span>
              </div>
            </div>
          </div>

          {/* Column 2: Digital Banking Services */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <div style={{ color: '#0f172a', fontWeight: 800, fontSize: '0.98rem', marginBottom: 18, borderBottom: '2px solid #10b981', paddingBottom: 8, display: 'inline-block' }}>
              Banking Services
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.88rem' }}>
              <li style={{ color: '#475569', cursor: 'default' }}>Multi-Currency Accounts</li>
              <li style={{ color: '#475569', cursor: 'default' }}>ISO 7810 Virtual Debit Cards</li>
              <li style={{ color: '#475569', cursor: 'default' }}>Atomic P2P Money Transfer</li>
              <li style={{ color: '#475569', cursor: 'default' }}>Categorized Expense Logs</li>
              <li style={{ color: '#475569', cursor: 'default' }}>5.50% APY Vault Savings</li>
              <li style={{ color: '#475569', cursor: 'default' }}>Instant Wire & NEFT Transfer</li>
              <li style={{ color: '#475569', cursor: 'default' }}>Recurring Deposit & Fixed Vaults</li>
            </ul>
          </div>

          {/* Column 3: Client Security & Access */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <div style={{ color: '#0f172a', fontWeight: 800, fontSize: '0.98rem', marginBottom: 18, borderBottom: '2px solid #10b981', paddingBottom: 8, display: 'inline-block' }}>
              Security & Compliance
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.88rem' }}>
              <li style={{ color: '#475569', cursor: 'default' }}>NetBanking Dashboard</li>
              <li style={{ color: '#475569', cursor: 'default' }}>Daily Transfer Limits (₹5 Lakhs)</li>
              <li style={{ color: '#475569', cursor: 'default' }}>Secure Client Sign In</li>
              <li style={{ color: '#475569', cursor: 'default' }}>Instant Online Onboarding</li>
              <li style={{ color: '#475569', cursor: 'default' }}>256-Bit SSL Data Encryption</li>
              <li style={{ color: '#475569', cursor: 'default' }}>RBI Scheduled Bank Compliance</li>
              <li style={{ color: '#475569', cursor: 'default' }}>DICGC Deposit Cover (₹5 Lakhs)</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & DICGC Insurance Compliance */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
            <ShieldCheck size={18} color="#059669" />
            <span>256-Bit SSL Encrypted • DICGC Deposit Insurance Covered up to ₹5 Lakhs per depositor.</span>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            © {new Date().getFullYear()} FinSync Bank Ltd. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
