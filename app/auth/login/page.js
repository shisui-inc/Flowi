'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const supabase = createClient()


  const handleEmail = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) setError(error.message)
      else setSuccess('¡Revisa tu correo para confirmar tu cuenta!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message === 'Invalid login credentials' ? 'Email o contraseña incorrectos' : error.message)
      else window.location.href = '/dashboard'
    }
    setLoading(false)
  }

  return (
    <div className="app-shell" style={styles.page}>
      <div style={styles.noise} />

      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logo} className="animate-fadeUp">
          <span style={styles.logoText}>flowi</span>
          <span style={styles.logoDot}>.</span>
        </div>

        {/* Card */}
        <div style={styles.card} className="animate-fadeUp delay-1 glass-strong">
          <div style={styles.cardHeader}>
            <h1 style={styles.title}>{mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</h1>
            <p style={styles.subtitle}>{mode === 'login' ? 'Ingresa para continuar tu camino financiero' : 'Empieza a controlar tu dinero hoy'}</p>
          </div>


          {/* Email form */}
          <form onSubmit={handleEmail} style={styles.form}>
            {mode === 'signup' && (
              <div className="input-wrap">
                <label className="input-label">Tu nombre</label>
                <input className="input" type="text" placeholder="Ej: María González" value={name} onChange={e => setName(e.target.value)} required />
              </div>
            )}
            <div className="input-wrap">
              <label className="input-label">Correo electrónico</label>
              <input className="input" type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="input-wrap">
              <label className="input-label">Contraseña</label>
              <input className="input" type="password" placeholder={mode === 'signup' ? 'Mínimo 6 caracteres' : '••••••••'} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}
            {success && <div style={styles.successBox}>{success}</div>}

            <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
              {loading ? <span className="spinner" /> : mode === 'login' ? 'Ingresar →' : 'Crear cuenta →'}
            </button>
          </form>

          <p style={styles.switchText}>
            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button style={styles.switchBtn} onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }}>
              {mode === 'login' ? 'Regístrate gratis' : 'Ingresar'}
            </button>
          </p>
        </div>

        <p style={styles.legal}>Al continuar aceptas nuestros <a href="#" style={{ color: 'var(--accent-lime)' }}>Términos de servicio</a></p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  },

  noise: {
    position: 'absolute', inset: 0, opacity: 0.025, pointerEvents: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
  },
  container: { width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, zIndex: 1 },
  logo: { display: 'flex', alignItems: 'baseline', gap: 1 },
  logoText: { fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: 'var(--text)', letterSpacing: '-1px' },
  logoDot: { fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: 'var(--accent-lime)' },
  card: {
    width: '100%',
    padding: '36px 32px',
  },
  cardHeader: { marginBottom: 28, textAlign: 'center' },
  title: { fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' },
  subtitle: { fontSize: 14, color: 'var(--text-secondary)', marginTop: 6, fontWeight: 300 },

  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  errorBox: {
    background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.25)',
    color: '#FF6B6B', padding: '10px 14px', borderRadius: 12, fontSize: 13, fontWeight: 400,
  },
  successBox: {
    background: 'rgba(200,244,77,0.1)', border: '1px solid rgba(200,244,77,0.25)',
    color: '#C8F44D', padding: '10px 14px', borderRadius: 12, fontSize: 13, fontWeight: 400,
  },
  switchText: { textAlign: 'center', marginTop: 20, fontSize: 13, color: '#666680' },
  switchBtn: { background: 'none', border: 'none', color: '#C8F44D', cursor: 'pointer', fontWeight: 700, fontSize: 13, padding: 0 },
  legal: { fontSize: 11, color: '#444460', textAlign: 'center' },
}
