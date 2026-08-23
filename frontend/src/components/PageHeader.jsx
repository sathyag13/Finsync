import React from 'react'

export default function PageHeader({ title, description, icon: Icon, iconColor = 'var(--primary)', actions }) {
  return (
    <div className="page-header">
      <div className="page-header-content">
        <h1 className="page-title">
          {Icon && <Icon size={24} color={iconColor} style={{ flexShrink: 0 }} />}
          <span>{title}</span>
        </h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  )
}
