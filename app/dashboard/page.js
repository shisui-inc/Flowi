'use client'
import { useEffect, useState } from 'react'
import { createClient, formatCurrency } from '@/lib/supabase'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import TransactionModal from '@/components/TransactionModal'
import { ToastContainer, useToast } from '@/components/Toast'
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Sun, Moon, Plus, ArrowLeftRight, TrendingUp, Clock,
  PiggyBank, ChevronRight, Lightbulb, BarChart3, CreditCard,
} from 'lucide-react'

export default function DashboardPage() {
  const supabase = createClient()
  const { toasts, show: toast } = useToast()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [theme, setTheme] = useState('dark')

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUser(user)
    const [{ data: prof }, { data: txs }, { data: cats }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('transactions').select('*, categories(name,icon,color)').eq('user_id', user.id).order('date', { ascending: false }).limit(200),
      supabase.from('categories').select('*').eq('user_id', user.id),
    ])
    setProfile(prof)
    setTransactions(txs || [])
    setCategories(cats || [])
    setTheme(prof?.theme || 'dark')
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toggleTheme = async () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    if (user) await supabase.from('profiles').update({ theme: next }).eq('id', user.id)
  }

  // ── Computed values ────────────────────────────
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)
  const monthTxs = transactions.filter(t => { const d = parseISO(t.date); return d >= monthStart && d <= monthEnd })
  const income = monthTxs.filter(t => t.type === 'income').reduce((a, t) => a + Number(t.amount), 0)
  const expenses = monthTxs.filter(t => t.type === 'expense').reduce((a, t) => a + Number(t.amount), 0)
  const balance = income - expenses
  const savingRate = income > 0 ? Math.round((balance / income) * 100) : 0

  // Last 6 months area chart
  const areaData = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(now, 5 - i)
    const label = format(d, 'MMM', { locale: es })
    const ms = startOfMonth(d), me = endOfMonth(d)
    const mo = transactions.filter(t => { const td = parseISO(t.date); return td >= ms && td <= me })
    return {
      month: label,
      Ingresos: mo.filter(t => t.type === 'income').reduce((a, t) => a + Number(t.amount), 0),
      Gastos: mo.filter(t => t.type === 'expense').reduce((a, t) => a + Number(t.amount), 0),
    }
  })

  // Category pie
  const catData = categories
    .filter(c => c.type === 'expense' || c.type === 'both')
    .map(cat => {
      const val = monthTxs.filter(t => t.type === 'expense' && t.category_id === cat.id).reduce((a, t) => a + Number(t.amount), 0)
      return { name: cat.name, value: val, color: cat.color, icon: cat.icon }
    })
    .filter(c => c.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)

  const recentTxs = transactions.slice(0, 8)
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 14px' }}>
        <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 6 }}>{label}</div>
        {payload.map(p => (
          <div key={p.name} style={{ fontSize: 13, fontWeight: 600, color: p.name === 'Ingresos' ? 'var(--lime)' : 'var(--red)' }}>
            {p.name}: {formatCurrency(p.value, profile?.currency)}
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ display: 'grid', gap: 20 }}>
        <div className="skeleton" style={{ height: 120, borderRadius: 24 }} />
        <div className="grid-4" style={{ gap: 16 }}>
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 20 }} />)}
        </div>
        <div className="skeleton" style={{ height: 240, borderRadius: 24 }} />
      </div>
    )
  }

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div className="animate-fadeUp">
          <p style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 300, marginBottom: 4 }}>
            {greeting} 👋
          </p>
          <h1 className="h1">{profile?.name || 'Usuario'}</h1>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="animate-fadeUp delay-1">
          <button className="btn btn-icon" onClick={toggleTheme} title="Cambiar tema">
            {theme === 'dark'
              ? <Sun size={16} strokeWidth={1.8} />
              : <Moon size={16} strokeWidth={1.8} />}
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={14} strokeWidth={2.5} /> Nuevo
          </button>
        </div>
      </div>

      {/* ── Balance hero card ── */}
      <div className="card animate-fadeUp delay-1" style={{
        background: 'linear-gradient(135deg, var(--lime) 0%, #9fe030 50%, #7BE8D5 100%)',
        border: 'none', padding: '36px 28px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'rgba(255,255,255,0.12)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -60, left: 120, width: 150, height: 150, background: 'rgba(0,0,0,0.06)', borderRadius: '50%' }} />
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.5)', marginBottom: 10 }}>Balance del mes</p>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(26px, 7vw, 52px)',
          fontWeight: 800, color: '#000',
          letterSpacing: '-1.5px', lineHeight: 1,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {formatCurrency(balance, profile?.currency)}
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Ingresos</p>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(13px, 3.5vw, 20px)',
              fontWeight: 800, color: '#000',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>+{formatCurrency(income, profile?.currency)}</p>
          </div>
          <div style={{ width: 1, height: 32, background: 'rgba(0,0,0,0.15)', flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Gastos</p>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(13px, 3.5vw, 20px)',
              fontWeight: 800, color: '#000',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>-{formatCurrency(expenses, profile?.currency)}</p>
          </div>
          <div style={{ marginLeft: 'auto', background: 'rgba(0,0,0,0.12)', borderRadius: 100, padding: '8px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: '#000' }}>{savingRate}%</span>
            <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.5)', fontWeight: 600, textTransform: 'uppercase' }}>Ahorro</span>
          </div>
        </div>
      </div>

      {/* ── Quick stats ── */}
      <div className="grid-4 animate-fadeUp delay-2">
        {[
          { label: 'Transacciones', value: monthTxs.length, Icon: ArrowLeftRight, color: 'var(--teal)' },
          { label: 'Mayor gasto', value: formatCurrency(Math.max(...monthTxs.filter(t => t.type === 'expense').map(t => Number(t.amount)), 0), profile?.currency), Icon: TrendingUp, color: 'var(--red)' },
          { label: 'Prom. diario', value: formatCurrency(expenses / Math.max(now.getDate(), 1), profile?.currency), Icon: Clock, color: 'var(--yellow)' },
          { label: 'Tasa de ahorro', value: `${savingRate}%`, Icon: PiggyBank, color: 'var(--lime)', highlight: savingRate >= 20 },
        ].map((stat, i) => (
          <div key={i} className="glass-card hover-lift" style={{ padding: '20px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                <stat.Icon size={16} strokeWidth={1.8} />
              </div>
              {stat.highlight && <span className="glass-badge glass-badge-lime">Meta</span>}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(14px, 2.8vw, 20px)',
              fontWeight: 800,
              color: stat.highlight ? 'var(--lime)' : 'var(--text)',
              letterSpacing: '-0.5px',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4, fontWeight: 300 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }} className="animate-fadeUp delay-3">
        {/* Area chart */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h3 className="h3">Flujo de 6 meses</h3>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Ingresos vs gastos</p>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--lime)' }} />
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Ingresos</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--red)' }} />
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Gastos</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={areaData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8F44D" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#C8F44D" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Ingresos" stroke="#C8F44D" strokeWidth={2.5} fill="url(#gIncome)" dot={false} />
              <Area type="monotone" dataKey="Gastos" stroke="#FF6B6B" strokeWidth={2.5} fill="url(#gExpense)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="glass-card">
          <div style={{ marginBottom: 20 }}>
            <h3 className="h3">Por categoría</h3>
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Gastos este mes</p>
          </div>
          {catData.length > 0 ? (
            <>
              <PieChart width={180} height={130} style={{ margin: '0 auto 16px' }}>
                <Pie data={catData} cx={85} cy={60} innerRadius={36} outerRadius={58} dataKey="value" strokeWidth={0}>
                  {catData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {catData.slice(0, 4).map(cat => (
                  <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 12, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', flexShrink: 0, maxWidth: '55%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formatCurrency(cat.value, profile?.currency)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <BarChart3 size={36} strokeWidth={1.2} color="var(--text-3)" style={{ opacity: 0.5, marginBottom: 8 }} />
              <p className="empty-sub">Agrega gastos para ver el desglose</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Recent transactions ── */}
      <div className="glass-card animate-fadeUp delay-4">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 className="h3">Movimientos recientes</h3>
          <a href="/dashboard/transactions" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--lime)', textDecoration: 'none', fontWeight: 600 }}>
            Ver todos <ChevronRight size={14} strokeWidth={2} />
          </a>
        </div>
        {recentTxs.length === 0 ? (
          <div className="empty-state">
            <CreditCard size={40} strokeWidth={1.2} color="var(--text-3)" style={{ opacity: 0.5, marginBottom: 8 }} />
            <div className="empty-title">Sin movimientos aún</div>
            <p className="empty-sub">Toca &quot;+ Nuevo&quot; para registrar tu primer ingreso o gasto</p>
            <button className="btn-glass-primary" onClick={() => setShowModal(true)} style={{ marginTop: 8, padding: '8px 20px', fontSize: 13 }}>Agregar ahora</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recentTxs.map((tx) => {
              const cat = tx.categories
              return (
                <div key={tx.id} className="hover-lift" style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 14px', borderRadius: 14, transition: 'background 0.15s',
                  cursor: 'default',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: 42, height: 42, borderRadius: 13,
                    background: `${cat?.color || '#888'}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, flexShrink: 0,
                  }}>
                    {cat?.icon || '📦'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1 }}>{cat?.name || 'Sin categoría'} · {format(parseISO(tx.date), 'd MMM', { locale: es })}</div>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(12px, 3vw, 15px)',
                    fontWeight: 800,
                    color: tx.type === 'income' ? 'var(--lime)' : 'var(--text)',
                    flexShrink: 0,
                    maxWidth: 120,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, profile?.currency)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Tip card ── */}
      <div className="glass-lime animate-fadeUp delay-5" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <Lightbulb size={22} strokeWidth={1.8} color="var(--lime)" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--lime)', marginBottom: 4 }}>Consejo del día</div>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, fontWeight: 300 }}>
              {savingRate >= 20
                ? `¡Vas genial! Estás ahorrando el ${savingRate}% de tus ingresos. Considera invertir una parte en un fondo de bajo riesgo.`
                : savingRate > 0
                  ? `Tu tasa de ahorro es ${savingRate}%. La meta recomendada es 20%. Revisa tus gastos en entretenimiento y compras.`
                  : 'Aún no registras ingresos este mes. Empieza añadiendo tu salario para ver tu salud financiera.'}
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <TransactionModal
          categories={categories}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); load(); toast('Movimiento guardado ✓', 'success') }}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  )
}
