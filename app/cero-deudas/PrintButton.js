'use client';

export default function PrintButton() {
    return (
        <button className="fab" onClick={() => window.print()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 15V3M7 10l5 5 5-5M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" />
            </svg>
            Descargar PDF
        </button>
    );
}
