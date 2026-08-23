import React from 'react'

export default function StatCard({ label, value, icon: Icon, iconTheme = 'indigo', subtitle, trend, trendType = 'up', valueColor }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        {Icon && (
          <div className={`stat-icon ${iconTheme}`}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="stat-value" style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </div>

      <div className="stat-footer">
        {trend && (
          <span className={`stat-trend ${trendType}`}>
            {trend}
          </span>
        )}
        {subtitle && (
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}
