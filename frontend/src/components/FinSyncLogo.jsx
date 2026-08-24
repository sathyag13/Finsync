export default function FinSyncLogo({ size = 28, color = '#12A878', glow = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        filter: glow ? 'drop-shadow(0 2px 8px rgba(18, 168, 120, 0.35))' : 'none'
      }}
    >
      <defs>
        <linearGradient id="finSyncEmeraldGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#12A878" />
          <stop offset="0.5" stopColor="#0FA878" />
          <stop offset="1" stopColor="#065F46" />
        </linearGradient>
        <linearGradient id="finSyncAccentGrad" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6EE7B7" />
          <stop offset="1" stopColor="#12A878" />
        </linearGradient>
      </defs>

      {/* Hexagonal Shield Foundation */}
      <path
        d="M24 3.5L42 13.5V31L24 41.5L6 31V13.5L24 3.5Z"
        fill="url(#finSyncEmeraldGrad)"
      />

      {/* Inner Intersecting Synchronization Geometric Wings (Bank Vault & Sync Motif) */}
      <path
        d="M24 10L35 16.5V26.5L24 33L13 26.5V16.5L24 10Z"
        fill="#FFFFFF"
        fillOpacity="0.18"
      />

      {/* Left Sync Fin / Dynamic Arc */}
      <path
        d="M24 13L16 18V28L24 23V13Z"
        fill="url(#finSyncAccentGrad)"
      />

      {/* Right Sync Fin / Forward Pulse */}
      <path
        d="M24 32L32 27V17L24 22V32Z"
        fill="#FFFFFF"
      />

      {/* Center Core Node */}
      <circle cx="24" cy="22.5" r="3" fill="#FFFFFF" />
    </svg>
  )
}
