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

  const handleGoogle = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) setError(error.message)
    setLoading(false)
  }

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
    <div style={styles.page}>
      {/* Background effects */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.noise} />

      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logo} className="animate-fadeUp">
          <span style={styles.logoText}>flowi</span>
          <span style={styles.logoDot}>.</span>
        </div>

        {/* Card */}
        <div style={styles.card} className="animate-fadeUp delay-1">
          <div style={styles.cardHeader}>
            <h1 style={styles.title}>{mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</h1>
            <p style={styles.subtitle}>{mode === 'login' ? 'Ingresa para continuar tu camino financiero' : 'Empieza a controlar tu dinero hoy'}</p>
          </div>

          {/* Google button */}
          <button style={styles.googleBtn} onClick={handleGoogle} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          <div style={styles.divider}><span style={styles.dividerText}>o con correo</span></div>

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

        <p style={styles.legal}>Al continuar aceptas nuestros <a href="#" style={{ color: '#C8F44D' }}>Términos de servicio</a></p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#080810',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute', top: '-10%', left: '-5%',
    width: '500px', height: '500px',
    background: 'radial-gradient(circle, rgba(200,244,77,0.07) 0%, transparent 60%)',
    borderRadius: '50%', pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute', bottom: '-10%', right: '-5%',
    width: '400px', height: '400px',
    background: 'radial-gradient(circle, rgba(123,232,213,0.06) 0%, transparent 60%)',
    borderRadius: '50%', pointerEvents: 'none',
  },
  noise: {
    position: 'absolute', inset: 0, opacity: 0.025, pointerEvents: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
  },
  container: { width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, zIndex: 1 },
  logo: { display: 'flex', alignItems: 'baseline', gap: 1 },
  logoText: { fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-1px' },
  logoDot: { fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: '#C8F44D' },
  card: {
    width: '100%',
    background: '#0F0F1A',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 28,
    padding: '36px 32px',
    boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
  },
  cardHeader: { marginBottom: 28, textAlign: 'center' },
  title: { fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#F0F0F8', letterSpacing: '-0.5px' },
  subtitle: { fontSize: 14, color: '#666680', marginTop: 6, fontWeight: 300 },
  googleBtn: {
    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    padding: '13px 20px', background: '#fff', color: '#000',
    border: 'none', borderRadius: 100, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14,
    transition: 'all 0.2s', marginBottom: 20,
  },
  divider: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 },
  dividerText: { fontSize: 12, color: '#666680', whiteSpace: 'nowrap', fontWeight: 400 },
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
