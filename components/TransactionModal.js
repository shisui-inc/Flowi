'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

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
      ;({ error } = await supabase.from('transactions').update(payload).eq('id', editTx.id))
    } else {
      ;({ error } = await supabase.from('transactions').insert(payload))
    }
    setLoading(false)
    if (!error) onSaved()
    else alert(error.message)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="h2">{editTx ? 'Editar movimiento' : 'Nuevo movimiento'}</h2>
          <button className="btn btn-icon" onClick={onClose} style={{ fontSize: 20 }}>×</button>
        </div>

        <form onSubmit={save} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Type toggle */}
          <div className="type-seg">
            <button type="button" className={`type-seg-btn ${form.type === 'expense' ? 'active-expense' : ''}`} onClick={() => set('type', 'expense')}>
              💸 Gasto
            </button>
            <button type="button" className={`type-seg-btn ${form.type === 'income' ? 'active-income' : ''}`} onClick={() => set('type', 'income')}>
              💵 Ingreso
            </button>
          </div>

          {/* Amount — big and prominent */}
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Monto</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-2)' }}>$</span>
              <input
                type="number" min="0" step="0.01" required
                value={form.amount} onChange={e => set('amount', e.target.value)}
                placeholder="0.00"
                style={{
                  background: 'none', border: 'none', outline: 'none',
                  fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 800, letterSpacing: '-2px',
                  color: form.type === 'income' ? 'var(--lime)' : 'var(--red)',
                  width: '200px', textAlign: 'center',
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
            {/* Category */}
            <div className="input-wrap">
              <label className="input-label">Categoría</label>
              <select className="input" value={form.category_id} onChange={e => set('category_id', e.target.value)}>
                <option value="">Sin categoría</option>
                {filteredCats.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="input-wrap">
              <label className="input-label">Fecha</label>
              <input className="input" type="date" required value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
          </div>

          {/* Notes */}
          <div className="input-wrap">
            <label className="input-label">Notas (opcional)</label>
            <textarea className="input" rows={2} placeholder="Detalles adicionales..." value={form.notes} onChange={e => set('notes', e.target.value)} style={{ resize: 'none' }} />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2 }}>
              {loading ? <span className="spinner" /> : editTx ? 'Guardar cambios' : 'Guardar →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
