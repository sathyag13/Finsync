export default function FinSyncLogo({ size = 34, glow = false, className = '' }) {
  return (
    <img
      src="/finsync-logo.png"
      alt="FinSync Bank Logo"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        filter: glow ? 'drop-shadow(0 2px 8px rgba(212, 163, 89, 0.35))' : 'none'
      }}
    />
  )
}
