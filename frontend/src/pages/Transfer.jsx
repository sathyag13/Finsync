import { useEffect, useState, useRef } from 'react'
import api from '../api/axios.js'
import Modal from '../components/Modal.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { useToast } from '../context/ToastContext.jsx'
import jsQR from 'jsqr'
import {
  Send,
  Building2,
  ShieldCheck,
  CreditCard,
  Search,
  User,
  Plus,
  Trash2,
  CheckCircle2,
  QrCode,
  Camera,
  Upload,
  Sparkles,
  ArrowRight,
  AlertTriangle
} from 'lucide-react'

export default function Transfer() {
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState('QR_PAY') // 'QR_PAY' | 'STANDARD'
  const [accounts, setAccounts] = useState([])
  const [beneficiaries, setBeneficiaries] = useState([])
  const [loading, setLoading] = useState(false)

  // Standard Transfer Form States
  const [fromAccountNumber, setFromAccountNumber] = useState('')
  const [toAccountNumber, setToAccountNumber] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [showReviewModal, setShowReviewModal] = useState(false)

  // QR / Scan & Pay States
  const [payIdInput, setPayIdInput] = useState('')
  const [resolvingPayId, setResolvingPayId] = useState(false)
  const [resolvedRecipient, setResolvedRecipient] = useState(null)
  const [qrFromAccount, setQrFromAccount] = useState('')
  const [qrAmount, setQrAmount] = useState('')
  const [qrRemarks, setQrRemarks] = useState('')
  const [showQrReviewModal, setShowQrReviewModal] = useState(false)

  // Camera Scanner Modal State
  const [showCameraScanner, setShowCameraScanner] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const scanIntervalRef = useRef(null)

  // Beneficiary Management States
  const [isAddBeneficiaryOpen, setIsAddBeneficiaryOpen] = useState(false)
  const [benName, setBenName] = useState('')
  const [benBank, setBenBank] = useState('FinSync Bank')
  const [benAcc, setBenAcc] = useState('')
  const [benIfsc, setBenIfsc] = useState('FSNB0001001')
  const [benSearch, setBenSearch] = useState('')

  // Shared Receipt Modal State
  const [receipt, setReceipt] = useState(null)

  const loadData = async () => {
    try {
      const [accRes, benRes] = await Promise.all([
        api.get('/accounts').catch(() => ({ data: [] })),
        api.get('/beneficiaries').catch(() => ({ data: [] }))
      ])

      const myAccounts = accRes.data || []
      setAccounts(myAccounts)
      if (myAccounts.length > 0) {
        if (!fromAccountNumber) setFromAccountNumber(myAccounts[0].accountNumber)
        if (!qrFromAccount) setQrFromAccount(myAccounts[0].accountNumber)
      }

      setBeneficiaries(benRes.data || [])
    } catch (err) {
      console.error('Failed to load transfer data:', err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const selectedSourceAccount = accounts.find(a => a.accountNumber === fromAccountNumber)
  const selectedQrSourceAccount = accounts.find(a => a.accountNumber === qrFromAccount)

  // Risk calculation helper
  const calculateEstimatedRisk = (amt) => {
    const num = Number(amt) || 0
    if (num > 100000) return 'HIGH'
    if (num > 50000) return 'MEDIUM'
    return 'LOW'
  }

  // Resolve Pay ID / QR Data
  const handleResolveRecipient = async (payIdToResolve) => {
    const clean = (payIdToResolve || payIdInput).trim()
    if (!clean) {
      addToast('Please enter a FinSync Pay ID or scan a QR code', 'error')
      return
    }

    try {
      setResolvingPayId(true)
      const res = await api.get(`/payments/recipient/${encodeURIComponent(clean)}`)
      setResolvedRecipient(res.data)
      setPayIdInput(res.data.publicPaymentId || clean)
      addToast(`Verified recipient: ${res.data.recipientName}`, 'success')
    } catch (err) {
      setResolvedRecipient(null)
      addToast(err.response?.data?.message || 'Recipient not found for this Pay ID', 'error')
    } finally {
      setResolvingPayId(false)
    }
  }

  // Upload QR Image File Decoder
  const handleUploadQrImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, img.width, img.height)
        const imageData = ctx.getImageData(0, 0, img.width, img.height)
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height)

        if (qrCode && qrCode.data) {
          addToast('QR Code successfully decoded from image!', 'success')
          let decoded = qrCode.data
          if (decoded.includes('payId=')) {
            const idx = decoded.indexOf('payId=')
            decoded = decoded.substring(idx + 6).split('&')[0]
          }
          setPayIdInput(decoded)
          handleResolveRecipient(decoded)
        } else {
          addToast('No readable QR code found in the selected image. Please try another image.', 'error')
        }
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  // Camera Scanner Functions
  const startCameraScanner = async () => {
    setCameraError(null)
    setShowCameraScanner(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.setAttribute('playsinline', true)
        videoRef.current.play()
      }

      // Scanning loop
      scanIntervalRef.current = setInterval(() => {
        if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) return
        const canvas = document.createElement('canvas')
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code && code.data) {
          clearInterval(scanIntervalRef.current)
          stopCameraScanner()
          let decoded = code.data
          if (decoded.includes('payId=')) {
            const idx = decoded.indexOf('payId=')
            decoded = decoded.substring(idx + 6).split('&')[0]
          }
          setPayIdInput(decoded)
          handleResolveRecipient(decoded)
        }
      }, 300)
    } catch (err) {
      console.warn('Camera access error:', err)
      setCameraError('Camera access not granted or device camera unavailable. You can use "Upload QR Image" instead.')
    }
  }

  const stopCameraScanner = () => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCameraScanner(false)
  }

  // QR Transfer Form Review
  const handleInitiateQrTransfer = (e) => {
    e.preventDefault()
    if (!resolvedRecipient) {
      addToast('Please resolve and verify a valid recipient first.', 'error')
      return
    }

    const numAmount = Number(qrAmount)
    if (isNaN(numAmount) || numAmount <= 0) {
      addToast('Please enter a valid transfer amount greater than ₹0.', 'error')
      return
    }

    const currentBal = Number(selectedQrSourceAccount?.balance || 0)
    if (numAmount > currentBal) {
      addToast(`Insufficient funds. Your available balance is ₹${currentBal.toLocaleString('en-IN')}.`, 'error')
      return
    }

    if (selectedQrSourceAccount?.status === 'FROZEN') {
      addToast('Your source account is FROZEN. Cannot transfer.', 'error')
      return
    }

    setShowQrReviewModal(true)
  }

  // Execute QR Transfer
  const handleConfirmQrTransfer = async () => {
    setLoading(true)
    try {
      const res = await api.post('/payments/qr-transfer', {
        payId: resolvedRecipient.publicPaymentId,
        fromAccountNumber: qrFromAccount,
        amount: Number(qrAmount),
        remarks: qrRemarks.trim() || 'QR Instant Transfer'
      })

      setShowQrReviewModal(false)
      setReceipt({
        ...res.data,
        timestamp: new Date().toISOString(),
        recipientName: resolvedRecipient.recipientName,
        payId: resolvedRecipient.publicPaymentId,
        description: qrRemarks.trim() || 'QR Instant Transfer',
        isQr: true
      })

      addToast(`₹${Number(qrAmount).toLocaleString('en-IN')} sent to ${resolvedRecipient.recipientName} successfully!`, 'success')
      window.dispatchEvent(new Event('finsync:activity'))
      setQrAmount('')
      setQrRemarks('')
      setResolvedRecipient(null)
      setPayIdInput('')
      loadData()
    } catch (err) {
      addToast(err.response?.data?.message || 'QR Transfer failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Standard Transfer Handlers
  const handleInitiateStandardTransfer = (e) => {
    e.preventDefault()
    if (!fromAccountNumber || !toAccountNumber.trim()) {
      addToast('Please fill in source and recipient details.', 'error')
      return
    }
    const numAmount = Number(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      addToast('Please enter a valid amount.', 'error')
      return
    }
    const currentBal = Number(selectedSourceAccount?.balance || 0)
    if (numAmount > currentBal) {
      addToast(`Insufficient funds. Available: ₹${currentBal.toLocaleString('en-IN')}.`, 'error')
      return
    }
    setShowReviewModal(true)
  }

  const handleConfirmStandardTransfer = async () => {
    setLoading(true)
    try {
      const res = await api.post('/transfer', {
        fromAccountNumber,
        toAccountNumber: toAccountNumber.trim(),
        amount: Number(amount),
        description: description.trim() || 'Electronic Fund Transfer'
      })

      setShowReviewModal(false)
      setReceipt({
        ...res.data,
        timestamp: new Date().toISOString(),
        recipientName: recipientName || 'Payee Account',
        description: description.trim() || 'Electronic Fund Transfer',
        isQr: false
      })

      addToast(`Transfer of ₹${Number(amount).toLocaleString('en-IN')} completed!`, 'success')
      window.dispatchEvent(new Event('finsync:activity'))
      setAmount('')
      setDescription('')
      setToAccountNumber('')
      setRecipientName('')
      loadData()
    } catch (err) {
      addToast(err.response?.data?.message || 'Transfer failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Beneficiary Management
  const handleAddBeneficiary = async (e) => {
    e.preventDefault()
    try {
      await api.post('/beneficiaries', {
        name: benName,
        bankName: benBank,
        accountNumber: benAcc,
        ifsc: benIfsc
      })
      addToast(`Beneficiary ${benName} added to directory!`, 'success')
      setIsAddBeneficiaryOpen(false)
      setBenName('')
      setBenAcc('')
      loadData()
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to add beneficiary', 'error')
    }
  }

  const handleDeleteBeneficiary = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from your payees?`)) return
    try {
      await api.delete(`/beneficiaries/${id}`)
      addToast(`Beneficiary ${name} removed.`, 'info')
      loadData()
    } catch (err) {
      addToast('Failed to delete beneficiary', 'error')
    }
  }

  const handleSelectBeneficiary = (b) => {
    setToAccountNumber(b.accountNumber)
    setRecipientName(b.name)
    setActiveTab('STANDARD')
    addToast(`Selected payee ${b.name}`, 'info')
  }

  const filteredBeneficiaries = beneficiaries.filter(b =>
    b.name.toLowerCase().includes(benSearch.toLowerCase()) ||
    b.accountNumber.toLowerCase().includes(benSearch.toLowerCase()) ||
    b.bankName.toLowerCase().includes(benSearch.toLowerCase())
  )

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Pay & Transfer Center"
        description="Instant domestic fund transfers, FinSync Scan & Pay QR transfers, and saved beneficiaries"
        icon={Send}
        actions={
          <button className="btn btn-secondary btn-sm" onClick={() => setIsAddBeneficiaryOpen(true)}>
            <Plus size={15} /> Add Beneficiary
          </button>
        }
      />

      {/* Mode Switcher Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 'var(--section-gap)' }}>
        <button
          type="button"
          onClick={() => setActiveTab('QR_PAY')}
          className={`btn ${activeTab === 'QR_PAY' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, height: 42, fontWeight: 700 }}
        >
          <QrCode size={16} /> Scan & Pay (QR / Pay ID)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('STANDARD')}
          className={`btn ${activeTab === 'STANDARD' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, height: 42, fontWeight: 700 }}
        >
          <Building2 size={16} /> Direct Account Transfer
        </button>
      </div>

      <div className="grid grid-2" style={{ gap: 24, marginBottom: 'var(--section-gap)' }}>
        {/* Left Column: QR Scan & Pay Form OR Standard Transfer Form */}
        <div className="grid-col-left">
          {activeTab === 'QR_PAY' ? (
            /* SCAN & PAY TAB */
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-header">
                <h3 className="card-title">
                  <QrCode size={18} color="var(--primary)" />
                  <span>Scan & Pay / Pay using FinSync Pay ID</span>
                </h3>
                <span className="badge badge-emerald">Instant Settlement</span>
              </div>

              {/* Step 1: Input Pay ID or Scan */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
                  Enter Recipient Pay ID or Scan QR Code
                </label>

                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <input
                    type="text"
                    placeholder="e.g. FS-PAY-8X72KQ"
                    value={payIdInput}
                    onChange={(e) => setPayIdInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleResolveRecipient() }}
                    style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => handleResolveRecipient()}
                    disabled={resolvingPayId}
                    className="btn btn-primary"
                    style={{ flexShrink: 0 }}
                  >
                    {resolvingPayId ? 'Verifying…' : 'Verify Pay ID'}
                  </button>
                </div>

                {/* Quick Scan Action Buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={startCameraScanner}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <Camera size={14} /> Scan with Camera
                  </button>

                  <label
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, cursor: 'pointer', margin: 0 }}
                  >
                    <Upload size={14} /> Upload QR Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadQrImage}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              {/* Step 2: Verified Recipient Card Banner */}
              {resolvedRecipient && (
                <div
                  style={{
                    padding: '14px 16px',
                    borderRadius: 10,
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    marginBottom: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        background: 'var(--accent-emerald)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '16px',
                        flexShrink: 0
                      }}
                    >
                      {resolvedRecipient.recipientName?.charAt(0).toUpperCase() || 'R'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{resolvedRecipient.recipientName}</span>
                        <CheckCircle2 size={15} color="var(--accent-emerald)" />
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        FinSync Pay ID: <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{resolvedRecipient.publicPaymentId}</strong>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 600, marginTop: 2 }}>
                        Verified Primary {resolvedRecipient.primaryAccountType} Account ({resolvedRecipient.maskedAccountNumber})
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setResolvedRecipient(null); setPayIdInput('') }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '11px', padding: '0 8px' }}
                  >
                    Change
                  </button>
                </div>
              )}

              {/* Step 3: Amount & Source Account Form */}
              <form onSubmit={handleInitiateQrTransfer}>
                <div className="form-group">
                  <label>Select Source Debit Account</label>
                  <select
                    value={qrFromAccount}
                    onChange={(e) => setQrFromAccount(e.target.value)}
                    required
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.accountNumber}>
                        {a.accountType} — {a.accountNumber} (Available: ₹{Number(a.balance || 0).toLocaleString('en-IN')}) {a.status === 'FROZEN' ? '[FROZEN]' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Payment Amount (₹)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="e.g. 5000"
                    value={qrAmount}
                    onChange={(e) => setQrAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Remarks / Note (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Lunch, project reimbursement, fees"
                    value={qrRemarks}
                    onChange={(e) => setQrRemarks(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!resolvedRecipient}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: 8 }}
                >
                  <Send size={15} /> Continue to Confirmation
                </button>
              </form>
            </div>
          ) : (
            /* DIRECT ACCOUNT TRANSFER TAB */
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-header">
                <h3 className="card-title">
                  <Building2 size={18} color="var(--primary)" />
                  <span>Standard Account Transfer</span>
                </h3>
              </div>

              <form onSubmit={handleInitiateStandardTransfer}>
                <div className="form-group">
                  <label>Select Source Debit Account</label>
                  <select
                    value={fromAccountNumber}
                    onChange={(e) => setFromAccountNumber(e.target.value)}
                    required
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.accountNumber}>
                        {a.accountType} — {a.accountNumber} (Available: ₹{Number(a.balance || 0).toLocaleString('en-IN')}) {a.status === 'FROZEN' ? '[FROZEN]' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Recipient Account Number / Payee</label>
                  <input
                    type="text"
                    placeholder="Enter 10-digit Account Number (e.g. FS4992820634)"
                    value={toAccountNumber}
                    onChange={(e) => {
                      setToAccountNumber(e.target.value)
                      const matched = beneficiaries.find(b => b.accountNumber.toLowerCase() === e.target.value.trim().toLowerCase())
                      if (matched) setRecipientName(matched.name)
                    }}
                    required
                  />
                  {recipientName && (
                    <div style={{ fontSize: '12px', color: 'var(--accent-emerald)', fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={13} /> Payee Name: {recipientName}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Transfer Amount (₹)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="e.g. 5000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Remarks / Purpose of Transfer</label>
                  <input
                    type="text"
                    placeholder="e.g. Invoice payment, rent, family support"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: 8 }}
                >
                  <Send size={15} /> Review & Authorize Transfer
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Beneficiary Directory & QR Quick Guide */}
        <div className="grid-col-right">
          <div className="card" style={{ marginBottom: 'var(--section-gap)' }}>
            <div className="card-header">
              <h3 className="card-title">
                <User size={18} color="var(--primary)" />
                <span>Saved Payees & Beneficiaries</span>
              </h3>
              <span className="badge badge-indigo">
                {beneficiaries.length} Saved
              </span>
            </div>

            <div style={{ position: 'relative', marginBottom: 14 }}>
              <input
                type="text"
                placeholder="Search saved payees by name, bank or account..."
                value={benSearch}
                onChange={(e) => setBenSearch(e.target.value)}
                style={{ paddingLeft: 32 }}
              />
              <Search size={14} style={{ position: 'absolute', left: 10, top: 13, color: 'var(--text-muted)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 320, overflowY: 'auto' }}>
              {filteredBeneficiaries.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No saved beneficiaries. Click "Add Beneficiary" to register your payees.
                </div>
              ) : (
                filteredBeneficiaries.map((b) => (
                  <div
                    key={b.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 8,
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="stat-icon indigo" style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0 }}>
                        <Building2 size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-main)' }}>{b.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {b.bankName} • {b.accountNumber}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => handleSelectBeneficiary(b)}
                        className="btn btn-primary btn-sm"
                      >
                        Pay
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBeneficiary(b.id, b.name)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: 4 }}
                        title="Remove Beneficiary"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* QR Transfer Confirmation Modal */}
      <Modal isOpen={showQrReviewModal} onClose={() => setShowQrReviewModal(false)} title="Confirm Payment">
        {resolvedRecipient && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>You're paying</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginTop: 2 }}>
                {resolvedRecipient.recipientName}
              </div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--primary)', margin: '8px 0' }}>
                ₹{Number(qrAmount || 0).toLocaleString('en-IN')}
              </div>
            </div>

            <div style={{ padding: '14px 16px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>FinSync Pay ID</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>{resolvedRecipient.publicPaymentId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Pay From</span>
                <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>
                  {selectedQrSourceAccount?.accountType} ({selectedQrSourceAccount?.accountNumber})
                </span>
              </div>
              {qrRemarks && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Note</span>
                  <span style={{ fontWeight: 500 }}>{qrRemarks}</span>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setShowQrReviewModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmQrTransfer}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Sending…' : 'Send Money'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Standard Transfer Review Modal */}
      <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} title="Review & Confirm Transfer">
        <div>
          <div style={{ padding: '14px 16px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Source Account</span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{fromAccountNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Recipient Account</span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{toAccountNumber} {recipientName ? `(${recipientName})` : ''}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Transfer Amount</span>
              <span style={{ fontWeight: 800, fontSize: '16px', color: 'var(--primary)' }}>₹{Number(amount || 0).toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Remarks</span>
              <span style={{ fontWeight: 500 }}>{description || 'Fund Transfer'}</span>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={() => setShowReviewModal(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmStandardTransfer}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Processing…' : 'Authorize Transfer'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Camera QR Scanner Modal */}
      <Modal isOpen={showCameraScanner} onClose={stopCameraScanner} title="Scan FinSync QR Code">
        <div>
          {cameraError ? (
            <div style={{ padding: 24, textAlign: 'center' }}>
              <AlertTriangle size={36} color="var(--accent-amber)" style={{ marginBottom: 10 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: 16 }}>{cameraError}</p>
              <button onClick={stopCameraScanner} className="btn btn-secondary" style={{ width: '100%' }}>
                Close Scanner
              </button>
            </div>
          ) : (
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: 12, textAlign: 'center' }}>
                Position the recipient's FinSync QR code inside the camera viewport.
              </p>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4/3',
                  background: '#000000',
                  borderRadius: 12,
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <video
                  ref={videoRef}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Target Frame Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    width: 180,
                    height: 180,
                    border: '2px solid var(--primary)',
                    borderRadius: 12,
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)',
                    pointerEvents: 'none'
                  }}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={stopCameraScanner}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Transaction Receipt Modal */}
      <Modal isOpen={receipt !== null} onClose={() => setReceipt(null)} title="Transfer Authorization Receipt">
        {receipt && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'rgba(16,185,129,0.15)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: 2 }}>
              Transfer Successful
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: 16 }}>
              {receipt.isQr ? 'QR Instant Transfer executed and recorded in the audit trail.' : 'Transaction successfully executed.'}
            </p>

            <div style={{ padding: '14px 16px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)', textAlign: 'left', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Transaction ID</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>{receipt.transactionId || '#TXN-00101'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Transferred Amount</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{Number(receipt.amount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Sent To</span>
                <span style={{ fontWeight: 700 }}>{receipt.recipientName} {receipt.payId ? `[${receipt.payId}]` : ''}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>From Account</span>
                <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{receipt.fromAccount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Risk Score</span>
                <span style={{ fontWeight: 700, color: receipt.riskLevel === 'HIGH' ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>{receipt.riskLevel || 'LOW'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>New Balance</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>₹{Number(receipt.newBalance || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => setReceipt(null)}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Done
            </button>
          </div>
        )}
      </Modal>

      {/* Add Beneficiary Modal */}
      <Modal isOpen={isAddBeneficiaryOpen} onClose={() => setIsAddBeneficiaryOpen(false)} title="Add Payee Beneficiary">
        <form onSubmit={handleAddBeneficiary}>
          <div className="form-group">
            <label>Beneficiary Full Name</label>
            <input
              type="text"
              placeholder="e.g. Ramesh Kumar"
              value={benName}
              onChange={(e) => setBenName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Bank Name</label>
            <input
              type="text"
              placeholder="e.g. FinSync Bank, HDFC, SBI"
              value={benBank}
              onChange={(e) => setBenBank(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Account Number</label>
            <input
              type="text"
              placeholder="e.g. FS4992820634"
              value={benAcc}
              onChange={(e) => setBenAcc(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>IFSC Code</label>
            <input
              type="text"
              placeholder="e.g. FSNB0001001"
              value={benIfsc}
              onChange={(e) => setBenIfsc(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddBeneficiaryOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              Save Beneficiary
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
