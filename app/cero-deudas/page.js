import './styles.css';
import PrintButton from './PrintButton';

export const metadata = {
    title: 'El Método Cero Deudas · flowi.',
};

export default function CeroDeudas() {
    return (
        <div className="cero-deudas-container">
            <PrintButton />

            <div className="cd-page">
                {/* Brand Header */}
                <div className="brand">
                    <span className="brand-logo">flowi<span className="brand-dot">.</span></span>
                    <span className="brand-tag">Guía Financiera</span>
                </div>

                {/* Hero */}
                <div className="hero">
                    <div className="hero-eyebrow">El Método</div>
                    <h1><em>Cero</em><br />Deudas</h1>
                    <p className="hero-sub">Cómo optimizar tu salario, eliminar tus deudas en tiempo récord y recuperar tu tranquilidad financiera — incluso si sientes que no te sobra un centavo.</p>
                </div>

                <div className="divider"></div>

                {/* Intro */}
                <div className="intro-card">
                    <p>Si sientes un nudo en el estómago cada vez que revisas tu cuenta bancaria o llega el estado de cuenta de tu tarjeta de crédito, <strong>respira. No estás solo y no eres un fracaso financiero.</strong></p>
                    <p>El sistema tradicional está diseñado exactamente para esto: ofrecerte crédito fácil, empujarte a pagar solo el "pago mínimo" y mantenerte atrapado pagando intereses durante años.</p>
                    <p>Lo que importa hoy es la <strong>responsabilidad de salir de ahí</strong>. Aprende el método exacto para detener la hemorragia de dinero, organizar tus ingresos y destruir tus deudas.</p>
                </div>

                {/* Chapter 1 */}
                <div className="chapter">
                    <div className="chapter-header">
                        <div className="chapter-num">1</div>
                        <div className="chapter-title-group">
                            <div className="chapter-label">Capítulo 1</div>
                            <h2>El Diagnóstico</h2>
                        </div>
                    </div>

                    <p>El gran mito de las finanzas personales es: <strong>"El problema es que gano poco"</strong>. La cruda realidad es que el problema es no tener idea de a dónde va el dinero.</p>
                    <p>Antes de pagar deudas, necesitamos liberar capital de tu salario actual. Para esto, vamos a cazar los <strong>Gastos Vampiro</strong> — pequeños montos que te chupan la sangre financiera día a día sin que lo notes.</p>

                    <ul className="vampire-list">
                        <li>Suscripciones que no usas (apps, plataformas de streaming extra)</li>
                        <li>Comisiones bancarias por manejo de cuenta que podrías evitar</li>
                        <li>Comidas fuera de casa por "no tener tiempo" de planificar</li>
                    </ul>

                    <div className="highlight">
                        <div className="highlight-title">
                            <span>🎯</span> Tu primera misión
                        </div>
                        <p>Abre el extracto de tu cuenta del último mes. Resalta cada gasto que <strong>NO era estrictamente necesario para sobrevivir</strong>. Encontrarás entre un <strong>10% y 15%</strong> de tu salario escondido ahí. Ese dinero será tu munición para atacar las deudas.</p>
                    </div>

                    <div className="rule-card">
                        <div className="rule-card-title">⚡ Regla de Supervivencia Financiera — Código Rojo</div>

                        <div className="rule-row">
                            <div className="rule-pct">50–60%</div>
                            <div className="rule-bar-wrap">
                                <div className="rule-bar-label">Gastos básicos de supervivencia</div>
                                <div className="rule-bar-sub">Renta, comida en casa, luz, transporte</div>
                                <div className="rule-bar-track"><div className="rule-bar-fill" style={{ width: '60%', '--i': 0 }}></div></div>
                            </div>
                        </div>

                        <div className="rule-row">
                            <div className="rule-pct">30–40%</div>
                            <div className="rule-bar-wrap">
                                <div className="rule-bar-label">Destrucción de deudas</div>
                                <div className="rule-bar-sub">Usando el método del Capítulo 2</div>
                                <div className="rule-bar-track"><div className="rule-bar-fill amber" style={{ width: '40%', '--i': 1 }}></div></div>
                            </div>
                        </div>

                        <div className="rule-row">
                            <div className="rule-pct">10%</div>
                            <div className="rule-bar-wrap">
                                <div className="rule-bar-label">Gastos variables mínimos</div>
                                <div className="rule-bar-sub">Porque cortar todo de golpe lleva al abandono</div>
                                <div className="rule-bar-track"><div className="rule-bar-fill red-soft" style={{ width: '10%', '--i': 2 }}></div></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="divider"></div>

                {/* Chapter 2 */}
                <div className="chapter">
                    <div className="chapter-header">
                        <div className="chapter-num">2</div>
                        <div className="chapter-title-group">
                            <div className="chapter-label">Capítulo 2</div>
                            <h2>Destrucción de Deudas</h2>
                        </div>
                    </div>

                    <p>Si tratas de pagar un poquito extra a todas tus deudas al mismo tiempo, no verás progreso y te vas a rendir. Elige la estrategia que mejor se adapte a tu personalidad.</p>

                    <div className="methods-grid">
                        <div className="method-card">
                            <div className="method-icon">❄️</div>
                            <h3>Bola de Nieve</h3>
                            <span className="method-badge psych">Victorias rápidas</span>
                            <p>Ordena deudas de menor a mayor monto. Ataca la más pequeña con todo el dinero extra. Al eliminarla, suma ese pago a la siguiente. La bola crece hasta aplastarlas todas.</p>
                        </div>
                        <div className="method-card">
                            <div className="method-icon">🏔️</div>
                            <h3>Avalancha</h3>
                            <span className="method-badge math">Matemáticamente óptimo</span>
                            <p>Ordena deudas por tasa de interés de mayor a menor. Ataca con todo la deuda más cara (usualmente tarjetas). Pagas menos en total y terminas más rápido.</p>
                        </div>
                    </div>

                    <div className="script-box">
                        <div className="script-box-label">Hack Experto — El Guion de Negociación</div>
                        <div className="script-quote">
                            "Hola. Tengo una tarjeta/crédito con ustedes y he sido un buen cliente, pero actualmente la tasa de interés me está asfixiando. Otros bancos me están ofreciendo comprar mi cartera a una tasa mucho menor. Antes de irme con ellos, quiero saber si ustedes pueden reestructurar mi deuda o bajar mi tasa para poder quedarme."
                        </div>
                        <p className="script-note">Llama a tu banco hoy mismo. El "no" ya lo tienes. Si te dicen que sí, acabas de ahorrarte meses de pagos.</p>
                    </div>
                </div>

                <div className="divider"></div>

                {/* Chapter 3 */}
                <div className="chapter">
                    <div className="chapter-header">
                        <div className="chapter-num">3</div>
                        <div className="chapter-title-group">
                            <div className="chapter-label">Capítulo 3</div>
                            <h2>El Sistema a Prueba de Fallos</h2>
                        </div>
                    </div>

                    <p>Conocer el método es solo el <strong>20% de la batalla</strong>. El 80% es la ejecución. ¿Por qué el 90% de las personas vuelve a endeudarse? Porque confían en su motivación y en hojas de Excel que olvidan actualizar.</p>
                    <p><strong>La disciplina humana se agota; los sistemas, no.</strong> No puedes mejorar lo que no mides en tiempo real.</p>

                    <div className="flowi-cta">
                        <div className="flowi-cta-brand">flowi.</div>
                        <h3>Tu asistente personal para salir de deudas</h3>
                        <p>No es una app contable aburrida. Es el sistema que mantiene vivo tu plan cuando la motivación cae.</p>

                        <div className="flowi-features">
                            <div className="flowi-feat">
                                <div className="flowi-feat-icon">⚡</div>
                                <span>Registrás tus gastos en menos de 3 segundos antes de guardar el ticket</span>
                            </div>
                            <div className="flowi-feat">
                                <div className="flowi-feat-icon">📊</div>
                                <span>Ves exactamente cuánto te queda de tu presupuesto mensual</span>
                            </div>
                            <div className="flowi-feat">
                                <div className="flowi-feat-icon">❄️</div>
                                <span>Proyectás el pago de tus deudas con la Bola de Nieve en gráficos claros</span>
                            </div>
                            <div className="flowi-feat">
                                <div className="flowi-feat-icon">🎯</div>
                                <span>Sin fórmulas de Excel rotas — el sistema hace el trabajo pesado</span>
                            </div>
                        </div>

                        <a href="https://flowi-dun.vercel.app/auth/login" className="flowi-cta-btn">
                            Empezar gratis en Flowi →
                        </a>
                    </div>
                </div>

                <div className="divider"></div>

                {/* Conclusion */}
                <div className="conclusion">
                    <div className="conclusion-icon">✦</div>
                    <h2>El día después del Cero Deudas</h2>
                    <p>Visualiza ese día. El día en que tu salario entra a tu cuenta y es <strong>100% tuyo</strong>. No hay cuotas, no hay llamadas del banco, no hay estrés. Dejas de sobrevivir y empiezas a construir riqueza.</p>
                    <a href="https://flowi-dun.vercel.app/auth/login" className="flowi-cta-btn">
                        Tomar control de mi dinero →
                    </a>
                </div>

                {/* Footer */}
                <div className="footer">
                    <span className="footer-brand">flowi.</span>
                    © 2026 Flowi · Hecho para jóvenes que quieren crecer
                </div>

            </div>
        </div>
    );
}
