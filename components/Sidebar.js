'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { LayoutDashboard, ArrowLeftRight, Target, Wallet, Settings, LogOut } from 'lucide-react'

const NAV = [
  { href: '/dashboard', Icon: LayoutDashboard, label: 'Inicio' },
  { href: '/dashboard/transactions', Icon: ArrowLeftRight, label: 'Movimientos' },
  { href: '/dashboard/goals', Icon: Target, label: 'Metas' },
  { href: '/dashboard/budgets', Icon: Wallet, label: 'Presupuestos' },
  { href: '/dashboard/settings', Icon: Settings, label: 'Ajustes' },
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
    <aside className="glass-strong" style={s.aside}>
      {/* Logo */}
      <div style={s.logo}>
        <span style={s.logoText}>flowi</span>
        <span style={s.logoDot}>.</span>
      </div>

      {/* Nav */}
      <nav style={s.nav}>
        {NAV.map(({ href, Icon, label }) => {
          const active = href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(href)
          return (
            <Link key={href} href={href} className={`sidebar-item ${active ? 'active' : ''}`}>
              <span style={s.navIconWrap}>
                <Icon size={17} strokeWidth={active ? 2.2 : 1.7} color={active ? 'var(--accent-lime)' : 'var(--text-secondary)'} />
              </span>
              <span style={{ flex: 1 }}>{label}</span>
              {active && <div style={s.navDot} />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={s.bottom}>
        <div style={s.userRow}>
          <div style={s.avatar}>{initials}</div>
          <div style={s.userInfo}>
            <div style={s.userName}>{profile?.name || 'Usuario'}</div>
            <div style={s.userEmail}>{user?.email}</div>
          </div>
        </div>
        <button style={s.signOut} onClick={signOut} disabled={signingOut}>
          <LogOut size={13} strokeWidth={1.8} />
          {signingOut ? 'Saliendo...' : 'Cerrar sesión'}
        </button>
      </div>
    </aside>
  )
}

const s = {
  aside: {
    height: '100vh',
    position: 'sticky',
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    padding: '28px 16px',
    /* glass-strong handles background/border/blur */
    borderRight: '1px solid var(--glass-border)',
    borderRadius: 0,  /* override glass-strong radius for sidebar */
  },
  logo: { display: 'flex', alignItems: 'baseline', gap: 1, padding: '0 8px', marginBottom: 36 },
  logoText: { fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' },
  logoDot: { fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--lime)' },
  nav: { display: 'flex', flexDirection: 'column', gap: 2, flex: 1 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 11,
    padding: '10px 12px', borderRadius: 'var(--r-md)',
    textDecoration: 'none', color: 'var(--text-3)',
    fontSize: 14, fontWeight: 500,
    transition: 'all 0.18s ease',
    position: 'relative', cursor: 'pointer',
  },
  navActive: {
    background: 'rgba(200,244,77,0.08)',
    boxShadow: '0 0 0 1px rgba(200,244,77,0.15) inset',
    color: 'var(--lime)', fontWeight: 700,
  },
  navIconWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, flexShrink: 0 },
  navLabel: { flex: 1 },
  navDot: { width: 5, height: 5, borderRadius: '50%', background: 'var(--lime)', flexShrink: 0, boxShadow: '0 0 6px var(--lime)' },
  bottom: { display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 16, borderTop: '1px solid var(--glass-border)' },
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
    borderRadius: 8, transition: 'color 0.15s',
    fontFamily: 'var(--font-body)', fontWeight: 400,
    display: 'flex', alignItems: 'center', gap: 7,
  },
}
