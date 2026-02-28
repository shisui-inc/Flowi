'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { X } from 'lucide-react'

export default function TransactionModal({ onClose, onSaved, editTx = null, categories = [] }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    type: editTx?.type || 'expense',
    amount: editTx?.amount || '',
    description: editTx?.description || '',
    category_id: editTx?.category_id || '',
    date: editTx?.date || new Date().toISOString().slice(0, 10),
    notes: editTx?.notes || '',
  })

  const filteredCats = categories.filter(c => c.type === form.type || c.type === 'both')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async (e) => {
    e.preventDefault()
    if (!form.amount || !form.description) return
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const payload = { ...form, amount: parseFloat(form.amount), user_id: user.id, category_id: form.category_id || null }
    let error
    if (editTx) {
      ; ({ error } = await supabase.from('transactions').update(payload).eq('id', editTx.id))
    } else {
      ; ({ error } = await supabase.from('transactions').insert(payload))
    }
    setLoading(false)
    if (!error) onSaved()
    else alert(error.message)
  }

  return (
    <>
      {/* Liquid Glass overlay */}
      <div
        className="glass-overlay"
        onClick={onClose}
        style={{ zIndex: 999 }}
      />

      {/* Liquid Glass modal */}
      <div
        className="glass-strong"
        onClick={e => e.stopPropagation()}
        style={s.modal}
      >
        {/* Header */}
        <div style={s.header}>
          <h2 style={s.title}>{editTx ? 'Editar movimiento' : 'Nuevo movimiento'}</h2>
          <button
            onClick={onClose}
            style={s.closeBtn}
            aria-label="Cerrar"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={save} style={s.body}>
          {/* Type toggle */}
          <div style={s.typeSeg}>
            {[
              { val: 'expense', emoji: '💸', label: 'Gasto' },
              { val: 'income', emoji: '💵', label: 'Ingreso' },
            ].map(({ val, emoji, label }) => (
              <button
                key={val}
                type="button"
                onClick={() => set('type', val)}
                style={{
                  ...s.typeBtn,
                  ...(form.type === val
                    ? val === 'expense' ? s.typeBtnExpense : s.typeBtnIncome
                    : {}),
                }}
              >
                {emoji} {label}
              </button>
            ))}
          </div>

          {/* Big amount input */}
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={s.amountLabel}>Monto</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <span style={s.currencySign}>$</span>
              <input
                type="number" min="0" step="0.01" required
                value={form.amount} onChange={e => set('amount', e.target.value)}
                placeholder="0.00"
                style={{
                  ...s.amountInput,
                  color: form.type === 'income' ? 'var(--lime)' : 'var(--red)',
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div className="input-wrap">
            <label className="input-label">Descripción</label>
            <input className="input" type="text" placeholder="Ej: Supermercado, Salario..." required value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          <div className="grid-2">
            <div className="input-wrap">
              <label className="input-label">Categoría</label>
              <select className="input" value={form.category_id} onChange={e => set('category_id', e.target.value)}>
                <option value="">Sin categoría</option>
                {filteredCats.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <div className="input-wrap">
              <label className="input-label">Fecha</label>
              <input className="input" type="date" required value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
          </div>

          <div className="input-wrap">
            <label className="input-label">Notas (opcional)</label>
            <textarea className="input" rows={2} placeholder="Detalles adicionales..." value={form.notes} onChange={e => set('notes', e.target.value)} style={{ resize: 'none' }} />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" className="btn-glass-secondary" onClick={onClose} style={{ flex: 1, padding: '12px', fontSize: 13 }}>Cancelar</button>
            <button type="submit" className="btn-glass-primary" disabled={loading} style={{ flex: 2, padding: '12px', fontSize: 13 }}>
              {loading ? <span className="spinner" /> : editTx ? 'Guardar cambios' : 'Guardar →'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

const s = {
  modal: {
    position: 'fixed',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(500px, calc(100vw - 32px))',
    maxHeight: '90dvh',
    overflowY: 'auto',
    zIndex: 1000,
    /* glass-strong handles blur/border/shadow */
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '22px 24px 0',
    position: 'relative', zIndex: 3,
  },
  title: { fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.3px' },
  closeBtn: {
    width: 32, height: 32, borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid var(--glass-border)',
    color: 'var(--text-2)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.15s',
    boxShadow: '0 0 0 0.5px rgba(255,255,255,0.06) inset',
  },
  body: {
    display: 'flex', flexDirection: 'column', gap: 18,
    padding: '20px 24px 24px',
    position: 'relative', zIndex: 3,
  },
  typeSeg: {
    display: 'flex', gap: 8,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--glass-border)',
    borderRadius: 14, padding: 4,
  },
  typeBtn: {
    flex: 1, padding: '10px', borderRadius: 10,
    border: 'none', background: 'transparent',
    color: 'var(--text-3)', fontSize: 14, fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.18s ease',
    fontFamily: 'var(--font-body)',
  },
  typeBtnExpense: {
    background: 'rgba(255, 107, 107, 0.15)',
    boxShadow: '0 0 0 1px rgba(255,107,107,0.25) inset',
    color: 'var(--red)',
  },
  typeBtnIncome: {
    background: 'rgba(200,244,77,0.12)',
    boxShadow: '0 0 0 1px rgba(200,244,77,0.22) inset',
    color: 'var(--lime)',
  },
  amountLabel: { fontSize: 11, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 },
  currencySign: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-2)' },
  amountInput: {
    background: 'none', border: 'none', outline: 'none',
    fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 800, letterSpacing: '-2px',
    width: '200px', textAlign: 'center',
  },
}
