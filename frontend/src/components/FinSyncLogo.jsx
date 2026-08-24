export default function FinSyncLogo({ size = 46, glow = true, className = '', style = {} }) {
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
        filter: glow
          ? 'drop-shadow(0 2px 12px rgba(229, 184, 105, 0.55)) drop-shadow(0 0 4px rgba(255, 230, 160, 0.4)) brightness(1.08) contrast(1.05)'
          : 'brightness(1.05)',
        transition: 'transform 0.25s ease, filter 0.25s ease',
        ...style
      }}
    />
  )
}
