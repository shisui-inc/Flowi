'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, ArrowLeftRight, Target, UserRound } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', Icon: House, label: 'Inicio' },
  { href: '/dashboard/transactions', Icon: ArrowLeftRight, label: 'Historial' },
  { href: '/dashboard/budgets', Icon: Target, label: 'Límites' },
  { href: '/dashboard/settings', Icon: UserRound, label: 'Perfil' },
]

export default function BottomNavBar() {
  const pathname = usePathname()

  return (
    <nav className="bottom-nav" style={s.nav} aria-label="Navegación principal">
      {/* Hidden SVG refraction filter */}
      <svg className="glass-filters" aria-hidden="true">
        <defs>
          <filter id="glass-refract">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className="glass-nav" style={s.pill}>
        {NAV_ITEMS.map(({ href, Icon, label }) => {
          const isActive =
            href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              style={{ ...s.item, ...(isActive ? s.itemActive : {}) }}
              aria-current={isActive ? 'page' : undefined}
            >
              <span style={{ ...s.iconWrap, ...(isActive ? s.iconWrapActive : {}) }}>
                <Icon size={21} strokeWidth={isActive ? 2.2 : 1.6} absoluteStrokeWidth />
              </span>
              <span style={{ ...s.label, ...(isActive ? s.labelActive : {}) }}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

const s = {
  nav: {
    position: 'fixed',
    bottom: 0, left: 0, right: 0,
    display: 'flex',
    justifyContent: 'center',
    padding: '0 16px calc(20px + env(safe-area-inset-bottom, 0px))',
    background: 'transparent',
    zIndex: 200,
    pointerEvents: 'none',
  },
  pill: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 4,
    borderRadius: 36,
    padding: '8px 12px',
    width: '100%',
    maxWidth: 400,
    pointerEvents: 'all',
    /* glass-nav class handles background/border/shadow/blur */
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    textDecoration: 'none',
    color: 'var(--text-3)',
    padding: '5px 14px',
    borderRadius: 20,
    transition: 'color 0.2s ease',
    WebkitTapHighlightColor: 'transparent',
    minWidth: 58,
    position: 'relative',
    zIndex: 3, /* above ::before and ::after pseudo-elements */
  },
  itemActive: { color: 'var(--accent-lime)' },
  iconWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36, height: 36,
    borderRadius: 11,
    transition: 'background 0.2s ease, transform 0.22s cubic-bezier(0.34,1.5,0.64,1)',
  },
  iconWrapActive: {
    background: 'rgba(200,244,77,0.15)',
    boxShadow: '0 0 0 1px rgba(200,244,77,0.2) inset, 0 2px 8px rgba(200,244,77,0.12)',
    transform: 'scale(1.1) translateY(-2px)',
  },
  label: { fontSize: 10, fontWeight: 600, letterSpacing: '0.03em', transition: 'color 0.2s ease' },
  labelActive: { color: 'var(--accent-lime)' },
}
