'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState, useMemo } from 'react'
import { createClient, formatCurrency, exportToCSV } from '@/lib/supabase'
import TransactionModal from '@/components/TransactionModal'
import { ToastContainer, useToast } from '@/components/Toast'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export default function TransactionsPage() {
  const supabase = createClient()
  const { toasts, show: toast } = useToast()
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTx, setEditTx] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [sortBy, setSortBy] = useState('date')

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    const [{ data: prof }, { data: txs }, { data: cats }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('transactions').select('*, categories(name,icon,color)').eq('user_id', user.id).order('date', { ascending: false }).order('created_at', { ascending: false }),
      supabase.from('categories').select('*').eq('user_id', user.id),
    ])
    setProfile(prof); setTransactions(txs || []); setCategories(cats || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const deleteTx = async (id) => {
    if (!confirm('¿Eliminar este movimiento?')) return
    await supabase.from('transactions').delete().eq('id', id)
    toast('Movimiento eliminado', 'default')
    load()
  }

  const filtered = useMemo(() => {
    return transactions
      .filter(t => filter === 'all' || t.type === filter)
      .filter(t => !catFilter || t.category_id === catFilter)
      .filter(t => !search || t.description.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'date') return parseISO(b.date) - parseISO(a.date)
        if (sortBy === 'amount') return Number(b.amount) - Number(a.amount)
        return 0
      })
  }, [transactions, filter, catFilter, search, sortBy])

  const totalIncome = filtered.filter(t => t.type === 'income').reduce((a, t) => a + Number(t.amount), 0)
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((a, t) => a + Number(t.amount), 0)

  // Group by date
  const grouped = useMemo(() => {
    const groups = {}
    filtered.forEach(tx => {
      const key = tx.date
      if (!groups[key]) groups[key] = []
      groups[key].push(tx)
    })
    return Object.entries(groups).sort((a, b) => parseISO(b[0]) - parseISO(a[0]))
  }, [filtered])

  if (loading) return <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}><div className="spinner" style={{ width: 28, height: 28 }} /></div>

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 className="h1">Movimientos</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 4 }}>{transactions.length} transacciones registradas</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => exportToCSV(filtered, categories)}>
            ⬇ Exportar CSV
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => { setEditTx(null); setShowModal(true) }}>+ Nuevo</button>
        </div>
      </div>

      {/* Summary pills */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div className="card card-pad-sm" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 16 }}>💵</span>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Ingresos filtrados</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--lime)', fontSize: 18 }}>+{formatCurrency(totalIncome, profile?.currency)}</div>
          </div>
        </div>
        <div className="card card-pad-sm" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 16 }}>💸</span>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Gastos filtrados</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--red)', fontSize: 18 }}>-{formatCurrency(totalExpense, profile?.currency)}</div>
          </div>
        </div>
        <div className="card card-pad-sm" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 16 }}>⚖</span>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Neto</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: totalIncome - totalExpense >= 0 ? 'var(--lime)' : 'var(--red)', fontSize: 18 }}>
              {formatCurrency(totalIncome - totalExpense, profile?.currency)}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card card-pad-sm" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <input className="input" placeholder="🔍 Buscar..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 180 }} />

        {/* Type filter */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[['all','Todos'],['income','Ingresos'],['expense','Gastos']].map(([val, label]) => (
            <button key={val} className={`btn btn-sm ${filter === val ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(val)}>{label}</button>
          ))}
        </div>

        {/* Category filter */}
        <select className="input" value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ minWidth: 160, flex: 0 }}>
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>

        {/* Sort */}
        <select className="input" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ minWidth: 140, flex: 0 }}>
          <option value="date">Más reciente</option>
          <option value="amount">Mayor monto</option>
        </select>
      </div>

      {/* Transaction list */}
      {grouped.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">💸</div>
            <div className="empty-title">Sin movimientos</div>
            <p className="empty-sub">{search || filter !== 'all' ? 'No hay resultados para tu búsqueda' : 'Registra tu primer ingreso o gasto'}</p>
            {!search && filter === 'all' && (
              <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)} style={{ marginTop: 12 }}>Agregar ahora</button>
            )}
          </div>
        </div>
      ) : (
        grouped.map(([date, txs]) => (
          <div key={date}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {format(parseISO(date), 'EEEE d MMMM', { locale: es })}
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                {formatCurrency(txs.filter(t=>t.type==='income').reduce((a,t)=>a+Number(t.amount),0) - txs.filter(t=>t.type==='expense').reduce((a,t)=>a+Number(t.amount),0), profile?.currency)}
              </span>
            </div>
            <div className="card" style={{ overflow: 'hidden' }}>
              {txs.map((tx, i) => {
                const cat = tx.categories
                return (
                  <div key={tx.id} style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
                    borderBottom: i < txs.length - 1 ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: `${cat?.color || '#888'}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                      {cat?.icon || '📦'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                        {cat?.name || 'Sin categoría'}
                        {tx.notes && <span> · {tx.notes}</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: tx.type === 'income' ? 'var(--lime)' : 'var(--text)' }}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, profile?.currency)}
                      </div>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', marginTop: 4 }}>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => { setEditTx(tx); setShowModal(true) }}>✏</button>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: 12, color: 'var(--red)' }} onClick={() => deleteTx(tx.id)}>🗑</button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}

      {showModal && (
        <TransactionModal
          categories={categories}
          editTx={editTx}
          onClose={() => { setShowModal(false); setEditTx(null) }}
          onSaved={() => { setShowModal(false); setEditTx(null); load(); toast(editTx ? 'Movimiento actualizado ✓' : 'Movimiento guardado ✓', 'success') }}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  )
}
