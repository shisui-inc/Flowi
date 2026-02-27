'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import BottomNavBar from '@/components/BottomNavBar'
import { useRouter } from 'next/navigation'

export default function DashboardLayoutClient({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      if (data?.theme) document.documentElement.setAttribute('data-theme', data.theme)
      setLoading(false)
    }
    load()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') router.push('/auth/login')
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{ height: '100dvh', background: '#080810', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: '#fff' }}>
          flowi<span style={{ color: '#C8F44D' }}>.</span>
        </div>
        <div className="spinner" style={{ width: 28, height: 28 }} />
      </div>
    )
  }

  return (
    <QuickAddWrapper router={router}>
      {({ openQuickAdd }) => (
        <div className="app-shell">
          {/* Desktop sidebar */}
          <div className="desktop-sidebar">
            <Sidebar user={user} profile={profile} />
          </div>

          {/* Mobile top bar */}
          <TopBar />

          {/* Main scrollable content */}
          <main className="main-content">
            {children}
          </main>

          {/* FAB — mobile only */}
          <button
            className="fab"
            aria-label="Agregar gasto rápido"
            onClick={openQuickAdd}
          >
            <span className="fab__icon">+</span>
          </button>

          {/* Mobile bottom navigation */}
          <BottomNavBar />
        </div>
      )}
    </QuickAddWrapper>
  )
}

// Wrapper that owns the modal state so it sits above the app-shell in the tree
function QuickAddWrapper({ children, router }) {
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [QuickAddModal, setQuickAddModal] = useState(null)

  const openQuickAdd = async () => {
    if (!QuickAddModal) {
      const mod = await import('@/components/QuickAddModal')
      setQuickAddModal(() => mod.default)
    }
    setShowQuickAdd(true)
  }

  return (
    <>
      {children({ openQuickAdd })}
      {showQuickAdd && QuickAddModal && (
        <QuickAddModal
          onClose={() => setShowQuickAdd(false)}
          onSaved={() => {
            setShowQuickAdd(false)
            router.refresh()
          }}
        />
      )}
    </>
  )
}
