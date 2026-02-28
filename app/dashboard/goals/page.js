'use client'
import { useEffect, useState } from 'react'
import { createClient, formatCurrency } from '@/lib/supabase'
import { ToastContainer, useToast } from '@/components/Toast'

const COLORS = ['#C8F44D', '#7BE8D5', '#FFE66D', '#FF6B6B', '#B8B8FF', '#FFA07A', '#98D8C8', '#FF8B94']
const ICONS = ['🎯', '🏖', '🚗', '💻', '🏠', '✈️', '💍', '📚', '🎮', '👶', '🐕', '💪']

function GoalModal({ goal, onClose, onSaved }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: goal?.name || '',
    icon: goal?.icon || '🎯',
    target_amount: goal?.target_amount || '',
    current_amount: goal?.current_amount || 0,
    target_date: goal?.target_date || '',
    color: goal?.color || '#C8F44D',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const payload = { ...form, target_amount: parseFloat(form.target_amount), current_amount: parseFloat(form.current_amount) || 0, user_id: user.id }
    let error
    if (goal) { ; ({ error } = await supabase.from('savings_goals').update(payload).eq('id', goal.id)) }
    else { ; ({ error } = await supabase.from('savings_goals').insert(payload)) }
    setLoading(false)
    if (!error) onSaved()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="h2">{goal ? 'Editar meta' : 'Nueva meta'}</h2>
          <button className="btn btn-icon" onClick={onClose} style={{ fontSize: 20 }}>×</button>
        </div>
        <form onSubmit={save} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Icon & color picker */}
          <div>
            <div className="input-label" style={{ marginBottom: 8 }}>Icono</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ICONS.map(ico => (
                <button key={ico} type="button" onClick={() => set('icon', ico)}
                  style={{ width: 40, height: 40, fontSize: 20, border: `2px solid ${form.icon === ico ? 'var(--lime)' : 'var(--border)'}`, borderRadius: 10, background: form.icon === ico ? 'var(--lime-dim)' : 'var(--surface)', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {ico}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="input-label" style={{ marginBottom: 8 }}>Color</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => set('color', c)}
                  style={{ width: 32, height: 32, borderRadius: '50%', background: c, border: `3px solid ${form.color === c ? 'var(--text)' : 'transparent'}`, cursor: 'pointer', transition: 'transform 0.15s', transform: form.color === c ? 'scale(1.15)' : 'scale(1)' }} />
              ))}
            </div>
          </div>

          <div className="input-wrap">
            <label className="input-label">Nombre de la meta</label>
            <input className="input" placeholder="Ej: Fondo de emergencia, Viaje a Cancún..." required value={form.name} onChange={e => set('name', e.target.value)} />
          </div>

          <div className="grid-2">
            <div className="input-wrap">
              <label className="input-label">Meta ($)</label>
              <input className="input" type="number" min="1" step="0.01" required placeholder="5000" value={form.target_amount} onChange={e => set('target_amount', e.target.value)} />
            </div>
            <div className="input-wrap">
              <label className="input-label">Ahorrado hasta hoy ($)</label>
              <input className="input" type="number" min="0" step="0.01" placeholder="0" value={form.current_amount} onChange={e => set('current_amount', e.target.value)} />
            </div>
          </div>

          <div className="input-wrap">
            <label className="input-label">Fecha objetivo (opcional)</label>
            <input className="input" type="date" value={form.target_date} onChange={e => set('target_date', e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2 }}>
              {loading ? <span className="spinner" /> : goal ? 'Guardar cambios' : 'Crear meta →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AddFundsModal({ goal, onClose, onSaved, currency }) {
  const supabase = createClient()
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const remaining = goal.target_amount - goal.current_amount

  const save = async (e) => {
    e.preventDefault()
    setLoading(true)
    const newAmount = Math.min(Number(goal.current_amount) + Number(amount), Number(goal.target_amount))
    const completed = newAmount >= Number(goal.target_amount)
    await supabase.from('savings_goals').update({ current_amount: newAmount, completed }).eq('id', goal.id)
    setLoading(false)
    onSaved()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 380 }}>
        <div className="modal-header">
          <h2 className="h2">Agregar fondos</h2>
          <button className="btn btn-icon" onClick={onClose} style={{ fontSize: 20 }}>×</button>
        </div>
        <form onSubmit={save} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{goal.icon}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800 }}>{goal.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>Faltan {formatCurrency(remaining, currency)}</div>
          </div>
          <div className="input-wrap">
            <label className="input-label">¿Cuánto agregas?</label>
            <input className="input" type="number" min="0.01" max={remaining} step="0.01" placeholder="Monto a agregar" required value={amount} onChange={e => setAmount(e.target.value)} autoFocus />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[50, 100, 200, 500].filter(n => n <= remaining).map(n => (
              <button key={n} type="button" className="btn btn-secondary btn-sm" onClick={() => setAmount(n)}>{formatCurrency(n, currency)}</button>
            ))}
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setAmount(remaining)}>Todo ({formatCurrency(remaining, currency)})</button>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2 }}>
              {loading ? <span className="spinner" /> : '+ Agregar fondos'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function GoalsPage() {
  const supabase = createClient()
  const { toasts, show: toast } = useToast()
  const [goals, setGoals] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editGoal, setEditGoal] = useState(null)
  const [addFundsGoal, setAddFundsGoal] = useState(null)

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    const [{ data: prof }, { data: gs }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('savings_goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ])
    setProfile(prof); setGoals(gs || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const deleteGoal = async (id) => {
    if (!confirm('¿Eliminar esta meta?')) return
    await supabase.from('savings_goals').delete().eq('id', id)
    toast('Meta eliminada', 'default')
    load()
  }

  const totalSaved = goals.reduce((a, g) => a + Number(g.current_amount), 0)
  const totalTarget = goals.reduce((a, g) => a + Number(g.target_amount), 0)
  const completed = goals.filter(g => g.completed).length

  if (loading) return <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}><div className="spinner" style={{ width: 28, height: 28 }} /></div>

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="h1">Metas de ahorro</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 4 }}>{goals.length} metas · {completed} completadas</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => { setEditGoal(null); setShowModal(true) }}>+ Nueva meta</button>
      </div>

      {/* Summary */}
      {goals.length > 0 && (
        <div className="grid-3">
          {[
            { label: 'Total ahorrado', value: formatCurrency(totalSaved, profile?.currency), color: 'var(--lime)', icon: '💰' },
            { label: 'Meta total', value: formatCurrency(totalTarget, profile?.currency), color: 'var(--text)', icon: '🎯' },
            { label: 'Progreso global', value: `${totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%`, color: 'var(--teal)', icon: '📊' },
          ].map((s, i) => (
            <div key={i} className="glass-card card-pad">
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{s.label}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Global progress bar */}
      {goals.length > 0 && totalTarget > 0 && (
        <div className="glass-card card-pad">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Progreso total</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--lime)' }}>{Math.round((totalSaved / totalTarget) * 100)}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${Math.min((totalSaved / totalTarget) * 100, 100)}%`, background: 'linear-gradient(90deg, var(--lime), var(--teal))' }} />
          </div>
        </div>
      )}

      {/* Goals grid */}
      {goals.length === 0 ? (
        <div className="glass-card">
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <div className="empty-title">Sin metas aún</div>
            <p className="empty-sub">Crea tu primera meta de ahorro. Puede ser un viaje, un fondo de emergencia o cualquier sueño que tengas.</p>
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)} style={{ marginTop: 12 }}>Crear primera meta</button>
          </div>
        </div>
      ) : (
        <div className="grid-2" style={{ gap: 16 }}>
          {goals.map(goal => {
            const pct = Math.min((Number(goal.current_amount) / Number(goal.target_amount)) * 100, 100)
            const remaining = Number(goal.target_amount) - Number(goal.current_amount)
            return (
              <div key={goal.id} className="glass-card card-pad card--glow hover-lift" style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Accent top */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: goal.color, borderRadius: '24px 24px 0 0' }} />
                {goal.completed && (
                  <div style={{ position: 'absolute', top: 12, right: 12 }}>
                    <span className="badge badge-lime">✓ Completada</span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: `${goal.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                    {goal.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17 }}>{goal.name}</div>
                    {goal.target_date && (
                      <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>
                        📅 Meta: {new Date(goal.target_date).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: goal.color }}>{Math.round(pct)}%</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>{formatCurrency(goal.current_amount, profile?.currency)}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>de {formatCurrency(goal.target_amount, profile?.currency)}</div>
                    </div>
                  </div>
                  <div className="progress-track" style={{ height: 10 }}>
                    <div className="progress-fill" style={{ width: `${pct}%`, background: goal.color, boxShadow: goal.completed ? `0 0 12px ${goal.color}60` : 'none' }} />
                  </div>
                  {!goal.completed && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>Faltan {formatCurrency(remaining, profile?.currency)}</div>}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  {!goal.completed && (
                    <button className="btn btn-sm" onClick={() => setAddFundsGoal(goal)} style={{ flex: 1, background: `${goal.color}18`, color: goal.color, border: `1px solid ${goal.color}40`, fontWeight: 700 }}>
                      + Agregar
                    </button>
                  )}
                  <button className="btn btn-icon btn-sm" onClick={() => { setEditGoal(goal); setShowModal(true) }}>✏</button>
                  <button className="btn btn-icon btn-sm" onClick={() => deleteGoal(goal.id)} style={{ color: 'var(--red)' }}>🗑</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <GoalModal goal={editGoal} onClose={() => { setShowModal(false); setEditGoal(null) }}
          onSaved={() => { setShowModal(false); setEditGoal(null); load(); toast(editGoal ? 'Meta actualizada ✓' : 'Meta creada ✓', 'success') }} />
      )}

      {addFundsGoal && (
        <AddFundsModal goal={addFundsGoal} currency={profile?.currency}
          onClose={() => setAddFundsGoal(null)}
          onSaved={() => { setAddFundsGoal(null); load(); toast('Fondos agregados 💰', 'success') }} />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  )
}
