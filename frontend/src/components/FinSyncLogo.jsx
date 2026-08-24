export default function FinSyncLogo({ size = 34, glow = true, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        filter: glow ? 'drop-shadow(0 3px 10px rgba(212, 163, 89, 0.35))' : 'none'
      }}
    >
      <defs>
        {/* Top Gold Gradient */}
        <linearGradient id="goldTopGrad" x1="260" y1="100" x2="750" y2="450" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E9C172" />
          <stop offset="50%" stopColor="#DCA952" />
          <stop offset="100%" stopColor="#C48E37" />
        </linearGradient>

        {/* Bottom Gold Gradient */}
        <linearGradient id="goldBottomGrad" x1="440" y1="350" x2="740" y2="780" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3D086" />
          <stop offset="40%" stopColor="#E0AE55" />
          <stop offset="100%" stopColor="#BA832F" />
        </linearGradient>

        {/* Slate Pillar Metallic Gradient */}
        <linearGradient id="slateGrad" x1="260" y1="540" x2="550" y2="900" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6C7D93" />
          <stop offset="60%" stopColor="#4D5D73" />
          <stop offset="100%" stopColor="#354458" />
        </linearGradient>

        {/* Overlap Shadow for 3D depth */}
        <linearGradient id="depthShadow" x1="480" y1="480" x2="550" y2="550" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E293B" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#1E293B" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* --- Slate 'F' / 'P' Foundation Stem --- */}
      {/* Vertical Base Pillar */}
      <rect
        x="268"
        y="548"
        width="116"
        height="342"
        rx="18"
        fill="url(#slateGrad)"
      />

      {/* Horizontal Bridge connecting under the gold ribbon */}
      <path
        d="M 384 548
           L 516 548
           C 538 548, 550 562, 546 582
           C 542 602, 526 618, 498 626
           L 384 642
           Z"
        fill="url(#slateGrad)"
      />

      {/* --- Gold Ribbon Part 1: Top Curve & Wing --- */}
      <path
        d="M 538 528
           C 430 528, 376 450, 376 348
           C 376 226, 452 112, 608 112
           L 744 112
           C 756 112, 752 136, 736 158
           C 712 192, 674 236, 614 236
           L 560 236
           C 440 236, 268 280, 268 402
           C 268 506, 362 556, 492 556
           C 524 556, 542 546, 538 528
           Z"
        fill="url(#goldTopGrad)"
      />

      {/* --- Gold Ribbon Part 2: Middle-to-Bottom Sweeping Curve --- */}
      <path
        d="M 470 326
           C 444 326, 444 374, 468 392
           C 530 436, 642 478, 642 584
           C 642 676, 560 766, 384 766
           L 384 648
           L 490 648
           C 604 648, 734 602, 734 496
           C 734 388, 624 326, 470 326
           Z"
        fill="url(#goldBottomGrad)"
      />

      {/* Subtle depth overlap shadow where gold crosses over slate */}
      <path
        d="M 500 520
           C 528 535, 548 554, 544 582
           L 516 548
           Z"
        fill="url(#depthShadow)"
      />
    </svg>
  )
}
