import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, isLarge = false }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${isLarge ? 'modal-lg' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} title="Close dialog">
          <X size={18} />
        </button>
        {title && (
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
