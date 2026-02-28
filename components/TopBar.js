'use client'

export default function TopBar() {
    return (
        <header className="top-bar glass-nav" style={{ borderBottom: '1px solid var(--glass-border)', background: 'var(--glass-bg-strong)' }}>
            {/* Logo */}
            <div className="top-bar__logo">
                <span className="top-bar__logo-text">flowi</span>
                <span className="top-bar__logo-dot">.</span>
            </div>

            {/* Currency selector placeholder */}
            <button
                className="top-bar__currency"
                aria-label="Seleccionar moneda"
                title="Selector de moneda (próximamente)"
                type="button"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <span>PYG</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>
        </header>
    )
}
