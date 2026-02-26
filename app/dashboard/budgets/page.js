'use client'
import { useEffect, useState, useMemo } from 'react'
import { createClient, formatCurrency } from '@/lib/supabase'
import { ToastContainer, useToast } from '@/components/Toast'
import { startOfMonth, endOfMonth, format } from 'date-fns'
import { es } from 'date-fns/locale'

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function BudgetModal({ budget, categories, month, year, onClose, onSaved }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    category_id: budget?.category_id || '',
    limit_amount: budget?.limit_amount || '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const payload = { user_id: user.id, category_id: form.category_id, limit_amount: parseFloat(form.limit_amount), month, year }
    let error
    if (budget) { ;({ error } = await supabase.from('budgets').update({ limit_amount: payload.limit_amount }).eq('id', budget.id)) }
    else { ;({ error } = await supabase.from('budgets').upsert(payload, { onConflict: 'user_id,category_id,month,year' })) }
    setLoading(false)
    if (!error) onSaved()
    else alert(error.message)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="h2">{budget ? 'Editar presupuesto' : 'Nuevo presupuesto'}</h2>
          <button className="btn btn-icon" onClick={onClose} style={{ fontSize: 20 }}>×</button>
        </div>
        <form onSubmit={save} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: '8px 12px', background: 'var(--lime-dim)', border: '1px solid rgba(200,244,77,0.2)', borderRadius: 10, fontSize: 13, color: 'var(--lime)', fontWeight: 600 }}>
            📅 {MONTHS[month - 1]} {year}
          </div>
          <div className="input-wrap">
            <label className="input-label">Categoría</label>
            <select className="input" required value={form.category_id} onChange={e => set('category_id', e.target.value)} disabled={!!budget}>
              <option value="">Selecciona una categoría</option>
              {categories.filter(c => c.type === 'expense' || c.type === 'both').map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
          <div className="input-wrap">
            <label className="input-label">Límite mensual ($)</label>
            <input className="input" type="number" min="1" step="0.01" required placeholder="500" value={form.limit_amount} onChange={e => set('limit_amount', e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2 }}>
              {loading ? <span className="spinner" /> : budget ? 'Guardar' : 'Crear presupuesto →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function BudgetsPage() {
  const supabase = createClient()
  const { toasts, show: toast } = useToast()
  const now = new Date()
  const [selMonth, setSelMonth] = useState(now.getMonth() + 1)
  const [selYear, setSelYear] = useState(now.getFullYear())
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])
  const [transactions, setTransactions] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editBudget, setEditBudget] = useState(null)

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    const ms = startOfMonth(new Date(selYear, selMonth - 1))
    const me = endOfMonth(new Date(selYear, selMonth - 1))
    const [{ data: prof }, { data: bs }, { data: cats }, { data: txs }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('budgets').select('*, categories(name,icon,color)').eq('user_id', user.id).eq('month', selMonth).eq('year', selYear),
      supabase.from('categories').select('*').eq('user_id', user.id),
      supabase.from('transactions').select('*').eq('user_id', user.id).eq('type', 'expense').gte('date', ms.toISOString().slice(0,10)).lte('date', me.toISOString().slice(0,10)),
    ])
    setProfile(prof); setBudgets(bs || []); setCategories(cats || []); setTransactions(txs || [])
    setLoading(false)
  }

  useEffect(() => { setLoading(true); load() }, [selMonth, selYear])

  const deleteBudget = async (id) => {
    await supabase.from('budgets').delete().eq('id', id)
    toast('Presupuesto eliminado', 'default')
    load()
  }

  // Spending per category
  const spending = useMemo(() => {
    const map = {}
    transactions.forEach(t => {
      if (!map[t.category_id]) map[t.category_id] = 0
      map[t.category_id] += Number(t.amount)
    })
    return map
  }, [transactions])

  const budgetsWithSpending = budgets.map(b => ({
    ...b,
    spent: spending[b.category_id] || 0,
    pct: Math.min(((spending[b.category_id] || 0) / Number(b.limit_amount)) * 100, 100),
    over: (spending[b.category_id] || 0) > Number(b.limit_amount),
  }))

  const totalLimit = budgets.reduce((a, b) => a + Number(b.limit_amount), 0)
  const totalSpent = Object.values(spending).reduce((a, v) => a + v, 0)

  const years = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1]

  if (loading) return <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}><div className="spinner" style={{ width: 28, height: 28 }} /></div>

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="h1">Presupuestos</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 4 }}>Establece límites por categoría y controla tu gasto</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Month/Year selector */}
          <select className="input" value={selMonth} onChange={e => setSelMonth(Number(e.target.value))} style={{ width: 140 }}>
            {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
          </select>
          <select className="input" value={selYear} onChange={e => setSelYear(Number(e.target.value))} style={{ width: 90 }}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button className="btn btn-primary btn-sm" onClick={() => { setEditBudget(null); setShowModal(true) }}>+ Nuevo</button>
        </div>
      </div>

      {/* Month summary */}
      {budgets.length > 0 && (
        <div className="card card-pad">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800 }}>
                {MONTHS[selMonth - 1]} {selYear}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>
                {formatCurrency(totalSpent, profile?.currency)} gastado de {formatCurrency(totalLimit, profile?.currency)} presupuestado
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: totalSpent <= totalLimit ? 'var(--lime)' : 'var(--red)' }}>
                  {Math.round(totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0)}%
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>del presupuesto</div>
              </div>
            </div>
          </div>
          <div className="progress-track" style={{ height: 12 }}>
            <div className="progress-fill" style={{
              width: `${totalLimit > 0 ? Math.min((totalSpent/totalLimit)*100, 100) : 0}%`,
              background: totalSpent <= totalLimit * 0.8 ? 'var(--lime)' : totalSpent <= totalLimit ? 'var(--yellow)' : 'var(--red)',
            }} />
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><div style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--lime)' }} /><span style={{ fontSize: 12, color: 'var(--text-3)' }}>Bajo control</span></div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><div style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--yellow)' }} /><span style={{ fontSize: 12, color: 'var(--text-3)' }}>Cuidado (+80%)</span></div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><div style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--red)' }} /><span style={{ fontSize: 12, color: 'var(--text-3)' }}>Excedido</span></div>
          </div>
        </div>
      )}

      {/* Budget cards */}
      {budgets.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">▦</div>
            <div className="empty-title">Sin presupuestos</div>
            <p className="empty-sub">Crea presupuestos para controlar cuánto gastas en cada categoría este mes.</p>
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)} style={{ marginTop: 12 }}>Crear primer presupuesto</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {budgetsWithSpending.sort((a, b) => b.pct - a.pct).map(budget => {
            const cat = budget.categories
            const barColor = budget.pct >= 100 ? 'var(--red)' : budget.pct >= 80 ? 'var(--yellow)' : 'var(--lime)'
            return (
              <div key={budget.id} className="card card-pad" style={{ transition: 'border 0.2s', borderColor: budget.over ? 'rgba(255,107,107,0.3)' : 'var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: `${cat?.color || '#888'}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                    {cat?.icon || '📦'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{cat?.name || 'Categoría'}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1 }}>
                      {formatCurrency(budget.spent, profile?.currency)} de {formatCurrency(budget.limit_amount, profile?.currency)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: barColor }}>{Math.round(budget.pct)}%</div>
                    {budget.over && <span className="badge badge-red" style={{ fontSize: 10 }}>Excedido</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-icon" style={{ width: 32, height: 32 }} onClick={() => { setEditBudget(budget); setShowModal(true) }}>✏</button>
                    <button className="btn btn-icon" style={{ width: 32, height: 32, color: 'var(--red)' }} onClick={() => deleteBudget(budget.id)}>🗑</button>
                  </div>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${budget.pct}%`, background: barColor, transition: 'width 0.8s cubic-bezier(0.34,1.2,0.64,1)' }} />
                </div>
                {!budget.over && (
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>
                    Disponible: {formatCurrency(Number(budget.limit_amount) - budget.spent, profile?.currency)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <BudgetModal budget={editBudget} categories={categories} month={selMonth} year={selYear}
          onClose={() => { setShowModal(false); setEditBudget(null) }}
          onSaved={() => { setShowModal(false); setEditBudget(null); load(); toast(editBudget ? 'Presupuesto actualizado ✓' : 'Presupuesto creado ✓', 'success') }} />
      )}
      <ToastContainer toasts={toasts} />
    </div>
  )
}
