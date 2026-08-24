export default function FinSyncLogo({ size = 32, glow = true, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        filter: glow ? 'drop-shadow(0 2px 6px rgba(212, 163, 89, 0.35))' : 'none'
      }}
    >
      <defs>
        {/* Warm Golden Brand Gradient matching the wall emblem */}
        <linearGradient id="fsGoldGradient" x1="20" y1="15" x2="80" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E8BE74" />
          <stop offset="45%" stopColor="#D4A359" />
          <stop offset="100%" stopColor="#BA863A" />
        </linearGradient>

        {/* Foundation Slate Pillar Gradient */}
        <linearGradient id="fsSlateGradient" x1="22" y1="58" x2="38" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#64748B" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>

      {/* Lower-Left Slate Foundation Block / 'F' Stem */}
      <rect
        x="22"
        y="58"
        width="16"
        height="32"
        rx="4"
        fill="url(#fsSlateGradient)"
      />

      {/* Dynamic Golden 'FS' Monogram Ribbon */}
      <path
        d="M 38 52
           C 28 50, 22 42, 22 30
           C 22 17, 34 14, 52 14
           L 72 14
           C 76 14, 78 17, 76 21
           C 74 25, 70 26, 66 26
           L 50 26
           C 39 26, 36 30, 36 35
           C 36 41, 41 44, 52 46
           L 62 48
           C 75 51, 82 58, 82 70
           C 82 82, 70 88, 52 88
           L 38 88
           C 33 88, 30 84, 33 80
           C 35 76, 39 76, 44 76
           L 54 76
           C 64 76, 68 73, 68 67
           C 68 61, 63 58, 50 56
           L 42 54
           Z"
        fill="url(#fsGoldGradient)"
      />
    </svg>
  )
}
