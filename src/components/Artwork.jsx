let uid = 0
function nextGradientId(prefix) {
  uid += 1
  return `${prefix}-${uid}`
}

/** Round embossed tablet, evokes a branded weight-loss pill. */
export function TabletArt({ className = "", label = "co" }) {
  const id = nextGradientId("tablet")
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Weight loss tablet">
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#e8e2d8" />
          <stop offset="100%" stopColor="#b9ad98" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill={`url(#${id})`} />
      <circle cx="100" cy="100" r="96" fill="none" stroke="#9c907a" strokeWidth="1.5" opacity="0.4" />
      <text
        x="100"
        y="115"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="34"
        fill="#7a6f5a"
        opacity="0.85"
      >
        {label}
      </text>
    </svg>
  )
}

/** Slim injector pen, evokes a GLP-1 auto-injector. */
export function PenArt({ className = "", dose = "7.2 mg", accent = "#f4a94a" }) {
  const bodyId = nextGradientId("penbody")
  const capId = nextGradientId("pencap")
  return (
    <svg viewBox="0 0 120 420" className={className} role="img" aria-label={`Injector pen, ${dose} dose`}>
      <defs>
        <linearGradient id={bodyId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f5f2ea" />
          <stop offset="45%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d8d2c4" />
        </linearGradient>
        <linearGradient id={capId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e4ded0" />
          <stop offset="50%" stopColor="#faf8f2" />
          <stop offset="100%" stopColor="#c9c2b0" />
        </linearGradient>
      </defs>

      <rect x="20" y="10" width="80" height="120" rx="18" fill={`url(#${capId})`} />
      <rect x="20" y="120" width="80" height="18" fill="#cfc8b8" opacity="0.6" />

      <rect x="16" y="130" width="88" height="230" rx="20" fill={`url(#${bodyId})`} stroke="#c7c0ae" strokeWidth="1" />

      <rect x="16" y="205" width="88" height="46" fill={accent} opacity="0.9" />
      <text x="60" y="233" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="15" fill="#2a2116">
        {dose}
      </text>

      <rect x="30" y="360" width="60" height="14" rx="4" fill="#efe9db" />
      <rect x="34" y="374" width="52" height="30" rx="6" fill="#e4ddcb" />
    </svg>
  )
}

/** Abstract illustrated bust used as a placeholder avatar (never a real likeness). */
export function PersonAvatar({ className = "", tone = "#1789a3", skin = "#caa987" }) {
  const bgId = nextGradientId("avatarbg")
  return (
    <svg
      viewBox="0 0 200 220"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={tone} stopOpacity="0.35" />
          <stop offset="100%" stopColor={tone} stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <rect width="200" height="220" fill={`url(#${bgId})`} />
      <path d="M20 220c8-46 46-72 80-72s72 26 80 72Z" fill={tone} opacity="0.9" />
      <path d="M78 156h44l10 20-32 14-32-14Z" fill="#f5f8f6" />
      <circle cx="100" cy="92" r="46" fill={skin} />
      <path d="M55 88a45 45 0 0 1 90 0c0-8-6-12-14-12-4-10-14-16-31-16s-27 6-31 16c-8 0-14 4-14 12Z" fill="#4a3527" />
    </svg>
  )
}

/** Small rounded capsule/softgel icon used in compact contexts. */
export function CapsuleArt({ className = "" }) {
  return (
    <svg viewBox="0 0 120 60" className={className} role="img" aria-label="Capsule">
      <defs>
        <linearGradient id="capsule-a" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f2b25a" />
          <stop offset="100%" stopColor="#e28a2b" />
        </linearGradient>
        <linearGradient id="capsule-b" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fbead2" />
          <stop offset="100%" stopColor="#f3d9ae" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="112" height="52" rx="26" fill="url(#capsule-b)" />
      <path d="M60 4h30a26 26 0 0 1 0 52H60Z" fill="url(#capsule-a)" />
    </svg>
  )
}
