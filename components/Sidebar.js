'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const NAV = [
  { href: '/dashboard', icon: '⬡', label: 'Inicio' },
  { href: '/dashboard/transactions', icon: '⇄', label: 'Movimientos' },
  { href: '/dashboard/goals', icon: '◎', label: 'Metas' },
  { href: '/dashboard/budgets', icon: '▦', label: 'Presupuestos' },
  { href: '/dashboard/settings', icon: '◈', label: 'Ajustes' },
]

export default function Sidebar({ user, profile }) {
  const pathname = usePathname()
  const supabase = createClient()
  const [signingOut, setSigningOut] = useState(false)

  const signOut = async () => {
    setSigningOut(true)
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  const initials = (profile?.name || user?.email || 'U')
    .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <aside style={s.aside}>
      {/* Logo */}
      <div style={s.logo}>
        <span style={s.logoText}>flowi</span>
        <span style={s.logoDot}>.</span>
      </div>

      {/* Nav */}
      <nav style={s.nav}>
        {NAV.map(item => {
          const active = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href} style={{ ...s.navItem, ...(active ? s.navActive : {}) }}>
              <span style={{ ...s.navIcon, ...(active ? s.navIconActive : {}) }}>{item.icon}</span>
              <span style={s.navLabel}>{item.label}</span>
              {active && <div style={s.navDot} />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div style={s.bottom}>
        <div style={s.userRow}>
          <div style={s.avatar}>{initials}</div>
          <div style={s.userInfo}>
            <div style={s.userName}>{profile?.name || 'Usuario'}</div>
            <div style={s.userEmail}>{user?.email}</div>
          </div>
        </div>
        <button style={s.signOut} onClick={signOut} disabled={signingOut}>
          {signingOut ? '...' : '↩ Salir'}
        </button>
      </div>
    </aside>
  )
}

const s = {
  aside: {
    background: 'var(--bg2)',
    borderRight: '1px solid var(--border)',
    height: '100vh',
    position: 'sticky',
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    padding: '28px 16px',
    '@media (max-width: 768px)': { display: 'none' },
  },
  logo: { display: 'flex', alignItems: 'baseline', gap: 1, padding: '0 8px', marginBottom: 36 },
  logoText: { fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' },
  logoDot: { fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--lime)' },
  nav: { display: 'flex', flexDirection: 'column', gap: 2, flex: 1 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '11px 12px', borderRadius: 'var(--r-md)',
    textDecoration: 'none', color: 'var(--text-3)',
    fontSize: 14, fontWeight: 500,
    transition: 'all 0.18s ease',
    position: 'relative',
    cursor: 'pointer',
  },
  navActive: {
    background: 'var(--lime-dim)',
    color: 'var(--lime)',
    fontWeight: 700,
  },
  navIcon: { fontSize: 16, width: 20, textAlign: 'center', flexShrink: 0 },
  navIconActive: { filter: 'none' },
  navLabel: { flex: 1 },
  navDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: 'var(--lime)',
    flexShrink: 0,
  },
  bottom: { display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 16, borderTop: '1px solid var(--border)' },
  userRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px', borderRadius: 'var(--r-md)' },
  avatar: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--lime), #9fe030)',
    color: '#000', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  userInfo: { flex: 1, minWidth: 0 },
  userName: { fontSize: 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  userEmail: { fontSize: 11, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  signOut: {
    background: 'transparent', border: 'none', cursor: 'pointer',
    color: 'var(--text-3)', fontSize: 12, padding: '8px 12px',
    borderRadius: 8, textAlign: 'left', transition: 'color 0.15s',
    fontFamily: 'var(--font-body)', fontWeight: 400,
  },
}
