import { useState, useEffect } from 'react'
import { Settings, RefreshCw, Sliders } from 'lucide-react'
import api from '../../api/axios.js'
import { useToast } from '../../context/ToastContext.jsx'
import PageHeader from '../../components/PageHeader.jsx'

export default function AdminSettings() {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [settings, setSettings] = useState({
    maxTransactionLimit: 500000,
    accountCreationEnabled: true,
    maintenanceMode: false,
    notificationsEnabled: true,
    auditLoggingEnabled: true
  })

  const loadSettings = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/settings')
      if (res.data) {
        setSettings({
          maxTransactionLimit: res.data.maxTransactionLimit || 500000,
          accountCreationEnabled: res.data.accountCreationEnabled !== false,
          maintenanceMode: !!res.data.maintenanceMode,
          notificationsEnabled: res.data.notificationsEnabled !== false,
          auditLoggingEnabled: res.data.auditLoggingEnabled !== false
        })
      }
    } catch (err) {
      console.error('Failed to load system settings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      await api.put('/admin/settings', settings)
      addToast('Global platform system settings updated successfully!', 'success')
      window.dispatchEvent(new Event('finsync:activity'))
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="System Settings & Platform Configuration"
        description="Configure global maximum transfer thresholds, account onboarding rules, maintenance mode & audit triggers"
        icon={Settings}
        actions={
          <button className="btn btn-secondary btn-sm" onClick={loadSettings}>
            <RefreshCw size={15} /> Reload Settings
          </button>
        }
      />

      {/* Main Settings Card */}
      <div className="card" style={{ maxWidth: 740 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>Loading platform parameters…</div>
        ) : (
          <form onSubmit={handleSaveSettings}>
            <h3 className="section-title">
              <Sliders size={18} color="var(--primary)" />
              <span>Operational Security Thresholds</span>
            </h3>

            {/* Maximum Transaction Limit */}
            <div className="form-group" style={{ marginBottom: 18 }}>
              <label>
                Maximum Single Transfer Limit (₹)
              </label>
              <input
                type="number"
                min="1000"
                step="1000"
                value={settings.maxTransactionLimit}
                onChange={(e) => setSettings({ ...settings, maxTransactionLimit: Number(e.target.value) })}
                required
              />
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
                Transfers exceeding ₹{Number(settings.maxTransactionLimit).toLocaleString('en-IN')} will be rejected by the backend.
              </div>
            </div>

            {/* Account Creation Enabled Switch */}
            <div style={{ padding: '14px 16px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px' }}>New Customer Account Provisioning</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Allow retail clients to open new Savings and Current vaults</div>
              </div>
              <input
                type="checkbox"
                checked={settings.accountCreationEnabled}
                onChange={(e) => setSettings({ ...settings, accountCreationEnabled: e.target.checked })}
                style={{ width: 18, height: 18, cursor: 'pointer' }}
              />
            </div>

            {/* Maintenance Mode Switch */}
            <div style={{ padding: '14px 16px', borderRadius: 8, background: settings.maintenanceMode ? 'rgba(244, 63, 94, 0.08)' : 'var(--bg-input)', border: settings.maintenanceMode ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid var(--border-color)', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: settings.maintenanceMode ? 'var(--accent-rose)' : 'var(--text-main)' }}>
                  Platform Maintenance Mode Window
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Restrict retail customer sign-ins during system maintenance</div>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                style={{ width: 18, height: 18, cursor: 'pointer' }}
              />
            </div>

            {/* Notifications Enabled Switch */}
            <div style={{ padding: '14px 16px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px' }}>Automated Customer Notifications</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Generate real-time alerts for deposits, transfers and card freezes</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notificationsEnabled}
                onChange={(e) => setSettings({ ...settings, notificationsEnabled: e.target.checked })}
                style={{ width: 18, height: 18, cursor: 'pointer' }}
              />
            </div>

            {/* Audit Logging Enabled Switch */}
            <div style={{ padding: '14px 16px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px' }}>High-Resolution Security Audit Logging</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Capture forensic logs for all transactions and user security operations</div>
              </div>
              <input
                type="checkbox"
                checked={settings.auditLoggingEnabled}
                onChange={(e) => setSettings({ ...settings, auditLoggingEnabled: e.target.checked })}
                style={{ width: 18, height: 18, cursor: 'pointer' }}
              />
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%' }}>
              {saving ? 'Applying System Configuration…' : 'Save & Enforce System Settings'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
