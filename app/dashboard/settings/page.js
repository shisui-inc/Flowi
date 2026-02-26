'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { ToastContainer, useToast } from '@/components/Toast'

const CURRENCIES = [
  { code: 'USD', label: '$ Dólar USD' },
  { code: 'EUR', label: '€ Euro' },
  { code: 'MXN', label: '$ Peso Mexicano' },
  { code: 'COP', label: '$ Peso Colombiano' },
  { code: 'ARS', label: '$ Peso Argentino' },
  { code: 'CLP', label: '$ Peso Chileno' },
  { code: 'PEN', label: 'S/ Sol Peruano' },
  { code: 'BRL', label: 'R$ Real Brasileño' },
  { code: 'PYG', label: '₲ Guaraní Paraguayo' },
]

export default function SettingsPage() {
  const supabase = createClient()
  const { toasts, show: toast } = useToast()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', currency: 'USD', monthly_income: '' })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setForm({ name: data?.name || '', currency: data?.currency || 'USD', monthly_income: data?.monthly_income || '' })
      setLoading(false)
    }
    load()
  }, [])

  const saveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('profiles').update({ name: form.name, currency: form.currency, monthly_income: parseFloat(form.monthly_income) || 0 }).eq('id', user.id)
    setSaving(false)
    if (!error) toast('Perfil actualizado ✓', 'success')
    else toast('Error al guardar', 'error')
  }

  const toggleTheme = async () => {
    const next = profile?.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    setProfile(p => ({ ...p, theme: next }))
    await supabase.from('profiles').update({ theme: next }).eq('id', user.id)
    toast(`Tema ${next === 'dark' ? 'oscuro' : 'claro'} activado`, 'success')
  }

  const deleteAllData = async () => {
    if (!confirm('⚠️ Esto eliminará TODOS tus movimientos, metas y presupuestos. Esta acción no se puede deshacer. ¿Continuar?')) return
    if (!confirm('¿Estás completamente seguro?')) return
    await Promise.all([
      supabase.from('transactions').delete().eq('user_id', user.id),
      supabase.from('savings_goals').delete().eq('user_id', user.id),
      supabase.from('budgets').delete().eq('user_id', user.id),
    ])
    toast('Todos los datos han sido eliminados', 'default')
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  if (loading) return <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}><div className="spinner" style={{ width: 28, height: 28 }} /></div>

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 600 }}>
      <div>
        <h1 className="h1">Ajustes</h1>
        <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 4 }}>Personaliza tu experiencia Flowi</p>
      </div>

      {/* Profile */}
      <div className="card card-pad">
        <h2 className="h2" style={{ marginBottom: 20 }}>👤 Perfil</h2>
        <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--lime), #9fe030)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: '#000', flexShrink: 0 }}>
              {(form.name || user?.email || 'U').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{form.name || 'Sin nombre'}</div>
              <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{user?.email}</div>
            </div>
          </div>

          <div className="input-wrap">
            <label className="input-label">Tu nombre</label>
            <input className="input" type="text" placeholder="Nombre completo" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>

          <div className="grid-2">
            <div className="input-wrap">
              <label className="input-label">Moneda</label>
              <select className="input" value={form.currency} onChange={e => set('currency', e.target.value)}>
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
            </div>
            <div className="input-wrap">
              <label className="input-label">Ingreso mensual estimado</label>
              <input className="input" type="number" min="0" step="0.01" placeholder="1500" value={form.monthly_income} onChange={e => set('monthly_income', e.target.value)} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving} style={{ alignSelf: 'flex-start' }}>
            {saving ? <span className="spinner" /> : 'Guardar cambios'}
          </button>
        </form>
      </div>

      {/* Appearance */}
      <div className="card card-pad">
        <h2 className="h2" style={{ marginBottom: 20 }}>🎨 Apariencia</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{profile?.theme === 'dark' ? '🌙 Modo oscuro' : '☀️ Modo claro'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Cambia entre tema oscuro y claro</div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={profile?.theme === 'light'} onChange={toggleTheme} />
            <div className="toggle-track" />
            <div className="toggle-thumb" />
          </label>
        </div>
      </div>

      {/* Account info */}
      <div className="card card-pad">
        <h2 className="h2" style={{ marginBottom: 20 }}>🔑 Cuenta</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--surface)', borderRadius: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Correo electrónico</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{user?.email}</div>
            </div>
            <span className="badge badge-lime">Verificado</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--surface)', borderRadius: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Proveedor de autenticación</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                {user?.app_metadata?.provider === 'google' ? '🔵 Google' : '📧 Email / Contraseña'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--surface)', borderRadius: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Miembro desde</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                {new Date(user?.created_at).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="card card-pad" style={{ borderColor: 'rgba(255,107,107,0.2)' }}>
        <h2 className="h2" style={{ color: 'var(--red)', marginBottom: 8 }}>⚠️ Zona de peligro</h2>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20, lineHeight: 1.6 }}>Estas acciones son irreversibles. Procede con cuidado.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,107,107,0.05)', borderRadius: 12, border: '1px solid rgba(255,107,107,0.12)' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Eliminar todos los datos</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Borra todos tus movimientos, metas y presupuestos</div>
            </div>
            <button className="btn btn-danger btn-sm" onClick={deleteAllData}>Eliminar datos</button>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  )
}
