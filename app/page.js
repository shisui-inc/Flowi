import Link from 'next/link'

export const metadata = {
  title: 'Flowi — Control financiero inteligente para jóvenes',
  description: 'Flowi es la app de finanzas personales diseñada para que los jóvenes tomen el control de su dinero. Registra gastos, define metas de ahorro y visualiza tu salud financiera en tiempo real.',
  keywords: [
    'finanzas personales', 'control de gastos', 'ahorro jóvenes', 'presupuesto mensual',
    'app finanzas', 'tracker gastos', 'metas ahorro', 'salud financiera', 'fintech',
    'gestión dinero', 'flowi app', 'presupuesto personal'
  ],
  openGraph: {
    title: 'Flowi — Control financiero inteligente para jóvenes',
    description: 'Toma el control de tu dinero con Flowi. Registra gastos, fija metas y visualiza tu salud financiera en tiempo real.',
    type: 'website',
    locale: 'es_LA',
    siteName: 'Flowi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flowi — Control financiero para jóvenes',
    description: 'Toma el control de tu dinero con Flowi.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
}

const features = [
  {
    icon: '📊',
    title: 'Dashboard en tiempo real',
    desc: 'Visualizá tus ingresos, gastos y ahorros de un vistazo. Gráficos claros y actualizados al instante.',
    color: '#C8F44D',
  },
  {
    icon: '🎯',
    title: 'Metas de ahorro',
    desc: 'Definí objetivos concretos y hacé seguimiento de tu progreso. Desde un viaje hasta un fondo de emergencia.',
    color: '#7BE8D5',
  },
  {
    icon: '💳',
    title: 'Control de gastos',
    desc: 'Registrá cada movimiento, categorizalo y encontrá exactamente dónde se va tu dinero cada mes.',
    color: '#B8B8FF',
  },
  {
    icon: '📈',
    title: 'Flujo de 6 meses',
    desc: 'Analizá tendencias de ingresos y gastos en los últimos 6 meses para tomar mejores decisiones.',
    color: '#FFE66D',
  },
  {
    icon: '⚡',
    title: 'Carga ultra rápida',
    desc: 'Interfaz progresiva y optimizada. Tu información siempre disponible, sin esperas interminables.',
    color: '#FF6B6B',
  },
  {
    icon: '🔒',
    title: 'Datos seguros',
    desc: 'Tu información financiera encriptada y protegida. Nunca compartimos tus datos con terceros.',
    color: '#C8F44D',
  },
]

const stats = [
  { value: '100%', label: 'Gratuito para siempre' },
  { value: '< 1s', label: 'Tiempo de carga' },
  { value: '6', label: 'Meses de historial visual' },
  { value: '∞', label: 'Categorías personalizadas' },
]

const faqs = [
  {
    q: '¿Flowi es gratuito?',
    a: 'Sí, Flowi es completamente gratuito. Podés registrarte y empezar a controlar tus finanzas sin pagar nada.',
  },
  {
    q: '¿Es seguro guardar mis datos financieros?',
    a: 'Absolutamente. Usamos Supabase con encriptación de nivel bancario. Tus datos nunca son compartidos con terceros.',
  },
  {
    q: '¿Puedo usarlo en mi celular?',
    a: 'Sí, Flowi está optimizado como PWA (Progressive Web App). Podés instalarlo en tu pantalla de inicio y usarlo como una app nativa.',
  },
  {
    q: '¿En qué monedas puedo trabajar?',
    a: 'Soportamos múltiples monedas: USD, EUR, PYG, ARS, COP, CLP, MXN, BRL y PEN. Podés cambiarla en cualquier momento.',
  },
]

export default function LandingPage() {
  return (
    <div style={{ background: '#080810', color: '#F0F0F8', fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden', position: 'relative' }}>

      {/* ── Ambient background blobs (make glass blur visible) ── */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '55vw', height: '55vw', background: 'radial-gradient(circle, rgba(120,80,255,0.35) 0%, transparent 65%)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', top: '40%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(36,189,255,0.28) 0%, transparent 65%)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '20%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(245,66,152,0.22) 0%, transparent 65%)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', top: '60%', left: '-5%', width: '35vw', height: '35vw', background: 'radial-gradient(circle, rgba(20,220,200,0.20) 0%, transparent 65%)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', top: '20%', left: '55%', width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(200,244,77,0.12) 0%, transparent 65%)', borderRadius: '50%', filter: 'blur(80px)' }} />
      </div>

      {/* ─── NAV ─────────────────────────────────── */}
      <nav className="glass-nav" style={{
        position: 'fixed', top: 16, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(16px, 3vw, 32px)',
        height: 56,
        width: 'min(1000px, calc(100vw - 32px))',
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#F0F0F8', letterSpacing: '-0.5px' }}>flowi</span>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#C8F44D' }}>.</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/auth/login" style={{
            padding: '8px 18px', borderRadius: 100,
            background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
            color: '#AAAABC', fontSize: 14, fontWeight: 500, textDecoration: 'none',
            transition: 'all 0.2s',
          }}>
            Ingresar
          </Link>
          <Link href="/auth/login" style={{
            padding: '9px 20px', borderRadius: 100,
            background: '#C8F44D', color: '#000',
            fontSize: 14, fontWeight: 700, textDecoration: 'none',
            fontFamily: "'Syne', sans-serif",
            boxShadow: '0 0 20px rgba(200,244,77,0.35)',
            transition: 'all 0.2s',
          }}>
            Empezar gratis →
          </Link>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: 'clamp(120px, 12vw, 160px) clamp(20px, 5vw, 80px) 80px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: '10%', left: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(200,244,77,0.1) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(123,232,213,0.08) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '40%', right: '20%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(184,184,255,0.07) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(30px)' }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(200,244,77,0.08)', border: '1px solid rgba(200,244,77,0.2)',
          borderRadius: 100, padding: '6px 16px', marginBottom: 32,
          fontSize: 13, fontWeight: 600, color: '#C8F44D', letterSpacing: '0.02em',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C8F44D', display: 'inline-block', boxShadow: '0 0 8px #C8F44D' }} />
          Gratis · Sin tarjeta · Sin límites
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(40px, 7vw, 88px)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-3px',
          color: '#F0F0F8',
          maxWidth: 900,
          marginBottom: 28,
        }}>
          Tu dinero,{' '}
          <span style={{
            background: 'linear-gradient(135deg, #C8F44D 0%, #7BE8D5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            bajo control
          </span>
          <br />por fin.
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 22px)',
          color: '#AAAABC', fontWeight: 300, lineHeight: 1.7,
          maxWidth: 620, marginBottom: 48,
        }}>
          Flowi es la aplicación de finanzas personales que los jóvenes necesitan.
          Registrá gastos, trazá metas y visualizá tu salud financiera — todo en un lugar.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 64 }}>
          <Link href="/auth/login" style={{
            padding: '16px 36px', borderRadius: 100,
            background: '#C8F44D', color: '#000',
            fontSize: 16, fontWeight: 800, textDecoration: 'none',
            fontFamily: "'Syne', sans-serif",
            boxShadow: '0 8px 40px rgba(200,244,77,0.45)',
            letterSpacing: '-0.3px',
            transition: 'all 0.2s',
          }}>
            Empezar gratis →
          </Link>
          <Link href="#features" style={{
            padding: '16px 32px', borderRadius: 100,
            background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
            color: '#AAAABC', fontSize: 16, fontWeight: 500, textDecoration: 'none',
            transition: 'all 0.2s',
          }}>
            Ver características
          </Link>
        </div>

        {/* Stats */}
        <div className="glass" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          overflow: 'hidden',
          maxWidth: 700,
          width: '100%',
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: '24px 20px', textAlign: 'center',
              background: 'transparent',
              borderRight: i < 3 ? '1px solid var(--glass-border)' : 'none',
            }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, color: '#C8F44D', letterSpacing: '-1px' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#666680', marginTop: 4, fontWeight: 400, lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── APP PREVIEW ─────────────────────────── */}
      <section style={{ padding: '40px clamp(20px, 5vw, 80px) 100px', position: 'relative' }}>
        <div className="glass-lime" style={{
          maxWidth: 1100, margin: '0 auto',
          padding: 'clamp(24px, 4vw, 48px)',
        }}>
          {/* Mini dashboard mockup */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, maxWidth: 700, margin: '0 auto' }}>
            {/* Balance card */}
            <div style={{
              gridColumn: '1 / -1',
              background: 'linear-gradient(135deg, #C8F44D 0%, #9fe030 50%, #7BE8D5 100%)',
              borderRadius: 20, padding: '24px 28px', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, background: 'rgba(255,255,255,0.15)', borderRadius: '50%' }} />
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(0,0,0,0.45)', textTransform: 'uppercase', marginBottom: 8 }}>Balance del mes</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: '#000', letterSpacing: '-1.5px' }}>2.632.400 PYG</p>
              <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
                <div>
                  <p style={{ fontSize: 10, color: 'rgba(0,0,0,0.45)', fontWeight: 600, textTransform: 'uppercase' }}>Ingresos</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: '#000' }}>+3.436.400</p>
                </div>
                <div style={{ width: 1, background: 'rgba(0,0,0,0.15)' }} />
                <div>
                  <p style={{ fontSize: 10, color: 'rgba(0,0,0,0.45)', fontWeight: 600, textTransform: 'uppercase' }}>Gastos</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: '#000' }}>-804.000</p>
                </div>
                <div style={{ marginLeft: 'auto', background: 'rgba(0,0,0,0.12)', borderRadius: 50, padding: '6px 14px', textAlign: 'center' }}>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#000' }}>77%</p>
                  <p style={{ fontSize: 9, color: 'rgba(0,0,0,0.45)', fontWeight: 600, textTransform: 'uppercase' }}>Ahorro</p>
                </div>
              </div>
            </div>

            {/* Stat cards */}
            {[
              { label: 'Movimientos', value: '42', color: '#7BE8D5' },
              { label: 'Mayor gasto', value: '150K', color: '#FF6B6B' },
              { label: 'Tasa ahorro', value: '77%', color: '#C8F44D' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#131325', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${s.color}18`, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color }} />
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#666680', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ────────────────────────────── */}
      <section id="features" style={{ padding: '80px clamp(20px, 5vw, 80px)', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'inline-block', background: 'rgba(123,232,213,0.08)', border: '1px solid rgba(123,232,213,0.2)', borderRadius: 100, padding: '5px 16px', fontSize: 12, fontWeight: 600, color: '#7BE8D5', marginBottom: 20, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Todo lo que necesitás
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-2px', color: '#F0F0F8', lineHeight: 1.1, marginBottom: 16 }}>
            Diseñado para que{' '}
            <span style={{ color: '#C8F44D' }}>gastes menos</span>
            {' '}y ahorres más
          </h2>
          <p style={{ fontSize: 17, color: '#AAAABC', fontWeight: 300, maxWidth: 520, margin: '0 auto' }}>
            Cada función fue pensada para que tomar decisiones financieras sea simple, rápido y hasta... entretenido.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="glass-card" style={{ padding: '32px 28px' }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, background: `radial-gradient(circle, ${f.color}08 0%, transparent 70%)`, pointerEvents: 'none' }} />
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: `${f.color}12`, border: `1px solid ${f.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, marginBottom: 20,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: '#F0F0F8', marginBottom: 10, letterSpacing: '-0.3px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#666680', lineHeight: 1.7, fontWeight: 300 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────── */}
      <section style={{ padding: '80px clamp(20px, 5vw, 80px)', background: 'rgba(200,244,77,0.03)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(200,244,77,0.08)', border: '1px solid rgba(200,244,77,0.2)', borderRadius: 100, padding: '5px 16px', fontSize: 12, fontWeight: 600, color: '#C8F44D', marginBottom: 20, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Así de fácil
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-2px', color: '#F0F0F8', marginBottom: 64 }}>
            Empezá en 3 pasos
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 40 }}>
            {[
              { step: '01', title: 'Registrate gratis', desc: 'Creá tu cuenta con tu correo. Sin tarjeta, sin sorpresas, sin límites.' },
              { step: '02', title: 'Agregá tus movimientos', desc: 'Registrá ingresos y gastos en segundos. Categorizalos y poneles descripción.' },
              { step: '03', title: 'Analizá y mejorá', desc: 'Mirá gráficos, trazá metas y descubrí cómo optimizar tus finanzas mes a mes.' },
            ].map((s, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 72, fontWeight: 800, color: 'rgba(200,244,77,0.06)', lineHeight: 1, marginBottom: -16 }}>{s.step}</div>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(200,244,77,0.15), rgba(200,244,77,0.05))',
                  border: '1px solid rgba(200,244,77,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Syne', sans-serif", fontWeight: 800, color: '#C8F44D', fontSize: 18,
                  margin: '0 auto 20px',
                }}>
                  {parseInt(s.step)}
                </div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: '#F0F0F8', marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#666680', lineHeight: 1.7, fontWeight: 300, maxWidth: 280, margin: '0 auto' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────── */}
      <section style={{ padding: '80px clamp(20px, 5vw, 80px)', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#F0F0F8' }}>
            Preguntas frecuentes
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((faq, i) => (
            <details key={i} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
              <summary style={{
                padding: '20px 24px', fontSize: 16, fontWeight: 600, color: '#F0F0F8',
                cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                {faq.q}
                <span style={{ color: '#C8F44D', fontSize: 20, flexShrink: 0, marginLeft: 16 }}>+</span>
              </summary>
              <p style={{ padding: '0 24px 20px', fontSize: 14, color: '#AAAABC', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ─── CTA FINAL ───────────────────────────── */}
      <section style={{ padding: '80px clamp(20px, 5vw, 80px) 120px' }}>
        <div className="glass-lime" style={{
          maxWidth: 900, margin: '0 auto', textAlign: 'center',
          padding: 'clamp(48px, 6vw, 80px) clamp(24px, 5vw, 60px)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -60, left: -60, width: 250, height: 250, background: 'radial-gradient(circle, rgba(200,244,77,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle, rgba(123,232,213,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 800, letterSpacing: '-2px', color: '#F0F0F8', lineHeight: 1.1, marginBottom: 20 }}>
              ¿Listo para tomar<br />el control de tu dinero?
            </div>
            <p style={{ fontSize: 17, color: '#AAAABC', fontWeight: 300, maxWidth: 480, margin: '0 auto 40px' }}>
              Únete a Flowi hoy. Es completamente gratuito y podés empezar en menos de un minuto.
            </p>
            <Link href="/auth/login" style={{
              display: 'inline-block',
              padding: '18px 48px', borderRadius: 100,
              background: '#C8F44D', color: '#000',
              fontSize: 18, fontWeight: 800, textDecoration: 'none',
              fontFamily: "'Syne', sans-serif",
              boxShadow: '0 12px 48px rgba(200,244,77,0.45)',
              letterSpacing: '-0.3px',
            }}>
              Crear mi cuenta gratis →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '40px clamp(20px, 5vw, 80px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#F0F0F8', letterSpacing: '-0.5px' }}>flowi</span>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#C8F44D' }}>.</span>
        </div>
        <p style={{ fontSize: 13, color: '#444460' }}>© {new Date().getFullYear()} Flowi. Hecho para jóvenes que quieren crecer.</p>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/auth/login" style={{ fontSize: 13, color: '#666680', textDecoration: 'none' }}>Ingresar</Link>
          <a href="#features" style={{ fontSize: 13, color: '#666680', textDecoration: 'none' }}>Características</a>
        </div>
      </footer>

      {/* ─── SEO: JSON-LD Structured Data ──────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Flowi',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web, iOS, Android',
            description: 'Aplicación de finanzas personales para jóvenes. Registrá gastos, trazá metas de ahorro y visualizá tu salud financiera.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', ratingCount: '128' },
          }),
        }}
      />
    </div>
  )
}
