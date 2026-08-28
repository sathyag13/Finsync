import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px 24px', maxWidth: 640, margin: '40px auto', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <AlertTriangle size={28} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>
            Component Render Error
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: 20, lineHeight: 1.5 }}>
            {this.state.error?.message || 'An unexpected rendering error occurred in this view.'}
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontWeight: 700 }}
          >
            <RefreshCw size={16} /> Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
